import { z } from 'zod';
import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

export const groupNotFoundSchema = z.object({
  groupId: z.string().uuid().optional(),
});

export class GroupNotFoundException extends BaseException<
  z.infer<typeof groupNotFoundSchema>
> {
  static statusCode = HttpStatusCode.NotFound;
  static contextSchema = groupNotFoundSchema;

  constructor(context?: z.infer<typeof groupNotFoundSchema>) {
    super('O grupo não foi encontrado', {
      statusCode: GroupNotFoundException.statusCode,
      context,
      schema: GroupNotFoundException.contextSchema,
    });
  }
}

export const invalidGroupInvitationCodeSchema = z.object({
  code: z.string().optional(),
});

export class InvalidGroupInvitationCodeException extends BaseException<
  z.infer<typeof invalidGroupInvitationCodeSchema>
> {
  static statusCode = HttpStatusCode.BadRequest;
  static contextSchema = invalidGroupInvitationCodeSchema;

  constructor(context?: z.infer<typeof invalidGroupInvitationCodeSchema>) {
    super('O código de convite do grupo é inválido', {
      statusCode: InvalidGroupInvitationCodeException.statusCode,
      context,
      schema: InvalidGroupInvitationCodeException.contextSchema,
    });
  }
}

export class UserAlreadyInGroupException extends BaseException {
  static statusCode = HttpStatusCode.Conflict;

  constructor() {
    super('O usuário já é membro deste grupo', {
      statusCode: UserAlreadyInGroupException.statusCode,
    });
  }
}

export class UserNotInGroupException extends BaseException {
  static statusCode = HttpStatusCode.Forbidden;

  constructor() {
    super('O usuário não é membro deste grupo', {
      statusCode: UserNotInGroupException.statusCode,
    });
  }
}

export class UnauthorizedGroupOperationException extends BaseException {
  static statusCode = HttpStatusCode.Forbidden;

  constructor() {
    super('O usuário não tem permissão para realizar esta operação no grupo', {
      statusCode: UnauthorizedGroupOperationException.statusCode,
    });
  }
}

export class LastOwnerCannotLeaveException extends BaseException {
  static statusCode = HttpStatusCode.BadRequest;

  constructor() {
    super('O último dono não pode sair do grupo sem promover outro membro', {
      statusCode: LastOwnerCannotLeaveException.statusCode,
    });
  }
}

export class UserNotMemberOfAnyGroupBarrierException extends BaseException {
  static statusCode = HttpStatusCode.Unauthorized;

  constructor() {
    super('O usuário não é membro de nenhum grupo de colaboração', {
      statusCode: UserNotMemberOfAnyGroupBarrierException.statusCode,
    });
  }
}
