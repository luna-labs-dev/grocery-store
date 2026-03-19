import { HttpStatusCode } from '../enums/http-status-code';
import { BaseException } from './base-exception';

export class UnexpectedException extends BaseException {
  static statusCode = HttpStatusCode.InternalServerError;

  constructor(message = 'Ocorreu um erro inesperado') {
    super(message, {
      statusCode: UnexpectedException.statusCode,
    });
  }
}

export class UnauthorizedException extends BaseException {
  static statusCode = HttpStatusCode.Unauthorized;

  constructor() {
    super('Unauthorized', {
      statusCode: UnauthorizedException.statusCode,
    });
  }
}

export class ForbiddenException extends BaseException {
  static statusCode = HttpStatusCode.Forbidden;

  constructor(message = 'Forbidden: Insufficient permissions') {
    super(message, {
      statusCode: ForbiddenException.statusCode,
    });
  }
}

export class ServiceUnavailableException extends BaseException {
  static statusCode = HttpStatusCode.ServiceUnavailable;

  constructor(message = 'Serviço temporariamente indisponível') {
    super(message, {
      statusCode: ServiceUnavailableException.statusCode,
    });
  }
}

export class DomainLogicException extends BaseException {
  static statusCode = HttpStatusCode.BadRequest;

  constructor(message = 'Violação de regra de negócio') {
    super(message, {
      statusCode: DomainLogicException.statusCode,
    });
  }
}
