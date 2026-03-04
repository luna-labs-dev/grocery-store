import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class ShoppingEventEmptyCartException extends BaseException {
  statusCode = HttpStatusCode.UnprocessableEntity;

  constructor() {
    super('O evento de compras não pode ser encerrado com um carrinho vazio');
  }
}

export class ShoppingEventAlreadyEndedException extends BaseException {
  statusCode = HttpStatusCode.UnprocessableEntity;

  constructor() {
    super('O evento de compras já foi encerrado');
  }
}

export class ShoppingEventNotFoundException extends BaseException {
  statusCode = HttpStatusCode.NotFound;

  constructor() {
    super('O evento de compras não foi encontrado');
  }
}
