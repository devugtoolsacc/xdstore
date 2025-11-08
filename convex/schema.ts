import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

const applicationTables = {
  stores: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    logo: v.string(),
    isActive: v.boolean(),
  }),

  items: defineTable({
    storeId: v.id('stores'),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.string(),
    isAvailable: v.boolean(),
    category: v.string(),
  }).index('by_store', ['storeId']),

  orders: defineTable({
    customerId: v.id('users'),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    storeId: v.id('stores'),
    items: v.array(
      v.object({
        itemId: v.id('items'),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('preparing'),
      v.literal('out_for_delivery'),
      v.literal('delivered'),
      v.literal('cancelled')
    ),
    deliveryAddress: v.string(),
    estimatedDeliveryTime: v.optional(v.number()),
  })
    .index('by_store', ['storeId'])
    .index('by_customer', ['customerId'])
    .index('by_status', ['status']),
  users: defineTable({
    externalId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    roles: v.array(
      v.union(v.literal('admin'), v.literal('user'), v.literal('store_admin'))
    ),
    deletedAt: v.optional(v.number()),
  }).index('byExternalId', ['externalId']),
  storeMemberships: defineTable({
    userId: v.id('users'),
    externalId: v.string(),
    storeId: v.id('stores'),
    role: v.union(v.literal('admin')),
  })
    .index('byExternalId', ['externalId'])
    .index('byStoreId', ['storeId']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
