import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class ProductNotFoundException extends BaseException {
  constructor() {
    super('O produto não foi encontrado', {
      statusCode: HttpStatusCode.NotFound,
    });
  }
}
