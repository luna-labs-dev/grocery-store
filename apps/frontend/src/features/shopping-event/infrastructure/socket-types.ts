export interface SocketProductDto {
  id: string;
  name: string;
  amount: number;
  price: number;
  wholesaleMinAmount?: number | undefined;
  wholesalePrice?: number | undefined;
  addedAt?: string | undefined;
}

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
