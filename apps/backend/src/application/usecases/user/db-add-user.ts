import { clerkClient } from '@clerk/express';
import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import {
  type AddUser,
  type AddUserErrors,
  type AddUserParams,
  type Either,
  left,
  right,
  User,
  UserAlreadyExistsError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;

@injectable()
export class DbAddUser implements AddUser {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async execute(params: AddUserParams): Promise<Either<AddUserErrors, void>> {
    const { externalId } = params;

    const userExists = await this.userRepository.getByExternalId(externalId);

    if (userExists) {
      return left(new UserAlreadyExistsError());
    }

    const clerkUser = await clerkClient.users.getUser(externalId);

    const { emailAddresses, fullName, imageUrl } = clerkUser;

    const user = User.create({
      email: emailAddresses[0].emailAddress,
      name: fullName ?? '',
      picture: imageUrl,
      externalId,
    });

    await this.userRepository.add(user);

    await clerkClient.users.updateUser(externalId, {
      externalId: user.id,
    });

    return right(undefined);
  }
}
