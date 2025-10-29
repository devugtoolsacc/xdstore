'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/checkout', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
    router.push(data.redirectUrl);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form onSubmit={handleCheckout}>
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
}
