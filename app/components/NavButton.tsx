import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NavButton({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className={cn(
        'text-primary hover:text-primary-hover font-medium',
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
