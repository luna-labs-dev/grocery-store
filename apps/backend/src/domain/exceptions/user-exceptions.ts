import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class UserNotFoundException extends BaseException {
  statusCode = HttpStatusCode.NotFound;

  constructor() {
    super('O usuário não foi encontrado');
  }
}

export class UserAlreadyExistsException extends BaseException {
  statusCode = HttpStatusCode.UnprocessableEntity;

  constructor() {
    super('O usuário já existe');
  }
}
