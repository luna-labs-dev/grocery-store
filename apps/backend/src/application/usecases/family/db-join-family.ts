import { inject, injectable } from 'tsyringe';
import type {
  GetFamilyByInviteCodeRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from '@/application/contracts';
import type { JoinFamily, JoinFamilyParams } from '@/domain';
import {
  InvalidFamilyInvitationCodeException,
  UnexpectedException,
  UserAlreadyAFamilyMemberException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbJoinFamily implements JoinFamily {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: GetUserByIdRepository &
      UpdateUserRepository,
    @inject(infra.familyRepositories)
    private readonly familyRepository: GetFamilyByInviteCodeRepository,
  ) {}

  async execute({ userId, inviteCode }: JoinFamilyParams): Promise<void> {
    try {
      // Get user
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) {
        throw new UserNotFoundException();
      }

      // If user already a family member, return error
      if (user.family) {
        throw new UserAlreadyAFamilyMemberException();
      }

      // Get family by invite code
      const family = await this.familyRepository.getByInviteCode({
        inviteCode,
      });

      if (!family) {
        throw new InvalidFamilyInvitationCodeException();
      }

      user.familyId = family.id;

      await this.userRepository.update(user);
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  }
}
