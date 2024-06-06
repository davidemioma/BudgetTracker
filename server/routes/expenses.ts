import { z } from "zod";
import { Hono } from "hono";
import { getAuthUser } from "../kinde";
import { zValidator } from "@hono/zod-validator";

const ExpenseTypeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  amount: z.coerce.number().min(1),
});

const CreateExpenseSchema = ExpenseTypeSchema.omit({ id: true });

type ExpenseTypeValidator = z.infer<typeof ExpenseTypeSchema>;

const mockExpense: ExpenseTypeValidator[] = [
  {
    id: "1",
    title: "Groceries",
    amount: 1000,
  },
  {
    id: "2",
    title: "Rent",
    amount: 1000,
  },
  {
    id: "3",
    title: "Utilities",
    amount: 1000,
  },
];

export const expensesRoute = new Hono()
  .get("/", getAuthUser, (c) => c.json({ expenses: mockExpense }))
  .post(
    "/",
    getAuthUser,
    zValidator("json", CreateExpenseSchema),
    async (c) => {
      const expense = await c.req.valid("json");

      mockExpense.push({ id: (mockExpense.length + 1).toString(), ...expense });

      c.status(201);

      return c.json({ expenses: mockExpense });
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
      (total, expense) => total + expense.amount,
      0
    );

    return c.json({ totalSpent });
  });
