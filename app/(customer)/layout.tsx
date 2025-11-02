'use client';
import { Button } from '@/components/ui/button';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import Link from 'next/link';
// import AdminLink from './Admin';
import { useCurrentUser } from '../services/useCurrentUser';
import { canAccessAdminPages } from '../permissions/general';
// import { canAccessAdminPages } from '../permissions/general';

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10 justify-center">
      <nav className="flex gap-4 container">
        <Link
          href="/"
          className="mr-auto text-lg hover:underline px-2 flex items-center"
        >
          XD Store
        </Link>

        <SignedIn>
          <AdminLink />
          <Link
            href="/products"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            My Products
          </Link>
          <Link
            href="/purchases"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Purchase History
          </Link>
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
    <Link href="/admin" className="hover:bg-accent/10 flex items-center px-2">
      Admin
    </Link>
  );
}
