import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class MarketNotFoundException extends BaseException {
  constructor() {
    super('O mercado não foi encontrado', {
      statusCode: HttpStatusCode.NotFound,
    });
  }
}
