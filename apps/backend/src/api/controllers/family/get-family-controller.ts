import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { familyMapper } from './helpers';
import type { Controller, HttpResponse } from '@/api/contracts';
import { ok } from '@/api/helpers';
import type { GetFamily } from '@/domain';
import {
  controllerErrorHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

export const getFamilyRequestSchema = z.object({
  user: z.string(),
});

export type GetFamilyControllerRequest = z.infer<typeof getFamilyRequestSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(getFamilyRequestSchema)
export class GetFamilyController implements Controller {
  constructor(
    @inject(usecases.getFamily) private readonly getFamily: GetFamily,
  ) {}

  async handle({ user }: GetFamilyControllerRequest): Promise<HttpResponse> {
    const family = await this.getFamily.execute({ userId: user });

    const response = familyMapper.toResponse(family);

    return ok(response);
  }
}
