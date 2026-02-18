import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { AddProductToCart } from '../../../../domain/usecases/shopping-event/cart/add-product-to-cart';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

export const addProductToCartRequestSchema = z.object({
  user: z.string(),
  familyId: z.string().uuid(),
  shoppingEventId: z.string().uuid(),
  name: z.string().min(1),
  amount: z.number().gt(0),
  price: z.number().gt(0),
  wholesaleMinAmount: z.number().gt(0).optional(),
  wholesalePrice: z.number().gt(0).optional(),
});

export type AddProductToCartRequest = z.infer<
  typeof addProductToCartRequestSchema
>;

const { usecases } = injection;

@injectable()
@controllerFamilyBarrierHandling()
@controllerErrorHandling()
@controllerValidationHandling(addProductToCartRequestSchema)
export class AddProductToCartController implements Controller {
  constructor(
    @inject(usecases.addProductToCart)
    private readonly addProductToCart: AddProductToCart,
  ) {}

  async handle(request: AddProductToCartRequest): Promise<HttpResponse> {
    const {
      user,
      familyId,
      shoppingEventId,
      name,
      amount,
      wholesaleMinAmount,
      price,
      wholesalePrice,
    } = request;

    const addProductResult = await this.addProductToCart.execute({
      user,
      familyId,
      shoppingEventId,
      name,
      amount,
      wholesaleMinAmount,
      price,
      wholesalePrice,
    });

    if (addProductResult.isLeft()) {
      return mapErrorByCode(addProductResult.value);
    }

    const product = addProductResult.value;

    const response = {
      id: product.id,
      addedAt: product.addedAt,
    };

    return ok(response);
  }
}
