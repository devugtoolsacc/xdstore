'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/app/services/useCurrentUser';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import NavButton from '@/app/components/NavButton';

export default function OrdersPage() {
  const { user } = useCurrentUser();
  const orders = useQuery(api.orders.getOrderByCustomer, {
    customerId: user?.id as Id<'users'>,
  });

  if (orders === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <NavButton href="/" className="font-medium block">
        ← Back to stores
      </NavButton>
      <h1>Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          return (
            <Link key={order._id} href={`/orders/${order._id}`}>
              <div className="flex gap-2 border p-2 rounded-sm">
                <Image
                  src={order.store.image || ''}
                  alt={order.store.name || ''}
                  width={100}
                  height={100}
                />
                <div>
                  <p className="text-lg font-bold">{order.store.name}</p>
                  <p>
                    Subtotal:{' R'}
                    {order.items.reduce((acc, item) => {
                      return acc + item.price * item.quantity;
                    }, 0)}
                  </p>
                  <p>Items: {order.items.length}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
