import { clerkClient } from '@clerk/express';
import { inject, injectable } from 'tsyringe';
import type {
  AddFamilyRepository,
  FamilyRepositories,
  GetFamilyByInviteCodeRepository,
  UserRepositories,
} from '@/application/contracts';
import { Family } from '@/domain';
import {
  FamilyOwnerCannotBeRemovedException,
  FamilyWithoutMembersException,
  InvalidFamilyInvitationCodeException,
  TargetUserNotAFamilyMemberException,
  UnexpectedException,
  UserAlreadyAFamilyMemberException,
  UserNotAFamilyMemberException,
  UserNotAFamilyOwnerException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class FamilyService {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
    @inject(infra.familyRepositories)
    private readonly familyRepository: FamilyRepositories &
      AddFamilyRepository &
      GetFamilyByInviteCodeRepository,
  ) {}

  async addFamily({
    userId,
    name,
    description,
  }: {
    userId: string;
    name: string;
    description?: string;
  }): Promise<Family> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) throw new UserNotFoundException();
      if (user.family) throw new UserAlreadyAFamilyMemberException();

      const family = Family.create({
        name,
        description,
        ownerId: user.id,
        owner: user,
        createdAt: new Date(),
        createdBy: user.id,
      });

      user.familyId = family.id;

      await this.familyRepository.add(family);

      return family;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getFamily({ userId }: { userId: string }): Promise<Family> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) throw new UserNotFoundException();
      if (!user.family) throw new UserNotAFamilyMemberException();
      if (!user.family.members) throw new FamilyWithoutMembersException();

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

  async joinFamily({
    userId,
    inviteCode,
  }: {
    userId: string;
    inviteCode: string;
  }): Promise<void> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) throw new UserNotFoundException();
      if (user.family) throw new UserAlreadyAFamilyMemberException();

      const family = await this.familyRepository.getByInviteCode({
        inviteCode,
      });

      if (!family) throw new InvalidFamilyInvitationCodeException();

      user.familyId = family.id;

      await this.userRepository.update(user);
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async leaveFamily({ userId }: { userId: string }): Promise<void> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) throw new UserNotFoundException();
      if (!user.family) throw new UserNotAFamilyMemberException();

      user.familyId = undefined;

      await this.userRepository.update(user);
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async removeFamilyMember({
    userId,
    targetUserId,
  }: {
    userId: string;
    targetUserId: string;
  }): Promise<void> {
    try {
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) throw new UserNotFoundException();
      if (!user.family) throw new UserNotAFamilyMemberException();
      if (user.id !== user.family.ownerId)
        throw new UserNotAFamilyOwnerException();

      const memberInFamily = user.family.members?.find(
        (member) => member.id === targetUserId,
      );

      if (!memberInFamily) throw new TargetUserNotAFamilyMemberException();
      if (memberInFamily.id === user.id)
        throw new FamilyOwnerCannotBeRemovedException();

      memberInFamily.familyId = undefined;

      await this.userRepository.update(memberInFamily);
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }
}
