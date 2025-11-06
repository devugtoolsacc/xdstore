'use client';
import NavButton from '@/app/components/NavButton';
import { Id } from '@/convex/_generated/dataModel';
import { use } from 'react';

export default function CancelPage({
  params,
}: {
  params: Promise<{ id: Id<'orders'> }>;
}) {
  const { id } = use(params);
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Payment Canceled</h1>
        <p className="text-gray-500 text-lg">
          Your payment has been canceled. Please try again.
        </p>
        <NavButton
          href={`/orders/${id}`}
          className="mt-4 text-primary hover:text-primary-hover"
        >
          ← Back to order
        </NavButton>
      </div>
    </div>
  );
}
