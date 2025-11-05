import { Id } from '@/convex/_generated/dataModel';

export type CartItem = {
  itemId: Id<'items'>;
  name: string;
  price: number;
  quantity: number;
  image: string;
};
