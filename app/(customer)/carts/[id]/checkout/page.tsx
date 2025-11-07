'use client';
import { use, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import NavButton from '@/app/components/NavButton';
import { useCart } from '@/app/providers/CartProvider';
import Image from 'next/image';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/app/services/useCurrentUser';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: Id<'stores'> }>;
}) {
  const { user } = useCurrentUser();
  const { getCart, clearCart } = useCart();
  const { id } = use(params);

  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'failed'
  >('idle');

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  const createOrder = useMutation(api.orders.create);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const cart = getCart(id as Id<'stores'>);

  if (!cart) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-500 text-lg mb-8">Your cart is empty</p>
        <NavButton href={`/store/${id}`}>← Continue Shopping</NavButton>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 25; // Fixed delivery fee
  const total = subtotal + deliveryFee;

  const handlePayment = async () => {
    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    const baseUrl = window.location.origin;

    try {
      // create order
      const orderId = await createOrder({
        customerId: user?.id as Id<'users'>,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        storeId: id as Id<'stores'>,
        items: cart.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: customerInfo.address,
      });

      setPaymentStatus('success');
      clearCart(id as Id<'stores'>);

      // make payment
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          amount: total,
          cancelUrl: `${baseUrl}/orders/${orderId}/cancel`,
          successUrl: `${baseUrl}/orders/${orderId}`,
          failureUrl: `${baseUrl}/orders/${orderId}/failed`,
          lineItems: cart.map((item) => ({
            displayName: item.name,
            quantity: item.quantity,
            pricingDetails: {
              price: item.price,
              taxAmount: null,
              discountAmount: null,
            },
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again.');
        return;
      }

      router.replace(data.redirectUrl);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customer Information */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <NavButton href={`/carts/${id}`}>← Back to Cart</NavButton>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Delivery Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={customerInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Enter your full delivery address"
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment</h2>
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={isProcessing || paymentStatus === 'processing'}
              className={`w-full py-4 rounded-lg font-medium transition-colors ${
                paymentStatus === 'processing'
                  ? 'bg-yellow-500 text-white'
                  : paymentStatus === 'failed'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {paymentStatus === 'processing' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Payment...
                </div>
              ) : paymentStatus === 'failed' ? (
                'Retry Payment with YOCO'
              ) : (
                `Pay R${total.toFixed(2)} with YOCO`
              )}
            </button>

            {paymentStatus === 'failed' && (
              <p className="text-red-600 text-sm text-center">
                Payment failed. Please check your details and try again.
              </p>
            )}

            <p className="text-xs text-gray-500 text-center">
              Secure payment powered by YOCO. Your payment information is
              encrypted and secure.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-8 h-fit">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.itemId} className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  R{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
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
        </div>
      </div>
    </div>
  );
}
