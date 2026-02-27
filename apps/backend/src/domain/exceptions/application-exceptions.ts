import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class UnexpectedException extends BaseException {
  statusCode = HttpStatusCode.InternalServerError;

  constructor() {
    super('Ocorreu um erro inesperado');
  }
}

export class UnauthorizedException extends BaseException {
  statusCode = HttpStatusCode.Unauthorized;

  constructor() {
    super('Unauthorized');
  }
}
