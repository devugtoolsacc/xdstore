import {
  internalMutation,
  internalQuery,
  action,
  query,
  QueryCtx,
} from './_generated/server';
import { v } from 'convex/values';
import { syncClerkUserPermissions } from './http';

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    roles: v.array(
      v.union(v.literal('admin'), v.literal('user'), v.literal('store_admin'))
    ),
  },

  async handler(ctx, { externalId, name, email, imageUrl, roles }) {
    const userAttributes = {
      name: name,
      externalId: externalId,
      email: email,
      imageUrl: imageUrl,
      roles,
    };

    const user = await userByExternalId(ctx, externalId);
    if (user === null) {
      return await ctx.db.insert('users', userAttributes);
    } else {
      return await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.patch(user._id, {
        deletedAt: new Date().getTime(),
        externalId: 'deleted',
        email: 'redacted@deleted.com',
        name: 'Deleted User',
        imageUrl: undefined,
      });
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

export const getUserById = internalQuery({
  args: { id: v.id('users') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getUserByExternalId = internalQuery({
  args: { externalId: v.string() },
  handler: async (ctx, { externalId }) => {
    return await userByExternalId(ctx, externalId);
  },
});

export const syncClerkUserPermissionsAction = action({
  args: { externalId: v.string() },
  handler: async (ctx, { externalId }) => {
    await syncClerkUserPermissions(ctx, externalId);
  },
});
async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byExternalId', (q) => q.eq('externalId', externalId))
    .unique();
}
