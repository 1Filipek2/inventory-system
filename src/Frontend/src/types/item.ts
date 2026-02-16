export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export type CreateItemInput = Omit<Item, 'id' | 'createdAt'>;
export type UpdateItemInput = Partial<CreateItemInput>;
