import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

export class ConflictException extends BaseException {
  static statusCode = HttpStatusCode.Conflict;

  constructor(message: string) {
    super(message, {
      statusCode: ConflictException.statusCode,
    });
  }
}
