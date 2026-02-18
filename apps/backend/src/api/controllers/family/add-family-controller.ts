import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { familyMapper } from './helpers';
import type { Controller, HttpResponse } from '@/api/contracts';
import { mapErrorByCode, ok } from '@/api/helpers';
import type { AddFamily } from '@/domain';
import {
  controllerErrorHandling,
  controllerValidationHandling,
} from '@/main/decorators';
import { injection } from '@/main/di/injection-codes';

const { usecases } = injection;

export const addFamilyRequestSchema = z.object({
  user: z.string(),
  name: z.string().max(100),
  description: z.string().optional(),
});

export type addFamilyControllerRequest = z.infer<typeof addFamilyRequestSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(addFamilyRequestSchema)
export class AddFamillyController implements Controller {
  constructor(
    @inject(usecases.addFamily) private readonly addFamily: AddFamily,
  ) {}

  async handle({
    user,
    name,
    description,
  }: addFamilyControllerRequest): Promise<HttpResponse> {
    const result = await this.addFamily.execute({
      userId: user,
      name,
      description,
    });

    if (result.isLeft()) {
      return mapErrorByCode(result.value);
    }

    const family = result.value;

    const response = familyMapper.toResponse(family);

    return ok(response);
  }
}
