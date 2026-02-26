import { inject, injectable } from 'tsyringe';
import type {
  AddFamilyRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from '@/application/contracts';
import { type AddFamily, type AddFamilyParams, Family } from '@/domain';
import {
  UnexpectedException,
  UserAlreadyAFamilyMemberException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;
@injectable()
export class DbAddFamily implements AddFamily {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: GetUserByIdRepository &
      UpdateUserRepository,
    @inject(infra.familyRepositories)
    private readonly familyRepository: AddFamilyRepository,
  ) {}

  async execute({
    userId,
    name,
    description,
  }: AddFamilyParams): Promise<Family> {
    try {
      // Fetch user
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) {
        throw new UserNotFoundException();
      }

      if (user.family) {
        throw new UserAlreadyAFamilyMemberException();
      }

      // Create Family entity
      const family = Family.create({
        name: name,
        description,
        ownerId: user.id,
        owner: user,
        createdAt: new Date(),
        createdBy: user.id,
      });

      user.familyId = family.id;

      // Save Family to database
      await this.familyRepository.add(family);

      // Return Family entity
      return family;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  }
}
