import { pgTable, text, boolean, timestamp, integer, index, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

// Helper function to generate IDs
const generateId = () => createId()

// Users
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
})

// Accounts (for OAuth)
export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => {
    return {
      userIdIdx: index("accounts_user_id_idx").on(table.userId),
      providerAccountIdIdx: index("accounts_provider_account_id_idx").on(table.providerAccountId),
    }
  },
)

// Sessions
export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    sessionToken: text("session_token").unique().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("sessions_user_id_idx").on(table.userId),
    }
  },
)

// Verification Tokens
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      compoundKey: index("verification_tokens_identifier_token_idx").on(table.identifier, table.token),
    }
  },)
// Tasks
export const tasks = pgTable(
  "tasks",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    text: text("text").notNull(),
    completed: boolean("completed").default(false).notNull(),
    category: text("category").default("todo").notNull(),
    priority: text("priority"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userIdIdx: index("tasks_user_id_idx").on(table.userId),
      categoryIdx: index("tasks_category_idx").on(table.category),
    }
  },
)

// Habits
export const habits = pgTable(
  "habits",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    name: text("name").notNull(),
    completed: boolean("completed").default(false).notNull(),
    streak: integer("streak").default(0).notNull(),
    color: text("color").default("#6c5ce7").notNull(),
    timeOfDay: text("time_of_day").default("any").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userIdIdx: index("habits_user_id_idx").on(table.userId),
    }
  },
)

// Moods
export const moods = pgTable(
  "moods",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    mood: text("mood").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userIdIdx: index("moods_user_id_idx").on(table.userId),
      createdAtIdx: index("moods_created_at_idx").on(table.createdAt),
    }
  },
)

// Goals
export const goals = pgTable(
  "goals",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    name: text("name").notNull(),
    dueDate: timestamp("due_date", { mode: "date" }),
    isPublic: boolean("is_public").default(false).notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userIdIdx: index("goals_user_id_idx").on(table.userId),
      dueDateIdx: index("goals_due_date_idx").on(table.dueDate),
    }
  },
)

// Pomodoros
export const pomodoros = pgTable(
  "pomodoros",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    duration: integer("duration").notNull(),
    completed: boolean("completed").default(false).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userIdIdx: index("pomodoros_user_id_idx").on(table.userId),
      createdAtIdx: index("pomodoros_created_at_idx").on(table.createdAt),
    }
  },
)

// API Keys
export const apiKeys = pgTable(
  "api_keys",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    key: text("key").notNull().unique(),
    scopes: jsonb("scopes").$type<string[]>().default([]).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    lastUsed: timestamp("last_used", { mode: "date" }),
  },
  (table) => {
    return {
      userIdIdx: index("api_keys_user_id_idx").on(table.userId),
    }
  },
)

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  tasks: many(tasks),
  habits: many(habits),
  moods: many(moods),
  goals: many(goals),
  pomodoros: many(pomodoros),
  apiKeys: many(apiKeys),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}))

export const habitsRelations = relations(habits, ({ one }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
}))

export const moodsRelations = relations(moods, ({ one }) => ({
  user: one(users, {
    fields: [moods.userId],
    references: [users.id],
  }),
}))

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}))

export const pomodorosRelations = relations(pomodoros, ({ one }) => ({
  user: one(users, {
    fields: [pomodoros.userId],
    references: [users.id],
  }),
}))

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}))

