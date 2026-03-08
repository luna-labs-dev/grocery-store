export type ShoppingEventStatus = 'canceled' | 'finished' | 'ongoing';

const statusMapper: Record<ShoppingEventStatus, string> = {
  ongoing: 'Em andamento',
  finished: 'Finalizada',
  canceled: 'Cancelada',
};

export const fShoppingEventStatus = (status: ShoppingEventStatus) =>
  statusMapper[status];
