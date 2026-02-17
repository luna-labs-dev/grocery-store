import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import type { GetMarketById } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

const { usecases } = injection;

export const getMarketByIdRequestSchema = z.object({
  marketId: z.string().uuid(),
});

type GetMarketByIdControllerParams = z.infer<typeof getMarketByIdRequestSchema>;

@injectable()
@controllerErrorHandling()
@controllerFamilyBarrierHandling()
@controllerValidationHandling(getMarketByIdRequestSchema)
export class GetMarketByIdController implements Controller {
  constructor(
    @inject(usecases.getMarketById)
    private readonly getMarketById: GetMarketById,
  ) {}

  async handle({
    marketId,
  }: GetMarketByIdControllerParams): Promise<HttpResponse> {
    const result = await this.getMarketById.execute({
      marketId,
    });

    if (result.isLeft()) {
      return mapErrorByCode(result.value);
    }

    const market = result.value;

    const response = {
      id: market.id,
      code: market.code,
      name: market.name,
      createdAt: market.createdAt,
    };

    return ok(response);
  }
}
