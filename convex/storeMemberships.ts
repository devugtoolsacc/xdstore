import { v } from 'convex/values';
import { internalQuery } from './_generated/server';

export const getStoreMembershipsByUserId = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('storeMemberships')
      .withIndex('byUserId', (q) => q.eq('userId', args.userId))
      .collect();
  },
});
