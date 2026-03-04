import { clerkClient } from '@clerk/express';
import { inject, injectable } from 'tsyringe';
import type { UserRepositories } from '@/application/contracts';
import { User } from '@/domain';
import { UserAlreadyExistsException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class UserService {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async addUser({ externalId }: { externalId: string }): Promise<void> {
    const userExists = await this.userRepository.getByExternalId(externalId);

    if (userExists) throw new UserAlreadyExistsException();

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
  }

  async getUser({ externalId }: { externalId: string }): Promise<User> {
    let user = await this.userRepository.getByExternalId(externalId);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(externalId);

      user = User.create({
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.fullName ?? '',
        picture: clerkUser.imageUrl,
        externalId,
      });

      await this.userRepository.add(user);
    }

    return user;
  }
}
