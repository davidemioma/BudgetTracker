import { z } from "zod";
import { insertExpensesSchema } from "./server/db/schema";

export const ExpenseTypeSchema = insertExpensesSchema.omit({
  userId: true,
  createdAt: true,
});

export const CreateExpenseSchema = ExpenseTypeSchema.omit({ id: true });

export type ExpenseTypeValidator = z.infer<typeof CreateExpenseSchema>;
