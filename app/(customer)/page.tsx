'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const stores = useQuery(api.stores.list);

  if (!stores) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">
          xd<span className="text-green-600">store</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Local shops, delivered fast. Fresh food from your neighborhood stores,
          delivered right to your door.
        </p>
      </div>

      {/* Stores Grid */}
      {
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Link
                key={store._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer"
                href={`/store/${store._id}`}
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <Image
                    src={store.image}
                    alt={store.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={store.logo}
                      alt={`${store.name} logo`}
                      width={100}
                      height={100}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {store.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{store.description}</p>
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors">
                    Go to Store
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      }

      {stores.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No stores available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
