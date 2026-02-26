import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { ok } from '@/api/helpers';
import type { LeaveFamily } from '@/domain';
import {
  controllerErrorHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

export const leaveFamilyRequestSchema = z.object({
  user: z.string(),
});

export type LeaveFamilyControllerRequest = z.infer<
  typeof leaveFamilyRequestSchema
>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(leaveFamilyRequestSchema)
export class LeaveFamilyController implements Controller {
  constructor(
    @inject(usecases.leaveFamily) private readonly leaveFamily: LeaveFamily,
  ) {}

  async handle({ user }: LeaveFamilyControllerRequest): Promise<HttpResponse> {
    await this.leaveFamily.execute({ userId: user });

    return ok();
  }
}
