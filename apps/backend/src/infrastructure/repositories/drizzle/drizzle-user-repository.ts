import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import { userTable } from './setup/schema';
import type { UserRepositories } from '@/application';
import { Family, User } from '@/domain';

@injectable()
export class DrizzleUserRepository implements UserRepositories {
  add = async (user: User): Promise<void> => {
    await db.insert(userTable).values({
      id: user.id,
      email: user.email,
      externalId: user.externalId,
      familyId: user.familyId ?? null,
    });
  };

  update = async (user: User): Promise<void> => {
    await db
      .update(userTable)
      .set({
        email: user.email,
        familyId: user.familyId ?? null,
      })
      .where(eq(userTable.id, user.id));
  };

  getById = async (userId: string): Promise<User | undefined> => {
    const userModel = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      with: {
        family: {
          with: { owner: true, members: true },
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
        family: {
          with: { owner: true, members: true },
        },
      },
    });
    if (!userModel) return undefined;
    return this.toDomain(userModel);
  };

  private toDomain(userModel: any): User {
    return User.create(
      {
        externalId: userModel.externalId,
        email: userModel.email,
        familyId: userModel.familyId ?? undefined,
        family: userModel.family
          ? Family.create(
              {
                ownerId: userModel.family.ownerId,
                owner: User.create(
                  {
                    externalId: userModel.family.owner.externalId,
                    email: userModel.family.owner.email,
                  },
                  userModel.family.owner.id,
                ),
                members: userModel.family.members.map((m: any) =>
                  User.create(
                    {
                      externalId: m.externalId,
                      email: m.email,
                    },
                    m.id,
                  ),
                ),
                name: userModel.family.name,
                description: userModel.family.description ?? undefined,
                inviteCode: userModel.family.inviteCode ?? undefined,
                createdAt: userModel.family.createdAt,
                createdBy: userModel.family.createdBy,
              },
              userModel.family.id,
            )
          : undefined,
      },
      userModel.id,
    );
  }
}
