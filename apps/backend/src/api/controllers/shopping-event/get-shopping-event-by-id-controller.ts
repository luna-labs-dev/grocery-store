import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import type { GetShoppingEventById } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

const { usecases } = injection;

export const getShoppingEventByIdRequestSchema = z.object({
  familyId: z.string().uuid(),
  shoppingEventId: z.string().uuid(),
});

type GetShoppingEventByIdControllerParams = z.infer<
  typeof getShoppingEventByIdRequestSchema
>;

@injectable()
@controllerErrorHandling()
@controllerFamilyBarrierHandling()
@controllerValidationHandling(getShoppingEventByIdRequestSchema)
export class GetShoppingEventByIdController implements Controller {
  constructor(
    @inject(usecases.getShoppingEventById)
    private readonly getShoppingEventById: GetShoppingEventById,
  ) {}

  async handle({
    familyId,
    shoppingEventId,
  }: GetShoppingEventByIdControllerParams): Promise<HttpResponse> {
    const result = await this.getShoppingEventById.execute({
      familyId,
      shoppingEventId,
    });

    if (result.isLeft()) {
      return mapErrorByCode(result.value);
    }

    const shoppingEvent = result.value;
    return ok(shoppingEvent.toSummaryDto());
  }
}
