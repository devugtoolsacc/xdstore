import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const userRoles = ['admin', 'user'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum('user_role', userRoles);

export const UserTable = pgTable('users', {
  id,
  clerkUserId: text().notNull().unique(),
  imageUrl: text(),
  name: text().notNull(),
  email: text().notNull(),
  role: userRoleEnum().notNull().default('user'),
  deletedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});
