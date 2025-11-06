'use client';

import { useCart } from '@/app/providers/CartProvider';
import Link from 'next/link';
import Image from 'next/image';
import { Id } from '@/convex/_generated/dataModel';
import { use } from 'react';

export default function CartPage({
  params,
}: {
  params: Promise<{ id: Id<'stores'> }>;
}) {
  const { id } = use(params);
  const { getCart, updateCartItemQuantity } = useCart();
  const cart = getCart(id as Id<'stores'>);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 25; // Fixed delivery fee
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-500 text-lg mb-8">Your cart is empty</p>
        <Link
          href={`/store/${id}`}
          className="text-primary hover:text-primary-hover font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <Link
          href="/"
          className="text-primary hover:text-primary-hover font-medium"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
        {cart.map((item) => (
          <div key={item.itemId} className="p-6 flex md:items-center gap-4">
            <Image
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
              width={64}
              height={64}
            />
            <div className="flex gap-4 flex-col md:flex-row flex-1">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-primary font-medium">
                  R{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateCartItemQuantity(
                      id as Id<'stores'>,
                      item.itemId,
                      item.quantity - 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-medium"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateCartItemQuantity(
                      id as Id<'stores'>,
                      item.itemId,
                      item.quantity + 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-medium"
                >
                  +
                </button>
              </div>
              <div className="md:text-right">
                <p className="font-semibold text-gray-900">
                  R{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    updateCartItemQuantity(id as Id<'stores'>, item.itemId, 0)
                  }
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">R{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">R{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">R{total.toFixed(2)}</span>
          </div>
        </div>
        <Link
          href={`/carts/${id}/checkout`}
          className="block text-center w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
