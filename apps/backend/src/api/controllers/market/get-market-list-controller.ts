import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import type { GetMarketList } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

const { usecases } = injection;

export const getMarketListRequestSchema = z.object({
  search: z.string().optional(),
  pageIndex: z.coerce.number().min(0).default(0),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  orderBy: z.enum(['createdAt', 'distance']).default('distance'),
  orderDirection: z.enum(['desc', 'asc']).default('asc'),
  location: z
    .object({
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
    .optional(),
  expand: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
});

type GetMarketListControllerRequest = z.infer<
  typeof getMarketListRequestSchema
>;

@injectable()
@controllerErrorHandling()
@controllerFamilyBarrierHandling()
@controllerValidationHandling(getMarketListRequestSchema)
export class GetMarketListController implements Controller {
  constructor(
    @inject(usecases.getMarketList)
    private readonly getMarketList: GetMarketList,
  ) {}

  async handle(request: GetMarketListControllerRequest): Promise<HttpResponse> {
    const {
      location,
      search,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
      expand,
    } = request;

    const getMarketListResult = await this.getMarketList.execute({
      location,
      search,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
      expand,
    });

    if (getMarketListResult.isLeft()) {
      return mapErrorByCode(getMarketListResult.value);
    }

    const market = getMarketListResult.value;

    const response = {
      total: market.total,
      items: market.markets.map((mkt) => ({
        id: mkt.id,
        name: mkt.name,
        formattedAddress: mkt.formattedAddress,
        city: mkt.city,
        neighborhood: mkt.neighborhood,
        latitude: mkt.latitude,
        longitude: mkt.longitude,
        distance: mkt.distance,
        createdAt: mkt.createdAt,
      })),
    };

    return ok(response);
  }
}
