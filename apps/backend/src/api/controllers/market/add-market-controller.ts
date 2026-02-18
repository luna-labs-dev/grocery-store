import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { created, mapErrorByCode } from '@/api/helpers';
import type { AddMarket } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

export const addMarketRequestSchema = z.object({
  user: z.string(),
  marketName: z.string().min(1),
});

type AddMarketControllerRequest = z.infer<typeof addMarketRequestSchema>;

const { usecases } = injection;

@injectable()
@controllerErrorHandling()
@controllerFamilyBarrierHandling()
@controllerValidationHandling(addMarketRequestSchema)
export class AddMarketController implements Controller {
  constructor(
    @inject(usecases.newMarket) private readonly newMarket: AddMarket,
  ) {}

  async handle(request: AddMarketControllerRequest): Promise<HttpResponse> {
    const { marketName, user } = request;

    const result = await this.newMarket.execute({
      marketName,
      user,
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

    return created(response);
  }
}
