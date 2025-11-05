'use client';
import Link from 'next/link';
import { useCart } from '@/app/providers/CartProvider';

export default function CartButton() {
  const { carts } = useCart();

  const numberOfCarts = Object.keys(carts).length;

  if (numberOfCarts === 0) {
    return;
  }

  return (
    <div className="flex items-center gap-4">
      {numberOfCarts <= 1 && (
        <Link
          href={`/carts/${Object.keys(carts)[0]}`}
          className="relative bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Cart (
          {Object.values(carts).reduce(
            (acc, items) =>
              acc + items.reduce((acc, item) => acc + item.quantity, 0),
            0
          )}
          )
        </Link>
      )}
      {numberOfCarts > 1 && (
        <Link
          href="/carts"
          className="relative bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Carts ({numberOfCarts})
        </Link>
      )}
    </div>
  );
}
