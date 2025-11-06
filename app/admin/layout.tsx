import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <div className="mr-auto flex items-center gap-2">
          <Link href="/" className="text-lg hover:underline">
            XD Store
          </Link>
          <Badge>Admin</Badge>
        </div>

        <SignedIn>
          <Link
            href="/admin/products"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Orders
          </Link>
          <Link
            href="/admin/sales"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Sales
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
