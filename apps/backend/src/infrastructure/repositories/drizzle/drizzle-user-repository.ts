import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import { userTable } from './setup/schema';
import type { UserRepositories } from '@/application';
import { GroupMember, User } from '@/domain';

@injectable()
export class DrizzleUserRepository implements UserRepositories {
  add = async (user: User): Promise<void> => {
    await db.insert(userTable).values({
      id: user.id,
      name: user.name ?? '',
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      externalId: user.externalId ?? null,
    });
  };

  update = async (user: User): Promise<void> => {
    await db
      .update(userTable)
      .set({
        name: user.name ?? '',
        email: user.email,
        image: user.image ?? null,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, user.id));
  };

  getById = async (userId: string): Promise<User | undefined> => {
    const userModel = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      with: {
        groups: {
          with: {
            group: true,
          },
        },
      },
    });
    if (!userModel) return undefined;
    return this.toDomain(userModel);
  };

  getByExternalId = async (externalId: string): Promise<User | undefined> => {
    const userModel = await db.query.userTable.findFirst({
      where: eq(userTable.externalId, externalId),
      with: {
        groups: {
          with: {
            group: true,
          },
        },
      },
    });
    if (!userModel) return undefined;
    return this.toDomain(userModel);
  };

  private toDomain(userModel: any): User {
    const mapUser = (u: any) =>
      User.create(
        {
          externalId: u.externalId ?? undefined,
          email: u.email,
          emailVerified: u.emailVerified ?? false,
          name: u.name,
          image: u.image ?? undefined,
          createdAt: u.createdAt ?? new Date(),
          updatedAt: u.updatedAt ?? new Date(),
        },
        u.id,
      );

    const groups = userModel.groups?.map((gm: any) =>
      GroupMember.create(
        {
          groupId: gm.groupId,
          userId: gm.userId,
          role: gm.role,
          joinedAt: gm.joinedAt,
        },
        // Optional: you could include gm.group mapped to CollaborationGroup if needed
      ),
    );

    return User.create(
      {
        externalId: userModel.externalId ?? undefined,
        email: userModel.email,
        emailVerified: userModel.emailVerified ?? false,
        name: userModel.name,
        image: userModel.image ?? undefined,
        groups,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt,
      },
      userModel.id,
    );
  }
}
