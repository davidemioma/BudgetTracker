import { hc } from "hono/client";
import { type ApiRoutesType } from "@/server/app";
import { queryOptions } from "@tanstack/react-query";
import { ExpenseTypeValidator } from "../../../types";

const client = hc<ApiRoutesType>("/");

export const api = client.api;

export const authUserQueryOptions = queryOptions({
  queryKey: ["get-user-profile"],
  queryFn: async () => {
    const res = await api.auth.me.$get();

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await res.json();

    return data.user;
  },
  staleTime: Infinity, //This means it will stay cached until a user revalidate this path, refreshes the page or login/logout.
});

export const getExpensesQueryOptions = queryOptions({
  queryKey: ["get-expenses"],
  queryFn: async () => {
    const res = await api.expenses.$get();

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await res.json();

    return data;
  },
  staleTime: 1000 * 6 * 5,
});

export const createExpense = async (value: ExpenseTypeValidator) => {
  const res = await api.expenses.$post({ json: value });

  if (!res.ok) {
    throw new Error("Something went wrong!");
  }

  const newExpense = await res.json();

  return newExpense;
};

export const deleteExpense = async (id: number) => {
  if (!id) return;

  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: `${id}` },
  });

  if (!res.ok) {
    throw new Error("Something went wrong!");
  }

  const data = await res.json();

  return data;
};

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: undefined | ExpenseTypeValidator;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});
