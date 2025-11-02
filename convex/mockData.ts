import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingStores = await ctx.db.query("stores").collect();
    if (existingStores.length > 0) {
      return "Database already seeded";
    }

    // Create stores
    const store1 = await ctx.db.insert("stores", {
      name: "Mama's Kitchen",
      description: "Authentic home-cooked meals with love",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      logo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop&crop=face",
      isActive: true,
    });

    const store2 = await ctx.db.insert("stores", {
      name: "Pizza Palace",
      description: "Wood-fired pizzas made fresh daily",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
      logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop",
      isActive: true,
    });

    const store3 = await ctx.db.insert("stores", {
      name: "Burger Barn",
      description: "Gourmet burgers and crispy fries",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
      logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop",
      isActive: true,
    });

    // Create items for Mama's Kitchen
    await ctx.db.insert("items", {
      storeId: store1,
      name: "Chicken Curry",
      description: "Tender chicken in aromatic spices with rice",
      price: 85.00,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Main Course",
    });

    await ctx.db.insert("items", {
      storeId: store1,
      name: "Beef Stew",
      description: "Slow-cooked beef with vegetables and potatoes",
      price: 95.00,
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Main Course",
    });

    await ctx.db.insert("items", {
      storeId: store1,
      name: "Vegetable Biryani",
      description: "Fragrant basmati rice with mixed vegetables",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Vegetarian",
    });

    await ctx.db.insert("items", {
      storeId: store1,
      name: "Samosas (6 pieces)",
      description: "Crispy pastries filled with spiced potatoes",
      price: 35.00,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
      isAvailable: false,
      category: "Appetizer",
    });

    // Create items for Pizza Palace
    await ctx.db.insert("items", {
      storeId: store2,
      name: "Margherita Pizza",
      description: "Classic tomato, mozzarella, and fresh basil",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Pizza",
    });

    await ctx.db.insert("items", {
      storeId: store2,
      name: "Pepperoni Pizza",
      description: "Spicy pepperoni with mozzarella cheese",
      price: 145.00,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Pizza",
    });

    await ctx.db.insert("items", {
      storeId: store2,
      name: "Garlic Bread",
      description: "Crispy bread with garlic butter and herbs",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Sides",
    });

    await ctx.db.insert("items", {
      storeId: store2,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with caesar dressing",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Salads",
    });

    // Create items for Burger Barn
    await ctx.db.insert("items", {
      storeId: store3,
      name: "Classic Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, and cheese",
      price: 89.00,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Burgers",
    });

    await ctx.db.insert("items", {
      storeId: store3,
      name: "Chicken Burger",
      description: "Grilled chicken breast with avocado and mayo",
      price: 79.00,
      image: "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Burgers",
    });

    await ctx.db.insert("items", {
      storeId: store3,
      name: "Loaded Fries",
      description: "Crispy fries with cheese, bacon, and sour cream",
      price: 55.00,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Sides",
    });

    await ctx.db.insert("items", {
      storeId: store3,
      name: "Chocolate Milkshake",
      description: "Rich chocolate milkshake with whipped cream",
      price: 35.00,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop",
      isAvailable: true,
      category: "Beverages",
    });

    return "Database seeded successfully";
  },
});
