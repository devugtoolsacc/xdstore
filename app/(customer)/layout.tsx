'use client';
import { Button } from '@/components/ui/button';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import Link from 'next/link';
import { useCurrentUser } from '../services/useCurrentUser';
import { canAccessAdminPages } from '../permissions/general';
import CartButton from '@/features/users/schemas/customer/cart/components/CartButton';
import CartProvider from '../providers/CartProvider';

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </CartProvider>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors mr-auto"
        >
          xdstore
        </Link>

        <SignedIn>
          <AdminLink />

          <Link
            href="/orders"
            className="hover:bg-accent/10 hidden md:flex items-center px-2"
          >
            Orders
          </Link>
          <CartButton />
          <div className="self-center p-0">
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <Button className="self-center" asChild>
            <SignInButton />
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}

function AdminLink() {
  const { user } = useCurrentUser();

  if (!user || !canAccessAdminPages(user)) return null;
  return (
    <Link
      href="/admin"
      className="hover:bg-accent/10 hidden md:flex items-center px-2"
    >
      Admin
    </Link>
  );
}
