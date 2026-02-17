import { inject, injectable } from 'tsyringe';
import type {
  AddFamilyRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from '@/application/contracts';
import {
  type AddFamily,
  type AddFamilyErrors,
  type AddFamilyParams,
  type Either,
  Family,
  InvalidFamilyNameError,
  left,
  right,
  UnexpectedError,
  UserAlreadyAFamilyMemberError,
  UserNotFoundError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

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
  }: AddFamilyParams): Promise<Either<AddFamilyErrors, Family>> {
    try {
      // Fetch user
      const user = await this.userRepository.getByExternalId(userId);

      if (!user) {
        return left(new UserNotFoundError());
      }

      if (user.family) {
        return left(new UserAlreadyAFamilyMemberError());
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
      const createResult = await this.familyRepository.add(family);

      if (createResult.isLeft()) {
        return left(new InvalidFamilyNameError());
      }

      // Return Family entity
      return right(family);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  }
}
