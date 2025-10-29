import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = 'https://payments.yoco.com/api/checkouts';
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.YOCO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 500,
      currency: 'ZAR',
      cancelUrl: 'https://57aa8859bdfc.ngrok-free.app/checkout/cancel',
      successUrl: 'https://57aa8859bdfc.ngrok-free.app/checkout/success',
      failureUrl: 'https://57aa8859bdfc.ngrok-free.app/checkout/failed',
      lineItems: [
        {
          displayName: 'Premium Wireless Headphones',
          quantity: 1,
          pricingDetails: {
            price: 12000,
            taxAmount: null,
            discountAmount: null,
          },
          description: null,
        },
        {
          displayName: 'Protective Case',
          quantity: 1,
          pricingDetails: {
            price: 3000,
            taxAmount: null,
            discountAmount: null,
          },
          description: null,
        },
        {
          displayName: 'Express Shipping',
          quantity: 1,
          pricingDetails: {
            price: 1000,
            taxAmount: null,
            discountAmount: null,
          },
          description: null,
        },
      ],
    }),
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
