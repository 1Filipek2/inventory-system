import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateItemInput } from '../types/item';

interface AddItemFormProps { onAdd: (newItem: CreateItemInput) => Promise<void> }

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd({
        name,
        description,
        quantity: Number(quantity),
        price: Number(price.replace(',', '.')),
      });
      setName(''); setDescription(''); setQuantity(''); setPrice('');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-white border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all hover:border-slate-400";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-900">Add New Stock</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        <div className="md:col-span-3">
            <label className={labelClass}>Product Name</label>
            <input className={inputClass} placeholder="e.g. Office Chair" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="md:col-span-4">
            <label className={labelClass}>Description</label>
            <input className={inputClass} placeholder="Details or SKU..." value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="md:col-span-2">
            <label className={labelClass}>Qty</label>
            <input className={inputClass} type="text" inputMode="numeric" placeholder="0" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </div>

        <div className="md:col-span-2">
            <label className={labelClass}>Price (€)</label>
            <input className={inputClass} type="text" inputMode="decimal" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        
        {/* action but*/}
        <div className="md:col-span-1">
            <button 
            disabled={saving}
            className="w-full h-10.5 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-indigo-600 active:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
            {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Add'}
            </button>
        </div>
      </div>
    </form>
  );
}