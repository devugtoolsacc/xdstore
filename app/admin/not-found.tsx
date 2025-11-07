import NavButton from '@/app/components/NavButton';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Page not found.</p>
      <NavButton href="/" className="mt-4">
        ← Back to stores
      </NavButton>
    </div>
  );
}
