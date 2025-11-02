import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    storeId: v.id("stores"),
    items: v.array(v.object({
      itemId: v.id("items"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    deliveryAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const estimatedDeliveryTime = Date.now() + (45 * 60 * 1000); // 45 minutes from now
    
    return await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      estimatedDeliveryTime,
    });
  },
});

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});

export const getStats = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
    
    const items = await ctx.db
      .query("items")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
    
    const activeOrders = orders.filter(order => 
      !["delivered", "cancelled"].includes(order.status)
    ).length;
    
    const unavailableItems = items.filter(item => !item.isAvailable).length;
    
    const todayRevenue = orders
      .filter(order => {
        const orderDate = new Date(order._creationTime);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString() && 
               order.status === "delivered";
      })
      .reduce((sum, order) => sum + order.total, 0);
    
    return {
      activeOrders,
      unavailableItems,
      todayRevenue,
      totalOrders: orders.length,
    };
  },
});
