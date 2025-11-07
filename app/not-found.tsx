import NavButton from '@/app/components/NavButton';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <div className="mr-auto flex items-center gap-2">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors mr-auto"
            >
              xdstore
            </Link>
          </div>

          <SignedIn>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-2xl font-bold">Page not found.</p>
          <NavButton href="/" className="mt-4">
            ← Back to home
          </NavButton>
        </div>
      </main>
    </>
  );
}
