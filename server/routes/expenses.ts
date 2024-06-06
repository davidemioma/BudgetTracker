import { z } from "zod";
import { db } from "../db";
import { Hono } from "hono";
import { getAuthUser } from "../kinde";
import { zValidator } from "@hono/zod-validator";
import { expenses as expensesTable } from "../db/schema";
import { desc, eq, sum, and } from "drizzle-orm";

const ExpenseTypeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  amount: z.string(),
});

const CreateExpenseSchema = ExpenseTypeSchema.omit({ id: true });

type ExpenseTypeValidator = z.infer<typeof ExpenseTypeSchema>;

const mockExpense: ExpenseTypeValidator[] = [
  {
    id: "1",
    title: "Groceries",
    amount: "1000",
  },
  {
    id: "2",
    title: "Rent",
    amount: "1000",
  },
  {
    id: "3",
    title: "Utilities",
    amount: "1000",
  },
];

export const expensesRoute = new Hono()
  .get("/", getAuthUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json(expenses);
  })
  .post(
    "/",
    getAuthUser,
    zValidator("json", CreateExpenseSchema),
    async (c) => {
      const user = c.var.user;

      const expense = await c.req.valid("json");

      await db.insert(expensesTable).values({ userId: user.id, ...expense });

      return c.json({ success: "Expense Crated" }, 201);
    }
  )
  .get("/total-spent", getAuthUser, async (c) => {
    const user = c.var.user;

    const result = await db
      .select({
        total: sum(expensesTable.amount),
      })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    return c.json(result);
  })
  .get("/:id{[0-9]+}", getAuthUser, async (c) => {
    const user = c.var.user;

    const id = Number.parseInt(await c.req.param("id"));

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((res) => res[0]);

    if (!expense) return c.notFound();

    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getAuthUser, async (c) => {
    const user = c.var.user;

    const id = Number.parseInt(await c.req.param("id"));

    await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)));

    return c.json({ success: "Expense deleted!" });
  });
