import { api } from "../../lib/api";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/PageLoader";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/create-expense")({
  loader: () => <PageLoader />,
  component: () => {
    const navigate = useNavigate();

    const form = useForm({
      defaultValues: {
        title: "",
        amount: "0",
      },
      onSubmit: async ({ value }) => {
        const res = await api.expenses.$post({ json: value });

        if (!res.ok) {
          throw new Error("Something went wrong!");
        }

        navigate({ to: "/expenses" });
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
