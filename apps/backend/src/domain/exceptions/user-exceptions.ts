import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class UserNotFoundException extends BaseException {
  constructor() {
    super('O usuário não foi encontrado', {
      statusCode: HttpStatusCode.NotFound,
    });
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super('O usuário já existe', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}
