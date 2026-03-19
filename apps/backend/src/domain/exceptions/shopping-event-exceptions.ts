import { z } from 'zod';
import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

export class ShoppingEventEmptyCartException extends BaseException {
  static statusCode = HttpStatusCode.UnprocessableEntity;

  constructor() {
    super('O evento de compras não pode ser encerrado com um carrinho vazio', {
      statusCode: ShoppingEventEmptyCartException.statusCode,
    });
  }
}

export class ShoppingEventAlreadyEndedException extends BaseException {
  static statusCode = HttpStatusCode.UnprocessableEntity;

  constructor() {
    super('O evento de compras já foi encerrado', {
      statusCode: ShoppingEventAlreadyEndedException.statusCode,
    });
  }
}

export const shoppingEventNotFoundSchema = z.object({
  shoppingEventId: z.string().uuid().optional(),
});

export class ShoppingEventNotFoundException extends BaseException<
  z.infer<typeof shoppingEventNotFoundSchema>
> {
  static statusCode = HttpStatusCode.NotFound;
  static contextSchema = shoppingEventNotFoundSchema;

  constructor(context?: z.infer<typeof shoppingEventNotFoundSchema>) {
    super('O evento de compras não foi encontrado', {
      statusCode: ShoppingEventNotFoundException.statusCode,
      context,
      schema: ShoppingEventNotFoundException.contextSchema,
    });
  }
}
