import { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import type { Item, CreateItemInput, UpdateItemInput } from './types/item';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Item[]>('http://localhost:5290/api/items');
      const sortedItems = response.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(sortedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (newItem: CreateItemInput) => {
    const response = await axios.post<Item>('http://localhost:5290/api/items', newItem);
    setItems([response.data, ...items]);
  };

  const handleUpdate = async (id: string, updatedData: UpdateItemInput) => {
    const originalItem = items.find(i => i.id === id);
    if (!originalItem) return;
    const updatedItem = { ...originalItem, ...updatedData };
    await axios.put(`http://localhost:5290/api/items/${id}`, updatedItem);
    setItems(prev => prev.map(item => (item.id === id ? updatedItem : item)));
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5290/api/items/${id}`);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#DDDAD0] text-[#57564F] font-sans selection:bg-indigo-100 selection:text-[#57564F]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#57564F]">Inventory Management</h1>
            <p className="mt-1 text-sm text-[#7A7A73] font-medium">System overview & stock control</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Items</div>
            <div className="text-2xl font-mono font-bold text-[#57564F] tabular-nums">
              {loading ? '-' : items.length}
            </div>
          </div>
        </header>

        <main className="grid gap-8">
          <section className="bg-[#FFFF] rounded-md shadow-sm border border-slate-200">
            <AddItemForm onAdd={handleAdd} />
          </section>

          {/* table */}
          <section>
            {loading ? (
              <div className="w-full h-64 bg-slate-100/50 animate-pulse rounded-md border border-slate-200 flex items-center justify-center">
                <span className="text-sm font-medium text-slate-400">Loading data...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white py-16 text-center rounded-md border border-dashed border-slate-300">
                <p className="text-[#57564F] font-medium">No items in inventory</p>
                <p className="text-[#7A7A73] text-sm mt-1">Add your first product above to get started.</p>
              </div>
            ) : (
              <InventoryTable items={items} onDelete={handleDelete} onUpdate={handleUpdate} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}