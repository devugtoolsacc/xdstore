import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    storeIds: v.optional(v.array(v.id('stores'))),
  },
  handler: async (ctx, args) => {
    const stores = await ctx.db
      .query('stores')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    if (args.storeIds) {
      return stores.filter((store) => args.storeIds!.includes(store._id));
    }

    return stores;
  },
});

export const get = query({
  args: { storeId: v.id('stores') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.storeId);
  },
});

export const getItems = query({
  args: { storeId: v.id('stores') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('items')
      .withIndex('by_store', (q) => q.eq('storeId', args.storeId))
      .collect();
  },
});

export const toggleItemAvailability = mutation({
  args: {
    itemId: v.id('items'),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      isAvailable: args.isAvailable,
    });
  },
});

export const createItem = mutation({
  args: {
    storeId: v.id('stores'),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('items', {
      ...args,
      isAvailable: true,
    });
  },
});

export const updateItem = mutation({
  args: {
    itemId: v.id('items'),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const { itemId, ...updates } = args;
    await ctx.db.patch(itemId, updates);
  },
});

export const deleteItem = mutation({
  args: { itemId: v.id('items') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
  },
});
