import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';

interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<string>(''); 
  const [price, setPrice] = useState<string>(''); 

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Item[]>('http://localhost:5290/api/items');
      setItems(response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5290/api/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!quantity || !price) return;
    setSaving(true);
    try {
      const response = await axios.post<Item>('http://localhost:5290/api/items', {
        name,
        description,
        quantity: Number(quantity),
        price: Number(price)
      });
      setItems([response.data, ...items]); // new items on top
      setName('');
      setDescription('');
      setQuantity('');
      setPrice('');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (id: string) => {
    if (!editQuantity || !editPrice) return; 
    try {
      const originalItem = items.find(i => i.id === id)!;
      const updatedItem: Item = {
        ...originalItem,
        quantity: Number(editQuantity),
        price: Number(editPrice)
      };
      await axios.put(`http://localhost:5290/api/items/${id}`, updatedItem);
      setItems(items.map(item => (item.id === id ? updatedItem : item)));
      setEditingId(null);
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + ' €';

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      {/* add item */}
      <form onSubmit={handleAdd} className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50 space-y-2">
        <h2 className="font-semibold">Add New Item</h2>
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded flex-1"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            className="border p-2 rounded w-24"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="Quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded w-24"
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d*"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
          <button
            className={`px-4 py-2 rounded text-white ${saving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Add'}
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="text-gray-500">Inventory is currently empty</div>
      ) : (
        <table className="min-w-full border shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Quantity/unit</th>
              <th className="p-2 text-left">Price €</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.description || '-'}</td>
                
                {/* quantity edit */}
                <td className="p-2">
                  {editingId === item.id ? (
                    <input
                      className="border p-1 rounded w-20"
                      value={editQuantity}
                      onChange={e => setEditQuantity(e.target.value)}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>

                {/* price edit */}
                <td className="p-2">
                  {editingId === item.id ? (
                    <input
                      className="border p-1 rounded w-24"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      type="text"
                      inputMode="decimal"
                      pattern="\d*\.?\d*"
                    />
                  ) : (
                    formatPrice(item.price)
                  )}
                </td>

                <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="p-2 flex space-x-1">
                  {editingId === item.id ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleSave(item.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditQuantity(item.quantity.toString());
                          setEditPrice(item.price.toString());
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
