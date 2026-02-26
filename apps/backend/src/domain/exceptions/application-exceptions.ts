import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class UnexpectedException extends BaseException {
  constructor() {
    super('Ocorreu um erro inesperado', {
      statusCode: HttpStatusCode.InternalServerError,
    });
  }
}

export class UnauthorizedException extends BaseException {
  constructor() {
    super('Unauthorized', {
      statusCode: HttpStatusCode.Unauthorized,
      extras: { uuid: '123' },
    });
  }
}
