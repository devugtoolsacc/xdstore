import { Id } from '@/convex/_generated/dataModel';
import { CartItem } from '@/features/users/schemas/customer/cart/components/types/cart';
import { useContext, useState } from 'react';
import { createContext } from 'react';

export const CartContext = createContext<{
  carts: Record<Id<'stores'>, CartItem[]>;
  getCart: (storeId: Id<'stores'>) => CartItem[];
  addToCart: (storeId: Id<'stores'>, item: CartItem) => void;
  removeFromCart: (storeId: Id<'stores'>, itemId: Id<'items'>) => void;
  clearCart: (storeId: Id<'stores'>) => void;
  updateCartItemQuantity: (
    storeId: Id<'stores'>,
    itemId: Id<'items'>,
    quantity: number
  ) => void;
}>({
  carts: {},
  getCart: () => [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateCartItemQuantity: () => {},
});

export function useCart() {
  if (!CartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return useContext(CartContext);
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [carts, setCarts] = useState<Record<Id<'stores'>, CartItem[]>>({});

  const addToCart = (storeId: Id<'stores'>, item: CartItem) => {
    setCarts((prev) => {
      const existing = prev[storeId]?.find((i) => i.itemId === item.itemId);
      return {
        ...prev,
        [storeId]: existing
          ? [
              ...prev[storeId].map((i) =>
                i.itemId === item.itemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            ]
          : [...(prev[storeId] || []), item],
      };
    });
  };

  const removeFromCart = (storeId: Id<'stores'>, itemId: Id<'items'>) => {
    setCarts((prev) => {
      return {
        ...prev,
        [storeId]:
          prev[storeId]?.filter((item) => item.itemId !== itemId) || [],
      };
    });
  };

  const clearCart = (storeId: Id<'stores'>) => {
    setCarts((prev) => {
      const newCarts = { ...prev };
      delete newCarts[storeId];
      return newCarts;
    });
  };

  const updateCartItemQuantity = (
    storeId: Id<'stores'>,
    itemId: Id<'items'>,
    quantity: number
  ) => {
    if (quantity <= 0) {
      setCarts((prev) => {
        return {
          ...prev,
          [storeId]:
            prev[storeId]?.filter((item) => item.itemId !== itemId) || [],
        };
      });
    } else {
      setCarts((prev) => {
        return {
          ...prev,
          [storeId]:
            prev[storeId]?.map((item) =>
              item.itemId === itemId ? { ...item, quantity } : item
            ) || [],
        };
      });
    }
  };

  const getCart = (storeId: Id<'stores'>) => {
    return carts[storeId] || [];
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        getCart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
