import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { createClerkClient, type WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';
import { ActionCtx } from './_generated/server';

const http = httpRouter();

const client = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function syncClerkUserPermissions(
  ctx: ActionCtx,
  externalId: string
) {
  const user = await ctx.runQuery(internal.users.getUserByExternalId, {
    externalId,
  });

  if (!user) return new Response('User not found', { status: 400 });

  const storeMemberships = await ctx.runQuery(
    internal.storeMemberships.getStoreMembershipsByUserId,
    {
      userId: user._id,
    }
  );

  const storeMembershipsWithRoles = storeMemberships.map((membership) => ({
    storeId: membership.storeId,
    roles: membership.roles,
  }));

  await client.users.updateUserMetadata(user.externalId, {
    publicMetadata: {
      storeMemberships: storeMembershipsWithRoles,
      roles: user.roles,
      dbId: user._id,
    },
  });

  return new Response('Session created and user metadata updated', {
    status: 200,
  });
}

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const event = await validateRequest(request);
      if (!event) {
        return new Response('Error verifying webhook', { status: 400 });
      }
      switch (event.type) {
        case 'user.created': // intentional fallthrough
        case 'user.updated':
          const email = event.data.email_addresses.find(
            (e) => e.id === event.data.primary_email_address_id
          );
          const name =
            `${event.data.first_name} ${event.data.last_name}`.trim();

          if (!email) return new Response('Email not found', { status: 400 });
          if (!name) return new Response('Name not found', { status: 400 });

          if (event.type === 'user.created') {
            await ctx.runMutation(internal.users.upsertFromClerk, {
              externalId: event.data.id,
              name,
              email: email.email_address,
              imageUrl: event.data.image_url,
              roles: ['user'],
            });

            const user = await ctx.runQuery(
              internal.users.getUserByExternalId,
              {
                externalId: event.data.id,
              }
            );

            if (!user)
              return new Response('User failed to create', { status: 400 });

            await client.users.updateUserMetadata(user.externalId, {
              publicMetadata: {
                dbId: user._id,
                roles: user.roles,
              },
            });
            return new Response(`User created ${user._id}`, { status: 200 });
          }

          if (event.type === 'user.updated') {
            await ctx.runMutation(internal.users.upsertFromClerk, {
              externalId: event.data.id,
              name,
              email: email.email_address,
              imageUrl: event.data.image_url,
              roles: event.data.public_metadata.roles,
            });
            return new Response(`User updated ${event.data.id}`, {
              status: 200,
            });
          }
        case 'user.deleted':
          if (!event.data.id)
            return new Response('User ID not found', { status: 200 });

          await ctx.runMutation(internal.users.deleteFromClerk, {
            clerkUserId: event.data.id,
          });
          return new Response('User deleted', { status: 200 });
        case 'session.created':
          await syncClerkUserPermissions(ctx, event.data.user_id);
        default:
          return new Response(null, { status: 200 });
      }
    } catch (error) {
      console.error('Error processing webhook', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}

export default http;
