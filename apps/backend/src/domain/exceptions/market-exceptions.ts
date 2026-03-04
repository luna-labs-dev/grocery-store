import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class MarketNotFoundException extends BaseException {
  statusCode = HttpStatusCode.NotFound;

  constructor() {
    super('O mercado não foi encontrado');
  }
}
