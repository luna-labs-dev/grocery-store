import type { AddShoppingEventRepository } from './add-shopping-event-repository';
import type { GetShoppingEventByIdRepository } from './get-shopping-event-by-id-repository';
import type { GetShoppingEventListRepository } from './get-shopping-event-list-repository';
import type { UpdateShoppingEventRepository } from './update-shopping-event-repository';

export type ShoppingEventRepositories = GetShoppingEventListRepository &
  GetShoppingEventByIdRepository &
  AddShoppingEventRepository &
  UpdateShoppingEventRepository;

export * from './add-shopping-event-repository';
export * from './cart';
export * from './get-shopping-event-by-id-repository';
export * from './get-shopping-event-list-repository';
export * from './update-shopping-event-repository';
