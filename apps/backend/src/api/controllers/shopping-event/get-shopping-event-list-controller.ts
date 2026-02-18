import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import { type GetShoppingEventList, validShoppingEventStatus } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

const { usecases } = injection;

export const getShoppingEventListRequestSchema = z.object({
  familyId: z.string().uuid(),
  status: z.enum(validShoppingEventStatus).optional(),
  period: z
    .object({
      start: z.string().datetime({
        offset: true,
      }),
      end: z.string().datetime({
        offset: true,
      }),
    })
    .optional(),
  pageIndex: z.coerce.number().min(0).default(0),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  orderBy: z.enum(['createdAt']).default('createdAt'),
  orderDirection: z.enum(['desc', 'asc']).default('desc'),
});

type GetShoppingEventListControllerParams = z.infer<
  typeof getShoppingEventListRequestSchema
>;

@injectable()
@controllerErrorHandling()
@controllerFamilyBarrierHandling()
@controllerValidationHandling(getShoppingEventListRequestSchema)
export class GetShoppingEventListController implements Controller {
  constructor(
    @inject(usecases.getShoppingEventList)
    private readonly getShoppingEventList: GetShoppingEventList,
  ) {}
  async handle({
    familyId,
    status,
    period,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetShoppingEventListControllerParams): Promise<HttpResponse> {
    const result = await this.getShoppingEventList.execute({
      familyId,
      status,
      period: period && {
        start: new Date(period.start),
        end: new Date(period.end),
      },
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    });

    if (result.isLeft()) {
      return mapErrorByCode(result.value);
    }

    const shoppingEvent = result.value;

    const response = {
      total: shoppingEvent.total,
      items: shoppingEvent.shoppingEvents.map((se) => ({
        id: se.id,
        status: se.status,
        market: se.market?.name,
        totals: {
          retailTotal: se.retailTotal,
          wholesaleTotal: se.wholesaleTotal,
          totalItemsDistinct: se.totalItemsDistinct,
          totalItemsQuantity: se.totalItemsQuantity,
          savingsPercentage: se.savingsPercentage,
        },
        createdAt: se.createdAt,
      })),
    };

    return ok(response);
  }
}
