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
      name: user.name ?? '',
      email: user.email,
      emailVerified: false,
      image: user.picture ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      externalId: user.externalId ?? null,
      familyId: user.familyId ?? null,
    });
  };

  update = async (user: User): Promise<void> => {
    await db
      .update(userTable)
      .set({
        name: user.name ?? '',
        email: user.email,
        image: user.picture ?? null,
        updatedAt: new Date(),
        familyId: user.familyId ?? null,
      })
      .where(eq(userTable.id, user.id));
  };

  getById = async (userId: string): Promise<User | undefined> => {
    const userModel = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      with: {
        family: {
          with: {
            owner: true,
            members: true,
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
        family: {
          with: {
            owner: true,
            members: true,
          },
        },
      },
    });
    if (!userModel) return undefined;
    return this.toDomain(userModel);
  };

  private toDomain(userModel: any): User {
    return User.create(
      {
        externalId: userModel.externalId ?? undefined,
        email: userModel.email,
        name: userModel.name,
        picture: userModel.image ?? undefined,
        familyId: userModel.familyId ?? undefined,
        family: userModel.family
          ? Family.create(
              {
                ownerId: userModel.family.ownerId,
                owner: User.create(
                  {
                    externalId: userModel.family.owner.externalId ?? undefined,
                    email: userModel.family.owner.email,
                    name: userModel.family.owner.name,
                    picture: userModel.family.owner.image ?? undefined,
                  },
                  userModel.family.owner.id,
                ),
                members: userModel.family.members.map((m: any) =>
                  User.create(
                    {
                      externalId: m.externalId ?? undefined,
                      email: m.email,
                      name: m.name,
                      picture: m.image ?? undefined,
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
