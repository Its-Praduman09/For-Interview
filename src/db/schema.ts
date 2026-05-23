import { pgEnum, pgTable, serial, timestamp, varchar, } from 'drizzle-orm/pg-core'
export const userRoleEnum = pgEnum('user_role', ['SUPER_ADMIN', 'ADMIN', "MEMBER", "USER", "CUSTOMER"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).$onUpdate(() => new Date()).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" })
})