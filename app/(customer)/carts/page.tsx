'use client';

import { useCart } from '@/app/providers/CartProvider';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import NavButton from '@/app/components/NavButton';

export default function CartsPage() {
  const { carts, getCart } = useCart();
  const stores = useQuery(api.stores.list, {
    storeIds: Object.keys(carts) as Id<'stores'>[],
  });

  if (stores === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <NavButton href="/" className="font-medium block">
        ← Back to stores
      </NavButton>
      <h1>Carts</h1>
      <div className="flex flex-col gap-4">
        {Object.keys(carts).map((storeId) => {
          const store = stores.find((store) => store._id === storeId);

          if (!store) return <></>;

          const cart = getCart(store._id);

          return (
            <Link key={storeId} href={`/carts/${storeId}`}>
              <div className="flex gap-2 border p-2 rounded-sm">
                <Image
                  src={store.image}
                  alt={store.name}
                  width={100}
                  height={100}
                />
                <div>
                  <p className="text-lg font-bold">{store.name}</p>
                  <p>
                    Subtotal:{' R'}
                    {cart?.reduce((acc, item) => {
                      return acc + item.price * item.quantity;
                    }, 0)}
                  </p>
                  <p>Items: {cart?.length}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
