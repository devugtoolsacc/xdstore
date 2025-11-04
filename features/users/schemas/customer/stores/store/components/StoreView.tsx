'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import NavButton from '@/app/components/NavButton';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function StoreView(props: {
  preloadedStore: Preloaded<typeof api.stores.get>;
  preloadedItems: Preloaded<typeof api.stores.getItems>;
}) {
  const store = usePreloadedQuery(props.preloadedStore);
  const items = usePreloadedQuery(props.preloadedItems);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(items.map((item) => item.category))];
  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (!store || !items) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <NavButton href="/" className="font-medium block">
        ← Back to stores
      </NavButton>

      {/* Store Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-6">
          <Image
            src={store.logo}
            alt={`${store.name} logo`}
            width={100}
            height={100}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600 mt-2">{store.description}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All Items' : category}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
              !item.isAvailable ? 'opacity-60' : ''
            }`}
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Unavailable</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  R{item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => {}}
                  disabled={!item.isAvailable}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No items found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
