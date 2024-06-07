import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  serial,
  text,
  numeric,
  index,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    date: date("date").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index("user_id_idx").on(expenses.userId),
    };
  }
);

// Schema for inserting a user - can be used to validate API requests
export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid amount format" }),
});

// Schema for selecting a user - can be used to validate API responses
export const selectExpensesSchema = createSelectSchema(expenses);
