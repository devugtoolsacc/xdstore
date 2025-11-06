'use client';
import Image from 'next/image';
import NavButton from '@/app/components/NavButton';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';

export default function AdminPage() {
  const stores = useQuery(api.stores.list, {});

  if (stores === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <NavButton href="/">← Back to home</NavButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Link
            key={store._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            href={`/admin/store/${store._id}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                height={100}
                width={100}
                src={store.image}
                alt={store.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {store.name}
                </h3>
                <p className="text-gray-600 text-sm">{store.description}</p>
              </div>
            </div>
            <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors">
              Manage Store
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
