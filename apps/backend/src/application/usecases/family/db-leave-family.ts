import { inject, injectable } from 'tsyringe';
import type {
  FamilyRepositories,
  UserRepositories,
} from '@/application/contracts';
import type { LeaveFamily, LeaveFamilyParams } from '@/domain';
import {
  UnexpectedException,
  UserNotAFamilyMemberException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbLeaveFamily implements LeaveFamily {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
    @inject(infra.familyRepositories)
    readonly _familyRepository: FamilyRepositories,
  ) {}
  async execute({ userId }: LeaveFamilyParams): Promise<void> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) {
        throw new UserNotFoundException();
      }

      if (!user.family) {
        throw new UserNotAFamilyMemberException();
      }

      user.familyId = undefined;

      await this.userRepository.update(user);
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  }
}
