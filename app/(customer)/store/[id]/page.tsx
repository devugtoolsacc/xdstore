import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import StoreView from '@/features/users/schemas/customer/stores/store/components/StoreView';
import { notFound } from 'next/navigation';

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: Id<'stores'> }>;
}) {
  const { id } = await params;
  const preloadedStore = await preloadQuery(api.stores.get, { storeId: id });
  const preloadedItems = await preloadQuery(api.stores.getItems, {
    storeId: id,
  });
  const store = preloadedQueryResult(preloadedStore);
  const items = preloadedQueryResult(preloadedItems);

  if (!store || !items) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StoreView
        preloadedStore={preloadedStore}
        preloadedItems={preloadedItems}
      />
    </Suspense>
  );
}
