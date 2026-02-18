import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import type { JoinFamily } from '@/domain';
import {
  controllerErrorHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

const { usecases } = injection;

export const joinFamilyRequestSchema = z.object({
  user: z.string(),
  inviteCode: z.string(),
});

export type JoinFamilyControllerRequest = z.infer<
  typeof joinFamilyRequestSchema
>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(joinFamilyRequestSchema)
export class JoinFamilyController implements Controller {
  constructor(
    @inject(usecases.joinFamily) private readonly joinFamily: JoinFamily,
  ) {}

  async handle({
    user,
    inviteCode,
  }: JoinFamilyControllerRequest): Promise<HttpResponse> {
    const result = await this.joinFamily.execute({ userId: user, inviteCode });

    if (result.isLeft()) {
      return mapErrorByCode(result.value);
    }

    return ok();
  }
}
