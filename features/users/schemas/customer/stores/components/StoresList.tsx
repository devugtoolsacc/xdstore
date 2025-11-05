'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import Image from 'next/image';

export default function StoresList(props: {
  preloadedStores: Preloaded<typeof api.stores.list>;
}) {
  const stores = usePreloadedQuery(props.preloadedStores);

  return (
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
            <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:primary-hover transition-colors cursor-pointer">
              Go to Store
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
