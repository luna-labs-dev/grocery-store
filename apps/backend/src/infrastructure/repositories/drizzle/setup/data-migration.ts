import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../../../../main/config/env';
import {
  familyTable,
  groupMemberTable,
  groupTable,
  shopping_eventTable,
  userTable,
} from './schema';

dotenv.config();

const runDataMigration = async () => {
  const connectionString = env.database.url;
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log('Starting data migration from families to groups...');

  try {
    const families = await db.select().from(familyTable);
    console.log(`Found ${families.length} families to migrate.`);

    for (const family of families) {
      console.log(`Migrating family: ${family.name} (ID: ${family.id})...`);

      // 1. Create Group using Family data
      await db
        .insert(groupTable)
        .values({
          id: family.id,
          name: family.name,
          description: family.description,
          inviteCode: family.inviteCode,
          createdAt: family.createdAt,
          createdBy: family.createdBy,
        })
        .onConflictDoNothing();

      // 2. Add Owner as GroupMember
      await db
        .insert(groupMemberTable)
        .values({
          groupId: family.id,
          userId: family.ownerId,
          role: 'OWNER',
          joinedAt: family.createdAt,
        })
        .onConflictDoNothing();

      // 3. Find all users associated with this family and add them as GroupMembers
      const members = await db
        .select()
        .from(userTable)
        .where(eq(userTable.familyId, family.id));
      for (const member of members) {
        if (member.id === family.ownerId) continue;

        await db
          .insert(groupMemberTable)
          .values({
            groupId: family.id,
            userId: member.id,
            role: 'MEMBER',
            joinedAt: member.createdAt,
          })
          .onConflictDoNothing();
      }

      // 4. Update Shopping Events that were linked to this family
      await db
        .update(shopping_eventTable)
        .set({ groupId: family.id })
        .where(eq(shopping_eventTable.familyId, family.id));

      console.log(`Successfully migrated family ${family.name}`);
    }

    console.log('Data migration completed successfully!');
  } catch (err) {
    console.error('Data migration failed!', err);
    process.exit(1);
  } finally {
    await client.end();
  }

  process.exit(0);
};

runDataMigration();
