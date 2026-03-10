import { z } from 'zod';

export const socketProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  amount: z.number(),
  price: z.number(),
  wholesaleMinAmount: z.number().optional(),
  wholesalePrice: z.number().optional(),
  addedAt: z.string().datetime().optional(),
});

export type SocketProductDto = z.infer<typeof socketProductSchema>;

export interface ServerToClientEvents {
  product_added: (payload: { product: SocketProductDto }) => void;
  product_updated: (payload: { product: SocketProductDto }) => void;
  product_deleted: (payload: { productId: string }) => void;
}

export interface ClientToServerEvents {
  'join-room': (
    payload: { shoppingEventId: string },
    callback?: (response: { status: string; message?: string }) => void,
  ) => void;
  product_added: (payload: {
    shoppingEventId: string;
    product: SocketProductDto;
  }) => void;
  product_updated: (payload: {
    shoppingEventId: string;
    product: SocketProductDto;
  }) => void;
  product_deleted: (payload: {
    shoppingEventId: string;
    productId: string;
  }) => void;
}
