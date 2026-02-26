import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { ok } from '@/api/helpers';
import type { GetMarketById } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

export const getMarketByIdRequestSchema = z.object({
  marketId: z.uuid(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
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
    location,
  }: GetMarketByIdControllerParams): Promise<HttpResponse> {
    const market = await this.getMarketById.execute({
      marketId,
      location,
    });

    const response = {
      id: market.id,
      name: market.name,
      formattedAddress: market.formattedAddress,
      city: market.city,
      neighborhood: market.neighborhood,
      latitude: market.latitude,
      longitude: market.longitude,
      lastUpdatedAt: market.lastUpdatedAt,
      distance: market.distance,
    };

    return ok(response);
  }
}
