import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/PageLoader";
import { Calendar } from "@/components/ui/calendar";
import { useQueryClient } from "@tanstack/react-query";
import { CreateExpenseSchema } from "../../../../types";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  createExpense,
  getExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "../../lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-expense")({
  loader: () => <PageLoader />,
  component: () => {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const form = useForm({
      validatorAdapter: zodValidator,
      defaultValues: {
        title: "",
        amount: "0",
        date: new Date().toISOString(),
      },
      onSubmit: async ({ value }) => {
        const existingExpenses = await queryClient.ensureQueryData(
          getExpensesQueryOptions,
        );

        navigate({ to: "/expenses" });

        //Loading
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
          expense: value,
        });

        try {
          const newExpense = await createExpense(value);

          queryClient.setQueryData(getExpensesQueryOptions.queryKey, {
            ...existingExpenses,
            expenses: [newExpense.expense, ...existingExpenses.expenses],
          });

          toast.success("Expense created!");
        } catch (err) {
          toast.error("Something went wrong! could not create expense.");
        } finally {
          queryClient.setQueryData(
            loadingCreateExpenseQueryOptions.queryKey,
            {},
          );
        }
      },
    });

    return (
      <div className="mx-auto w-full max-w-2xl p-4">
        <h2 className="mb-5 text-2xl font-bold">Create Expense</h2>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="title"
            validators={{
              onChange: CreateExpenseSchema.shape.title,
            }}
            children={(field) => (
              <div className="w-full space-y-2">
                <Label htmlFor={field.name}>Title</Label>

                <Input
                  id={field.name}
                  placeholder="Title"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.touchedErrors && (
                  <em>{field.state.meta.touchedErrors}</em>
                )}
              </div>
            )}
          />

          <form.Field
            name="amount"
            validators={{
              onChange: CreateExpenseSchema.shape.amount,
            }}
            children={(field) => (
              <div className="w-full space-y-2">
                <Label htmlFor={field.name}>Amount</Label>

                <Input
                  id={field.name}
                  type="number"
                  placeholder="Amount"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.touchedErrors && (
                  <em>{field.state.meta.touchedErrors}</em>
                )}
              </div>
            )}
          />

          <form.Field
            name="date"
            validators={{
              onChange: CreateExpenseSchema.shape.date,
            }}
            children={(field) => (
              <div className="flex w-full flex-col items-center gap-2">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange((date || new Date()).toISOString())
                  }
                  className="rounded-md border"
                />

                {field.state.meta.touchedErrors && (
                  <em>{field.state.meta.touchedErrors}</em>
                )}
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? <Spinner /> : "Create Expense"}
              </Button>
            )}
          />
        </form>
      </div>
    );
  },
});
