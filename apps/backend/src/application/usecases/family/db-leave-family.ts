import { inject, injectable } from 'tsyringe';
import type {
  FamilyRepositories,
  UserRepositories,
} from '@/application/contracts';
import {
  type Either,
  type LeaveFamily,
  type LeaveFamilyErrors,
  type LeaveFamilyParams,
  left,
  right,
  UnexpectedError,
  UserNotAFamilyMemberError,
  UserNotFoundError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;

@injectable()
export class DbLeaveFamily implements LeaveFamily {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
    @inject(infra.familyRepositories)
    readonly _familyRepository: FamilyRepositories,
  ) {}
  async execute({
    userId,
  }: LeaveFamilyParams): Promise<Either<LeaveFamilyErrors, void>> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) {
        return left(new UserNotFoundError());
      }

      if (!user.family) {
        return left(new UserNotAFamilyMemberError());
      }

      user.familyId = undefined;

      await this.userRepository.update(user);

      return right(undefined);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  }
}
