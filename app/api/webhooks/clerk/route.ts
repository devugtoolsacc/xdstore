import { syncClerkUserMetadata } from '@/app/services/clerk';
import { deleteUser, insertUser, updateUser } from '@/features/users/db/users';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type;

    switch (eventType) {
      case 'user.created':
      case 'user.updated':
        const email = evt.data.email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        );
        const name = `${evt.data.first_name} ${evt.data.last_name}`.trim();

        if (!email) return new Response('Email not found', { status: 400 });
        if (!name) return new Response('Name not found', { status: 400 });

        if (evt.type === 'user.created') {
          const user = await insertUser({
            clerkUserId: evt.data.id,
            name,
            email: email.email_address,
            imageUrl: evt.data.image_url,
            role: 'user',
          });

          await syncClerkUserMetadata({
            id: user.id,
            clerkUserId: user.clerkUserId,
            role: user.role,
          });
          return new Response(`User created ${evt.data.id}`, { status: 200 });
        }

        if (evt.type === 'user.updated') {
          await updateUser(
            { clerkUserId: evt.data.id },
            {
              name,
              email: email.email_address,
              imageUrl: evt.data.image_url,
              role: evt.data.public_metadata.role,
            }
          );
          return new Response(`User updated ${evt.data.id}`, { status: 200 });
        }
        break;

      case 'user.deleted':
        if (!evt.data.id)
          return new Response('User ID not found', { status: 200 });

        await deleteUser({ clerkUserId: evt.data.id });
        return new Response('User deleted', { status: 200 });
      default:
        return new Response('Webhook received', { status: 200 });
    }
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
