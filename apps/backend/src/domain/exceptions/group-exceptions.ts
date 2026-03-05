import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class GroupNotFoundException extends BaseException {
  statusCode = HttpStatusCode.NotFound;

  constructor() {
    super('O grupo não foi encontrado');
  }
}

export class InvalidGroupInvitationCodeException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O código de convite do grupo é inválido');
  }
}

export class UserAlreadyInGroupException extends BaseException {
  statusCode = HttpStatusCode.Conflict;

  constructor() {
    super('O usuário já é membro deste grupo');
  }
}

export class UserNotInGroupException extends BaseException {
  statusCode = HttpStatusCode.Forbidden;

  constructor() {
    super('O usuário não é membro deste grupo');
  }
}

export class UnauthorizedGroupOperationException extends BaseException {
  statusCode = HttpStatusCode.Forbidden;

  constructor() {
    super('O usuário não tem permissão para realizar esta operação no grupo');
  }
}

export class LastOwnerCannotLeaveException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O último dono não pode sair do grupo sem promover outro membro');
  }
}

export class UserNotMemberOfAnyGroupBarrierException extends BaseException {
  statusCode = HttpStatusCode.Unauthorized;

  constructor() {
    super('O usuário não é membro de nenhum grupo de colaboração');
  }
}
