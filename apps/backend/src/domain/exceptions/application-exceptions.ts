import { HttpStatusCode } from '../core/enums';
import { BaseException } from '../core/exceptions/base-exception';

export class ConflictException extends BaseException {
  statusCode = HttpStatusCode.Conflict;
}
