import { Id } from '@/convex/_generated/dataModel';
import { CartItem } from '@/features/users/schemas/customer/cart/components/types/cart';
import { useContext, useEffect, useState, useEffectEvent } from 'react';
import { createContext } from 'react';
import { toast } from 'sonner';

export const CartContext = createContext<{
  carts: Record<Id<'stores'>, CartItem[]>;
  getCart: (storeId: Id<'stores'>) => CartItem[] | undefined;
  addToCart: (storeId: Id<'stores'>, item: CartItem) => void;
  removeFromCart: (storeId: Id<'stores'>, itemId: Id<'items'>) => void;
  clearCart: (storeId: Id<'stores'>) => void;
  updateCartItemQuantity: (
    storeId: Id<'stores'>,
    itemId: Id<'items'>,
    quantity: number
  ) => void;
  clearAllCarts: () => void;
  isCartsEmpty: () => boolean;
}>({
  carts: {},
  getCart: () => undefined,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateCartItemQuantity: () => {},
  clearAllCarts: () => {},
  isCartsEmpty: () => true,
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

  const setCartsEffect = useEffectEvent(() => {
    const storedCarts = localStorage.getItem('carts');
    if (storedCarts) {
      const parsedCarts = JSON.parse(storedCarts);
      setCarts((prev) => ({ ...prev, ...parsedCarts }));
    }
  });

  useEffect(() => {
    setCartsEffect();
  }, []);

  const addToCart = (storeId: Id<'stores'>, item: CartItem) => {
    setCarts((prev) => {
      const existing = prev[storeId]?.find((i) => i.itemId === item.itemId);
      const newCarts = {
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
      localStorage.setItem('carts', JSON.stringify(newCarts));
      return newCarts;
    });
  };

  const removeFromCart = (storeId: Id<'stores'>, itemId: Id<'items'>) => {
    setCarts((prev) => {
      const newCarts: Record<Id<'stores'>, CartItem[]> = {
        ...prev,
        [storeId]:
          prev[storeId]?.filter((item) => item.itemId !== itemId) || [],
      };
      const numItems = newCarts[storeId]?.length || 0;
      if (numItems === 0) {
        delete newCarts[storeId];
      }
      localStorage.setItem('carts', JSON.stringify(newCarts));
      return newCarts;
    });
  };

  const clearCart = (storeId: Id<'stores'>) => {
    setCarts((prev) => {
      const newCarts = { ...prev };
      delete newCarts[storeId];
      localStorage.setItem('carts', JSON.stringify(newCarts));
      return newCarts;
    });
  };

  const clearAllCarts = () => {
    setCarts({});
  };

  const updateCartItemQuantity = (
    storeId: Id<'stores'>,
    itemId: Id<'items'>,
    quantity: number
  ) => {
    const cart = carts[storeId];

    if (!cart) {
      toast.error('Cart not found for store');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(storeId, itemId);
      return;
    }

    const item = cart.find((item) => item.itemId === itemId);
    if (!item) {
      toast.error('Item not found in cart for store');
      return;
    }

    const newCart = cart.map((item) =>
      item.itemId === itemId ? { ...item, quantity } : item
    );
    setCarts((prev) => ({ ...prev, [storeId]: newCart }));
    localStorage.setItem('carts', JSON.stringify(carts));
  };

  const getCart = (storeId: Id<'stores'>): CartItem[] | undefined => {
    return carts[storeId];
  };

  const isCartsEmpty = (): boolean => {
    return Object.keys(carts).length === 0;
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
        clearAllCarts,
        isCartsEmpty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
