import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = 'https://payments.yoco.com/api/checkouts';

  const { amount, lineItems, cancelUrl, successUrl, failureUrl } =
    await request.json();
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.YOCO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency: 'ZAR',
      cancelUrl,
      successUrl,
      failureUrl,
      lineItems,
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
