import { relations } from 'drizzle-orm';
import {
  bigint,
  customType,
  decimal,
  index,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const money = customType<{ data: number; driverData: string }>({
  dataType() {
    return 'money';
  },
  fromDriver(value: any): number {
    if (typeof value === 'number') return value;
    return Number(String(value).replace(/[^0-9.-]+/g, ''));
  },
  toDriver(value: number): string {
    return value.toString();
  },
});

export const geography = customType<{ data: string }>({
  dataType() {
    return 'geography(Point, 4326)';
  },
});

export const shoppingEventStatusEnum = pgEnum('shoppingEventStatusEnum', [
  'ONGOING',
  'CANCELED',
  'FINISHED',
]);

export const familyTable = pgTable('family', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  ownerId: uuid('ownerId').unique().notNull(),
  description: text('description'),
  inviteCode: varchar('inviteCode', { length: 320 }).unique(),
  createdAt: timestamp('createdAt', { precision: 6 }).defaultNow().notNull(),
  createdBy: varchar('createdBy', { length: 320 }).notNull(),
});

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: varchar('externalId', { length: 320 }).unique().notNull(),
  email: varchar('email', { length: 320 }).unique().notNull(),
  familyId: uuid('familyId'),
});

export const marketTable = pgTable(
  'market',
  {
    id: varchar('id', { length: 320 }).primaryKey().notNull(),
    name: varchar('name', { length: 100 }).unique().notNull(),
    address: varchar('address', { length: 320 }).notNull(),
    latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
    location: geography('location').notNull(),
    createdAt: timestamp('createdAt', { precision: 6 }).defaultNow().notNull(),
    lastUpdatedAt: timestamp('lastUpdatedAt', { precision: 6 })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('market_location_idx').using('gist', table.location)],
);

export const shopping_eventTable = pgTable('shopping_event', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('familyId').notNull(),
  marketId: uuid('marketId').notNull(),
  description: text('description'),
  totalPaid: money('totalPaid').notNull(),
  wholesaleTotal: money('wholesaleTotal').notNull(),
  retailTotal: money('retailTotal').notNull(),
  status: shoppingEventStatusEnum('status').default('ONGOING').notNull(),
  elapsedTime: bigint('elapsedTime', { mode: 'number' }),
  createdAt: timestamp('createdAt', { precision: 6 }).defaultNow().notNull(),
  finishedAt: timestamp('finishedAt', { precision: 6 }),
  createdBy: varchar('createdBy', { length: 320 }).notNull(),
});

export const productTable = pgTable('product', {
  id: uuid('id').primaryKey().defaultRandom(),
  shoppingEventId: uuid('shoppingEventId').notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  amount: real('amount').notNull(),
  price: money('price').notNull(),
  wholesaleMinAmount: real('wholesaleMinAmount'),
  wholesalePrice: money('wholesalePrice'),
  addedAt: timestamp('addedAt', { precision: 6 }).notNull(),
  addedBy: varchar('addedBy', { length: 320 }).notNull(),
});

export const familyRelations = relations(familyTable, ({ one, many }) => ({
  owner: one(userTable, {
    fields: [familyTable.ownerId],
    references: [userTable.id],
    relationName: 'familyOwner',
  }),
  members: many(userTable, { relationName: 'FamilyMembers' }),
  shopping_events: many(shopping_eventTable),
}));

export const userRelations = relations(userTable, ({ one }) => ({
  family: one(familyTable, {
    fields: [userTable.familyId],
    references: [familyTable.id],
    relationName: 'FamilyMembers',
  }),
  ownedFamily: one(familyTable, {
    fields: [userTable.id],
    references: [familyTable.ownerId],
    relationName: 'familyOwner',
  }),
}));

export const marketRelations = relations(marketTable, ({ many }) => ({
  shopping_events: many(shopping_eventTable),
}));

export const shoppingEventRelations = relations(
  shopping_eventTable,
  ({ one, many }) => ({
    market: one(marketTable, {
      fields: [shopping_eventTable.marketId],
      references: [marketTable.id],
    }),
    family: one(familyTable, {
      fields: [shopping_eventTable.familyId],
      references: [familyTable.id],
    }),
    products: many(productTable),
  }),
);

export const productRelations = relations(productTable, ({ one }) => ({
  shoppingEvent: one(shopping_eventTable, {
    fields: [productTable.shoppingEventId],
    references: [shopping_eventTable.id],
  }),
}));
