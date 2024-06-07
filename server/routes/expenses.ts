import { db } from "../db";
import { Hono } from "hono";
import { getAuthUser } from "../kinde";
import { zValidator } from "@hono/zod-validator";
import { desc, eq, sum, and } from "drizzle-orm";
import { CreateExpenseSchema } from "../../types";
import { expenses as expensesTable, insertExpensesSchema } from "../db/schema";

export const expensesRoute = new Hono()
  .get("/", getAuthUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses });
  })
  .post(
    "/",
    getAuthUser,
    zValidator("json", CreateExpenseSchema),
    async (c) => {
      const user = c.var.user;

      const expense = await c.req.valid("json");

      const validatedExpense = insertExpensesSchema.parse({
        userId: user.id,
        ...expense,
      });

      const newExpense = await db
        .insert(expensesTable)
        .values(validatedExpense)
        .returning()
        .then((res) => res[0]);

      return c.json({ expense: newExpense }, 201);
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
