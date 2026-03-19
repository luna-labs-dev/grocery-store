import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import type { GetUserParams, IUserManager, User } from '@/domain';
import { UserNotFoundException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbUserManager implements IUserManager {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async getUser({ externalId }: GetUserParams): Promise<User> {
    const user = await this.userRepository.getById(externalId);

    if (!user) {
      // In Better Auth, the user should always exist in our DB if they have a session
      throw new UserNotFoundException({ externalId });
    }

    return user;
  }
}
