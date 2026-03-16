import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import type { GetUserParams, IUserService, User } from '@/domain';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async getUser({ externalId }: GetUserParams): Promise<User> {
    const user = await this.userRepository.getById(externalId);

    if (!user) {
      // In Better Auth, the user should always exist in our DB if they have a session
      throw new Error(`User with externalId ${externalId} not found`);
    }

    return user;
  }
}
