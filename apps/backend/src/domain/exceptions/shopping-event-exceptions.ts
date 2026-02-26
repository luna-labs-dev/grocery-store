import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class ShoppingEventEmptyCartException extends BaseException {
  constructor() {
    super('O evento de compras não pode ser encerrado com um carrinho vazio', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class ShoppingEventAlreadyEndedException extends BaseException {
  constructor() {
    super('O evento de compras já foi encerrado', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class ShoppingEventNotFoundException extends BaseException {
  constructor() {
    super('O evento de compras não foi encontrado', {
      statusCode: HttpStatusCode.NotFound,
    });
  }
}
