import type { NewMarketParams } from '@/features/market';

export interface MappedError {
  title: string;
  description?: string;
}

type MakeMappedError = (params?: any) => MappedError;

const mappedErrors: Record<string, MakeMappedError> = {
  MARKET_ALREADY_EXISTS_ERROR: (params: NewMarketParams) => ({
    title: 'Erro ao criar Mercado',
    description: `o mercado "${params.marketName}" já existe`,
  }),
  SHOPPING_EVENT_NOT_FOUND_ERROR: () => ({
    title: 'Evento de compras não localizado',
  }),
  EMPTY_CART_ERROR: () => ({
    title: 'Carrinho vazio',
    description:
      'evento de compras não pode ser encerrado com o carrinho vazio',
  }),
  SHOPPING_EVENT_ALREADY_ENDED_ERROR: () => ({
    title: 'Evento de compras já finalizado',
  }),
  UNKOWN: () => ({
    title: 'Ocorreu um erro inesperado',
    description: 'Contate um administrador',
  }),
};
export const errorMapper = (errorCode: string): MakeMappedError => {
  const mappedError = mappedErrors[errorCode];

  return mappedError ?? mappedErrors.UNKOWN;
};
