import { preloadQuery, preloadedQueryResult } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import StoresList from '@/features/users/schemas/customer/stores/components/StoresList';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default async function Home() {
  const preloadedStores = await preloadQuery(api.stores.list);
  const stores = preloadedQueryResult(preloadedStores);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">
          xd<span className="text-green-600">store</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Local shops, delivered fast. Fresh food from your neighborhood stores,
          delivered right to your door.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Available Stores
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <StoresList preloadedStores={preloadedStores} />
        </Suspense>
      </div>

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
