import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import {
  type Either,
  FamilyOwnerCannotBeRemovedError,
  left,
  type RemoveFamilyMember,
  type RemoveFamilyMemberErrors,
  type RemoveFamilyMemberParams,
  right,
  UnexpectedError,
  UserNotAFamilyMemberError,
  UserNotFamilyOwnerError,
  UserNotFoundError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;

@injectable()
export class DbRemoveFamilyMember implements RemoveFamilyMember {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async execute({
    userId,
    userToBeRemovedId,
  }: RemoveFamilyMemberParams): Promise<
    Either<RemoveFamilyMemberErrors, void>
  > {
    try {
      const user = await this.userRepository.getByExternalId(userId);
      if (!user) {
        return left(
          new UserNotFoundError(userId, {
            context: 'request-user',
          }),
        );
      }

      if (!user.family) {
        return left(
          new UserNotAFamilyMemberError(userId, {
            context: 'request-user',
          }),
        );
      }

      if (user.id !== user.family.ownerId) {
        return left(
          new UserNotFamilyOwnerError(userId, { context: 'request-user' }),
        );
      }

      const memberInFamily = user.family.members?.find(
        (member) => member.id === userToBeRemovedId,
      );

      if (!memberInFamily) {
        return left(
          new UserNotAFamilyMemberError(userToBeRemovedId, {
            context: 'user-to-be-removed',
          }),
        );
      }

      if (memberInFamily.id === user.id) {
        return left(new FamilyOwnerCannotBeRemovedError());
      }

      memberInFamily.familyId = undefined;

      await this.userRepository.update(memberInFamily);

      return right(undefined);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  }
}
