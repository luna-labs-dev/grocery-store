import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import type { EndShoppingEvent } from '@/domain';
import {
  controllerErrorHandling,
  controllerFamilyBarrierHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

export const EndShoppingEventRequestSchema = z.object({
  shoppingEventId: z.string().uuid(),
  familyId: z.string().uuid(),
  totalPaid: z.number().min(0),
});

export type EndShoppingEventControllerRequest = z.infer<
  typeof EndShoppingEventRequestSchema
>;
const { usecases } = injection;
@injectable()
@controllerErrorHandling()
@controllerFamilyBarrierHandling()
@controllerValidationHandling(EndShoppingEventRequestSchema)
export class EndShoppingEventController implements Controller {
  constructor(
    @inject(usecases.endShoppingEvent)
    private readonly endShoppingEvent: EndShoppingEvent,
  ) {}

  async handle({
    shoppingEventId,
    familyId,
    totalPaid,
  }: EndShoppingEventControllerRequest): Promise<HttpResponse> {
    const endShoppingEventResult = await this.endShoppingEvent.execute({
      shoppingEventId,
      familyId,
      totalPaid,
    });

    if (endShoppingEventResult.isLeft()) {
      return mapErrorByCode(endShoppingEventResult.value);
    }

    const shoppingEvent = endShoppingEventResult.value;
    return ok(shoppingEvent.toSummaryDto());
  }
}
