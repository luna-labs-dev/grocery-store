import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import type { User } from '@/domain';
import { UserAlreadyExistsException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class UserService {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async addUser({ id }: { id: string }): Promise<void> {
    const userExists = await this.userRepository.getById(id);

    if (userExists) throw new UserAlreadyExistsException();

    // Note: Better Auth handles user creation.
    // This method might be used for post-signup logic later if needed.
  }

  async getUser({ id }: { id: string }): Promise<User> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      // In Better Auth, the user should always exist in our DB if they have a session
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }
}
