import { z } from "zod";
import { db } from "../db";
import { Hono } from "hono";
import { getAuthUser } from "../kinde";
import { zValidator } from "@hono/zod-validator";
import { expenses as expensesTable } from "../db/schema";
import { eq } from "drizzle-orm";

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
      .where(eq(expensesTable.userId, user.id));

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
  .get("/:id{[0-9]+}", getAuthUser, async (c) => {
    const id = await c.req.param("id");

    const expense = mockExpense.find((expense) => expense.id === id);

    if (!expense) return c.notFound();

    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getAuthUser, async (c) => {
    const id = await c.req.param("id");

    const expenseIndex = mockExpense.findIndex((expense) => expense.id === id);

    if (!expenseIndex) return c.notFound();

    mockExpense.splice(expenseIndex, 1);

    return c.json({ expenses: mockExpense });
  })
  .get("/total-spent", getAuthUser, async (c) => {
    const totalSpent = mockExpense.reduce(
      (total, expense) => total + +expense.amount,
      0
    );

    return c.json({ totalSpent });
  });
