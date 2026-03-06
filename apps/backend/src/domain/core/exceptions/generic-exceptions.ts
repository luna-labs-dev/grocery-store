import { HttpStatusCode } from '../enums/http-status-code';
import { BaseException } from './base-exception';

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

export class ForbiddenException extends BaseException {
  statusCode = HttpStatusCode.Forbidden;

  constructor(message = 'Forbidden: Insufficient permissions') {
    super(message);
  }
}
