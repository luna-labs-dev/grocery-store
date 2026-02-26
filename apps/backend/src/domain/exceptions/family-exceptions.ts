import { BaseException } from '../core';
import { HttpStatusCode } from '../core/enums';

export class FamilyNotFoundException extends BaseException {
  constructor() {
    super('A família não foi encontrada', {
      statusCode: HttpStatusCode.NotFound,
    });
  }
}

export class InvalidFamilyInvitationCodeException extends BaseException {
  constructor() {
    super('O código de convite da família é inválido', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class FamilyAlreadyExistsException extends BaseException {
  constructor() {
    super('A família já existe', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class UserNotAFamilyOwnerException extends BaseException {
  constructor() {
    super('O usuário não é dono da família', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class FamilyOwnerCannotBeRemovedException extends BaseException {
  constructor() {
    super('O dono da família não pode ser removido', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class FamilyWithoutMembersException extends BaseException {
  constructor() {
    super('A família não possui membros', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class UserAlreadyAFamilyMemberException extends BaseException {
  constructor() {
    super('O usuário já é membro da família', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class TargetUserNotAFamilyMemberException extends BaseException {
  constructor() {
    super('O usuário não é membro da família', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}

export class UserNotAFamilyMemberException extends BaseException {
  constructor() {
    super('O usuário não é membro da família', {
      statusCode: HttpStatusCode.UnprocessableEntity,
    });
  }
}
