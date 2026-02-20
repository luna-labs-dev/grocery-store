import { eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  FamilyRepositories,
  GetFamilyByIdRepositoryParams,
  GetFamilyByInviteCodeRepositoryParams,
  UpdateUserRepository,
} from '@/application';
import { type Either, Family, left, right, User } from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;

@injectable()
export class DrizzleFamilyRepository implements FamilyRepositories {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepositories: UpdateUserRepository,
  ) {}

  add = async (family: Family): Promise<Either<void, void>> => {
    try {
      await db.insert(schema.familyTable).values({
        id: family.id,
        name: family.name,
        ownerId: family.ownerId,
        description: family.description ?? null,
        inviteCode: family.inviteCode ?? null,
        createdAt: family.createdAt,
        createdBy: family.createdBy,
      });
      await this.userRepositories.update(family.owner);
      return right(undefined);
    } catch (error: any) {
      if (error.code === '23505') {
        return left(undefined);
      }
      throw error;
    }
  };

  update = async (family: Family): Promise<void> => {
    await db
      .update(schema.familyTable)
      .set({
        name: family.name,
        description: family.description ?? null,
        inviteCode: family.inviteCode ?? null,
        ownerId: family.ownerId,
      })
      .where(eq(schema.familyTable.id, family.id));
  };

  getById = async (
    params: GetFamilyByIdRepositoryParams,
  ): Promise<Family | undefined> => {
    const familyModel = await db.query.familyTable.findFirst({
      where: eq(schema.familyTable.id, params.familyId),
      with: {
        owner: { with: { family: true, ownedFamily: true } },
        members: { with: { family: true, ownedFamily: true } },
      },
    });
    if (!familyModel) return undefined;
    return this.toDomain(familyModel);
  };

  getByInviteCode = async (
    params: GetFamilyByInviteCodeRepositoryParams,
  ): Promise<Family | undefined> => {
    const familyModel = await db.query.familyTable.findFirst({
      where: eq(schema.familyTable.inviteCode, params.inviteCode),
      with: {
        owner: { with: { family: true, ownedFamily: true } },
        members: { with: { family: true, ownedFamily: true } },
      },
    });
    if (!familyModel) return undefined;
    return this.toDomain(familyModel);
  };

  private toDomain(familyModel: any): Family {
    return Family.create(
      {
        ownerId: familyModel.ownerId,
        owner: User.create(
          {
            externalId: familyModel.owner.externalId,
            email: familyModel.owner.email,
          },
          familyModel.owner.id,
        ),
        name: familyModel.name,
        description: familyModel.description ?? undefined,
        inviteCode: familyModel.inviteCode ?? undefined,
        createdAt: familyModel.createdAt,
        createdBy: familyModel.createdBy,
        members: familyModel.members.map((m: any) =>
          User.create(
            {
              externalId: m.externalId,
              email: m.email,
            },
            m.id,
          ),
        ),
      },
      familyModel.id,
    );
  }
}
