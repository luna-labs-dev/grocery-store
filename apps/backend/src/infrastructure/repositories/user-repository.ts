import { UserMapper } from './mappers';
import type { UserRepositories } from '@/application';
import type { User } from '@/domain';
import { prisma } from '@/main/prisma/client';

export class PrismaUserRepository implements UserRepositories {
  add = async (user: User): Promise<void> => {
    await prisma.user.create({
      data: UserMapper.toCreatePersistence(user),
    });
  };

  update = async (user: User): Promise<void> => {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: UserMapper.toUpdatePersistence(user),
    });
  };

  getById = async (userId: string): Promise<User | undefined> => {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        family: {
          include: {
            owner: true,
            members: true,
          },
        },
      },
    });

    if (!user) {
      return undefined;
    }

    return UserMapper.toDomain(user);
  };

  getByExternalId = async (externalId: string): Promise<User | undefined> => {
    const user = await prisma.user.findFirst({
      where: {
        externalId: externalId,
      },
      include: {
        family: {
          include: {
            owner: true,
            members: true,
          },
        },
      },
    });

    if (!user) {
      return undefined;
    }

    return UserMapper.toDomain(user);
  };
}
