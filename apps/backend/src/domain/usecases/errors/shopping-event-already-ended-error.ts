import type { ShoppingEventStatus, UseCaseError } from '@/domain';

export class ShoppingEventAlreadyEndedError
  extends Error
  implements UseCaseError
{
  code: string;
  uuid?: string;
  extras?: any;

  constructor(status: ShoppingEventStatus, uuid?: string) {
    super('The Shopping Event is already ended');
    this.name = 'ShoppingEventAlreadyEndedError';
    this.code = 'SHOPPING_EVENT_ALREADY_ENDED_ERROR';
    this.uuid = uuid;
    this.extras = {
      status,
    };
  }
}
