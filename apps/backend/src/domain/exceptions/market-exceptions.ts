import { z } from 'zod';
import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

export const marketNotFoundSchema = z.object({
  marketId: z.string().uuid().optional(),
});

export class MarketNotFoundException extends BaseException<
  z.infer<typeof marketNotFoundSchema>
> {
  static statusCode = HttpStatusCode.NotFound;
  static contextSchema = marketNotFoundSchema;

  constructor(context?: z.infer<typeof marketNotFoundSchema>) {
    super('O mercado não foi encontrado', {
      statusCode: MarketNotFoundException.statusCode,
      context,
      schema: MarketNotFoundException.contextSchema,
    });
  }
}
