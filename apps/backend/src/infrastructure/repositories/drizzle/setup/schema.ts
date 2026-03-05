import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  customType,
  decimal,
  index,
  jsonb,
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

export const groupRoleEnum = pgEnum('groupRoleEnum', [
  'OWNER',
  'ADMIN',
  'MEMBER',
]);

export const groupTable = pgTable('group', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
  inviteCode: varchar('inviteCode', { length: 320 }).unique(),
  createdAt: timestamp('createdAt', { precision: 6 }).defaultNow().notNull(),
  createdBy: varchar('createdBy', { length: 320 }).notNull(),
});

export const groupMemberTable = pgTable(
  'group_member',
  {
    groupId: uuid('groupId')
      .notNull()
      .references(() => groupTable.id),
    userId: text('userId')
      .notNull()
      .references(() => userTable.id),
    role: groupRoleEnum('role').default('MEMBER').notNull(),
    joinedAt: timestamp('joinedAt', { precision: 6 }).defaultNow().notNull(),
  },
  (table) => [
    index('group_member_pkey').on(table.groupId, table.userId), // composite "PK" in logic
  ],
);

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt', { precision: 6 }).notNull(),
  updatedAt: timestamp('updatedAt', { precision: 6 }).notNull(),
  externalId: varchar('externalId', { length: 320 }).unique(), // Legacy Clerk ID
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt', { precision: 6 }).notNull(),
  token: text('token').unique().notNull(),
  createdAt: timestamp('createdAt', { precision: 6 }).notNull(),
  updatedAt: timestamp('updatedAt', { precision: 6 }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id),
});

export const accountTable = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { precision: 6 }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { precision: 6 }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt', { precision: 6 }).notNull(),
  updatedAt: timestamp('updatedAt', { precision: 6 }).notNull(),
});

export const verificationTable = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { precision: 6 }).notNull(),
  createdAt: timestamp('createdAt', { precision: 6 }),
  updatedAt: timestamp('updatedAt', { precision: 6 }),
});

export const marketTable = pgTable(
  'market',
  {
    id: varchar('id', { length: 320 }).primaryKey().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    formattedAddress: varchar('formattedAddress', { length: 320 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    neighborhood: varchar('neighborhood', { length: 100 }).notNull(),
    latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
    geographicLocation: geography('geographicLocation').notNull(),
    locationTypes: jsonb('locationTypes')
      .$type<string[]>()
      .notNull()
      .default([]),
    createdAt: timestamp('createdAt', { precision: 6 }).defaultNow().notNull(),
    lastUpdatedAt: timestamp('lastUpdatedAt', { precision: 6 })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('market_location_idx').using('gist', table.geographicLocation),
  ],
);

export const shopping_eventTable = pgTable('shopping_event', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('groupId').references(() => groupTable.id),
  marketId: varchar('marketId', { length: 320 })
    .notNull()
    .references(() => marketTable.id),
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
  shoppingEventId: uuid('shoppingEventId')
    .notNull()
    .references(() => shopping_eventTable.id),
  name: varchar('name', { length: 256 }).notNull(),
  amount: real('amount').notNull(),
  price: money('price').notNull(),
  wholesaleMinAmount: real('wholesaleMinAmount'),
  wholesalePrice: money('wholesalePrice'),
  addedAt: timestamp('addedAt', { precision: 6 }).notNull(),
  addedBy: varchar('addedBy', { length: 320 }).notNull(),
});

export const groupRelations = relations(groupTable, ({ many }) => ({
  members: many(groupMemberTable),
  shopping_events: many(shopping_eventTable),
}));

export const groupMemberRelations = relations(groupMemberTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [groupMemberTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [groupMemberTable.userId],
    references: [userTable.id],
  }),
}));

export const userRelations = relations(userTable, ({ many }) => ({
  groups: many(groupMemberTable),
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
    group: one(groupTable, {
      fields: [shopping_eventTable.groupId],
      references: [groupTable.id],
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
