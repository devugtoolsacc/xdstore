'use client';
import { useQuery } from 'convex/react';
import { use } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import NavButton from '@/app/components/NavButton';
// import { useSound } from 'use-sound';

const statusSteps = [
  {
    key: 'pending',
    label: 'Order Pending',
    description: "We've received your order",
  },
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Restaurant is preparing your order',
  },
  {
    key: 'preparing',
    label: 'Preparing',
    description: 'Your food is being prepared',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Driver is on the way',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Order has been delivered',
  },
];

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: Id<'orders'> }>;
}) {
  const { id } = use(params);
  const order = useQuery(api.orders.get, { orderId: id });

  // const prevStatusRef = useRef<string | null>(null);
  // const [playStatusChange] = useSound('/sounds/notification-1.wav', {
  //   volume: 0.5,
  // });

  // useEffect(() => {
  //   console.log('order', order);

  //   if (order === undefined || !order) return;
  //   const prev = prevStatusRef.current;
  //   if (prev && prev !== order.status) {
  //     playStatusChange();
  //   }
  //   prevStatusRef.current = order.status;
  // }, [order, order?.status, playStatusChange]);

  if (order === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Order not found.</p>
        <NavButton
          href="/orders"
          className="mt-4 text-primary hover:text-primary-hover"
        >
          ← Back to orders
        </NavButton>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );
  const estimatedTime = order.estimatedDeliveryTime
    ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Track Your Order
        </h1>
        <p className="text-gray-600">Order ID: {id}</p>
        {estimatedTime && order.status !== 'delivered' && (
          <p className="text-primary font-medium mt-2">
            Estimated delivery: {estimatedTime}
          </p>
        )}
      </div>

      {/* Order Status Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="space-y-8">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p
                    className={`text-sm ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-gray-600'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
                {isCurrent && (
                  <div className="animate-pulse">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Order Details
        </h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">
                R{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">R{order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">R{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <NavButton
          href="/orders"
          className="mt-4 text-primary hover:text-primary-hover"
        >
          ← Back to orders
        </NavButton>
      </div>
    </div>
  );
}
