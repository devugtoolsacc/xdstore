import crypto from 'crypto';
import { env } from '@/data/env/server';

interface YocoWebhookEvent {
  type: 'payment.succeeded';
  payload: {
    metadata: {
      checkoutId: string;
    };
  };
}

const convexQueryUrl = `${env.CONVEX_URL}/api/query`;
const convexMutationUrl = `${env.CONVEX_URL}/api/mutation`;

export async function POST(request: Request) {
  console.log('Yoco webhook received');

  const event = await validateYocoWebhookRequest(request);
  if (!event) {
    return new Response('Error verifying webhook', { status: 400 });
  }

  const requestBody = {
    path: 'orders:getOrderByCheckoutId',
    args: { checkoutId: event.payload.metadata.checkoutId },
    format: 'json',
  };

  if (event.type === 'payment.succeeded') {
    const response = await fetch(convexQueryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const order = await response.json();

    if (!order) {
      return new Response('Order not found', { status: 400 });
    }

    const orderId = order.value._id;
    const updateOrderBody = {
      path: 'orders:updateStatus',
      args: { orderId, status: 'pending' },
      format: 'json',
    };
    const updateOrderResponse = await fetch(convexMutationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateOrderBody),
    });

    if (!updateOrderResponse.ok) {
      console.error('Failed to update order', await updateOrderResponse.json());
      return new Response('Failed to update order', { status: 400 });
    }

    console.log('Order updated', orderId);
    return new Response('Order updated', { status: 200 });
  }

  console.log('Webhook received', event.type);
  return new Response('Webhook received', { status: 200 });
}

async function validateYocoWebhookRequest(
  req: Request
): Promise<null | YocoWebhookEvent> {
  const headers = req.headers;
  const requestBody = await req.json();

  const id = headers.get('webhook-id');
  const timestamp = headers.get('webhook-timestamp');

  const signedContent = `${id}.${timestamp}.${JSON.stringify(requestBody)}`;
  const secret = process.env.YOCO_WEBHOOK_SECRET!;

  const secretBytes = Buffer.from(secret.split('_')[1], 'base64');

  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64');

  const signature =
    headers.get('webhook-signature')?.split(' ')[0].split(',')[1] ?? '';

  if (
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  ) {
    return requestBody as unknown as YocoWebhookEvent;
  }

  return null;
}
