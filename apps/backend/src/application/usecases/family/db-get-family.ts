import { clerkClient } from '@clerk/express';
import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import type { Family, GetFamily, GetFamilyParams } from '@/domain';
import {
  FamilyWithoutMembersException,
  UnexpectedException,
  UserNotAFamilyMemberException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbGetFamily implements GetFamily {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
    // @inject(infra.userInfo) private readonly userinfo: UserInfo,
  ) {}

  async execute({ userId }: GetFamilyParams): Promise<Family> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) {
        throw new UserNotFoundException();
      }

      if (!user.family) {
        throw new UserNotAFamilyMemberException();
      }

      if (!user.family.members) {
        throw new FamilyWithoutMembersException();
      }

      for (const member of user.family.members) {
        const userInfo = await clerkClient.users.getUser(member.externalId);

        member.setUserInfo({
          name: userInfo.fullName ?? '',
          picture: userInfo.imageUrl,
        });
      }

      const userInfo = await clerkClient.users.getUser(user.externalId);

      user.family.owner.setUserInfo({
        name: userInfo.fullName ?? '',
        picture: userInfo.imageUrl,
      });

      return user.family;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  }
}
