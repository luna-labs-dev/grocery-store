import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import type { RemoveFamilyMember, RemoveFamilyMemberParams } from '@/domain';
import {
  FamilyOwnerCannotBeRemovedException,
  TargetUserNotAFamilyMemberException,
  UnexpectedException,
  UserNotAFamilyMemberException,
  UserNotAFamilyOwnerException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbRemoveFamilyMember implements RemoveFamilyMember {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async execute({
    userId,
    targetUserId,
  }: RemoveFamilyMemberParams): Promise<void> {
    try {
      const user = await this.userRepository.getByExternalId(userId);
      if (!user) {
        throw new UserNotFoundException();
      }

      if (!user.family) {
        throw new UserNotAFamilyMemberException();
      }

      if (user.id !== user.family.ownerId) {
        throw new UserNotAFamilyOwnerException();
      }

      const memberInFamily = user.family.members?.find(
        (member) => member.id === targetUserId,
      );

      if (!memberInFamily) {
        throw new TargetUserNotAFamilyMemberException();
      }

      if (memberInFamily.id === user.id) {
        throw new FamilyOwnerCannotBeRemovedException();
      }

      memberInFamily.familyId = undefined;

      await this.userRepository.update(memberInFamily);
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  }
}
