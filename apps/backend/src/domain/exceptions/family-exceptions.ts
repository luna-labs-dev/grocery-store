import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class FamilyNotFoundException extends BaseException {
  statusCode = HttpStatusCode.NotFound;

  constructor() {
    super('A família não foi encontrada');
  }
}

export class InvalidFamilyInvitationCodeException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O código de convite da família é inválido');
  }
}

export class FamilyAlreadyExistsException extends BaseException {
  statusCode = HttpStatusCode.Conflict;

  constructor() {
    super('A família já existe');
  }
}

export class UserNotAFamilyOwnerException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O usuário não é dono da família');
  }
}

export class FamilyOwnerCannotBeRemovedException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O dono da família não pode ser removido');
  }
}

export class FamilyWithoutMembersException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('A família não possui membros');
  }
}

export class UserAlreadyAFamilyMemberException extends BaseException {
  statusCode = HttpStatusCode.Conflict;

  constructor() {
    super('O usuário já é membro da família');
  }
}

export class TargetUserNotAFamilyMemberException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O usuário não é membro da família');
  }
}

export class UserNotAFamilyMemberException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O usuário não é membro da família');
  }
}

export class UserNotAFamilyMemberBarrierException extends BaseException {
  statusCode = HttpStatusCode.Unauthorized;

  constructor() {
    super('O usuário não é membro da família');
  }
}
