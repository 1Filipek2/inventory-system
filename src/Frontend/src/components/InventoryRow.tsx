import { useState } from 'react';
import type { Item } from '../types/item';

interface InventoryRowProps {
  item: Item;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updatedData: Partial<Item>) => Promise<void>;
}

export default function InventoryRow({ item, onDelete, onUpdate }: InventoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(item.quantity.toString());
  const [editPrice, setEditPrice] = useState(item.price.toString());
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    const q = Number(editQuantity);
    const p = Number(editPrice.replace(',', '.'));

    if (isNaN(q) || editQuantity.trim() === '') { setError('Invalid Qty'); return false; }
    if (q < 0) { setError('Qty < 0'); return false; }
    if (isNaN(p) || editPrice.trim() === '') { setError('Invalid Price'); return false; }
    if (p < 0) { setError('Price < 0'); return false; }

    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await onUpdate(item.id, {
        quantity: Number(editQuantity),
        price: Number(editPrice.replace(',', '.'))
      });
      setIsEditing(false);
      setError(null);
    } catch {
      setError('Save failed');
    }
  };

  const handleCancel = () => {
    setEditQuantity(item.quantity.toString());
    setEditPrice(item.price.toString());
    setError(null);
    setIsEditing(false);
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(price);

  const inputBase = "w-full text-right text-sm px-2 py-1 rounded-sm border outline-none transition-all font-mono tabular-nums";
  const inputNormal = "border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600";
  const inputError = "border-red-500 text-red-600 bg-red-50 focus:border-red-600";

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      
      {/* name */}
      <td className="p-4 align-top">
        <div className="font-semibold text-sm text-[#57564F]">{item.name}</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {item.id.slice(0,8)}</div>
      </td>
      
      {/* description */}
      <td className="p-4 align-top text-sm text-[#7A7A73] leading-relaxed">
        {item.description || <span className="text-slate-300 italic">-</span>}
      </td>
      
      {/* quantity */}
      <td className="p-4 align-top text-right">
        {isEditing ? (
          <input 
            className={`${inputBase} ${error && error.includes('Qty') ? inputError : inputNormal}`}
            value={editQuantity} 
            onChange={e => { setEditQuantity(e.target.value); setError(null); }} 
            inputMode="numeric"
          />
        ) : (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold tabular-nums border ${
            item.quantity < 5 
              ? 'bg-red-50 text-red-700 border-red-100' 
              : 'bg-white text-slate-700 border-slate-200'
          }`}>
            {item.quantity}
          </span>
        )}
      </td>

      {/* price*/}
      <td className="p-4 align-top text-right font-medium text-sm text-[#57564F] tabular-nums font-mono">
        {isEditing ? (
          <input 
            className={`${inputBase} ${error && error.includes('Price') ? inputError : inputNormal}`}
            value={editPrice} 
            onChange={e => { setEditPrice(e.target.value); setError(null); }} 
            inputMode="decimal"
          />
        ) : (
          formatPrice(item.price)
        )}
      </td>

      {/* actions */}
      <td className="p-4 align-top text-center relative">
        <div className="flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="text-xs font-bold text-[#4CBB17] hover:text-[#006742] hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                SAVE
              </button>
              <button onClick={handleCancel} className="text-xs font-medium text-red-600 hover:text-red-800 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                ESC
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                title="Edit Item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button 
                onClick={() => onDelete(item.id)} 
                className="text-slate-400 hover:text-red-600 transition-colors p-1"
                title="Delete Item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </>
          )}
        </div>
        
        {error && isEditing && (
          <div className="absolute right-4 top-14 w-32 text-right">
             <span className="text-[10px] uppercase font-bold text-white bg-red-600 px-1.5 py-0.5 rounded-sm shadow-sm tracking-wide">
              {error}
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}