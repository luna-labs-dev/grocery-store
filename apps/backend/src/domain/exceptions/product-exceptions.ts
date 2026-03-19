import { z } from 'zod';
import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

export const productNotFoundSchema = z.object({
  productId: z.string().uuid().optional(),
  barcode: z.string().optional(),
});

export class ProductNotFoundException extends BaseException<
  z.infer<typeof productNotFoundSchema>
> {
  static statusCode = HttpStatusCode.NotFound;
  static contextSchema = productNotFoundSchema;

  constructor(context?: z.infer<typeof productNotFoundSchema>) {
    super('O produto não foi encontrado', {
      statusCode: ProductNotFoundException.statusCode,
      context,
      schema: ProductNotFoundException.contextSchema,
    });
  }
}
