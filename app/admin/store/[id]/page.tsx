'use client';

import { use, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import NavButton from '@/app/components/NavButton';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';

export default function StorePage({
  params,
}: {
  params: Promise<{ id: Id<'stores'> }>;
}) {
  const { id } = use(params);
  const store = useQuery(api.stores.get, { storeId: id });
  const stats = useQuery(api.orders.getStats, { storeId: id });
  const orders = useQuery(api.orders.getByStore, { storeId: id });
  const items = useQuery(api.stores.getItems, { storeId: id });

  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const toggleItemAvailability = useMutation(api.stores.toggleItemAvailability);
  const createItem = useMutation(api.stores.createItem);
  const updateItem = useMutation(api.stores.updateItem);
  const deleteItem = useMutation(api.stores.deleteItem);

  const [activeTab, setActiveTab] = useState<'orders' | 'items'>('orders');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Doc<'items'> | null>(null);

  if (
    store === undefined ||
    stats === undefined ||
    orders === undefined ||
    items === undefined
  ) {
    return <LoadingSpinner />;
  }

  if (!store) {
    notFound();
  }

  const handleStatusUpdate = async (orderId: Id<'orders'>, status: string) => {
    try {
      await updateOrderStatus({
        orderId,
        status: status as
          | 'pending'
          | 'confirmed'
          | 'preparing'
          | 'out_for_delivery'
          | 'delivered'
          | 'cancelled',
      });
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleToggleAvailability = async (
    itemId: Id<'items'>,
    isAvailable: boolean
  ) => {
    try {
      await toggleItemAvailability({ itemId, isAvailable });
      toast.success(`Item ${isAvailable ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update item availability');
    }
  };

  const handleSaveItem = async (itemData: Partial<Doc<'items'>>) => {
    try {
      if (editingItem) {
        await updateItem({
          itemId: editingItem._id,
          name: itemData.name || '',
          description: itemData.description || '',
          image: itemData.image || '',
          price: itemData.price || 0,
          category: itemData.category || '',
        });
        toast.success('Item updated');
      } else {
        await createItem({
          storeId: id,
          name: itemData.name || '',
          description: itemData.description || '',
          image: itemData.image || '',
          price: itemData.price || 0,
          category: itemData.category || '',
        });
        toast.success('Item created');
      }
      setShowItemModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const handleDeleteItem = async (itemId: Id<'items'>) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem({ itemId });
        toast.success('Item deleted');
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <NavButton
            href="/admin"
            className="text-primary hover:text-primary-hover font-medium"
          >
            ← Back to stores
          </NavButton>
          <div className="flex items-center gap-3">
            <Image
              src={store.image}
              alt={store.name}
              width={100}
              height={100}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">Active Orders</h3>
            <p className="text-3xl font-bold text-primary mt-2">
              {stats.activeOrders}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Unavailable Items
            </h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.unavailableItems}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Today&apos;s Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              R{stats.todayRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalOrders}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-1 font-medium ${
            activeTab === 'orders'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-2 px-1 font-medium ${
            activeTab === 'items'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Items
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && orders && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'preparing'
                                ? 'bg-orange-100 text-orange-800'
                                : order.status === 'out_for_delivery'
                                  ? 'bg-purple-100 text-purple-800'
                                  : order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          void handleStatusUpdate(order._id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && items && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowItemModal(true);
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <Image
                  width={100}
                  height={100}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-primary">
                      R{item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={(e) =>
                          void handleToggleAvailability(
                            item._id,
                            e.target.checked
                          )
                        }
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600">Available</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowItemModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void handleDeleteItem(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <ItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function ItemModal({
  item,
  onSave,
  onClose,
}: {
  item: Doc<'items'> | null;
  onSave: (itemData: Partial<Doc<'items'>>) => Promise<void>;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Doc<'items'>>>(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {item ? 'Edit Item' : 'Add New Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (R)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
