export type ShoppingEventStatus = 'CANCELED' | 'FINISHED' | 'ONGOING';

const statusMapper: Record<ShoppingEventStatus, string> = {
  ONGOING: 'Em andamento',
  FINISHED: 'Finalizado',
  CANCELED: 'Cancelado',
};

export const getStatus = (status: ShoppingEventStatus) => {
  return statusMapper[status];
};
