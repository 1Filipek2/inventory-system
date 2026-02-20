import type { Item } from '../types/item';
import InventoryRow from './InventoryRow';

interface InventoryTableProps {
  items: Item[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updatedData: Partial<Item>) => Promise<void>;
}

export default function InventoryTable({ items, onDelete, onUpdate }: InventoryTableProps) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-bold text-[#57564F] uppercase tracking-wider w-[25%]">Product</th>
              <th className="py-3 px-4 text-xs font-bold text-[#7A7A73] uppercase tracking-wider w-[35%]">Details</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-[#57564F] uppercase tracking-wider w-[15%]">Stock</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-[#57564F] uppercase tracking-wider w-[15%]">Price</th>
              <th className="py-3 px-4 text-center text-xs font-bold text-[#7A7A73] uppercase tracking-wider w-[10%]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <InventoryRow key={item.id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}