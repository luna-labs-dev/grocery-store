import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

export class ProductHierarchyValidationException extends BaseException {
  statusCode = HttpStatusCode.BadRequest;
}
