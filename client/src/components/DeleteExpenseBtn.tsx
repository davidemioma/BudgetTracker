import { toast } from "sonner";
import Spinner from "./Spinner";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExpense, getExpensesQueryOptions } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  expenseId: number;
};

const DeleteExpenseBtn = ({ expenseId }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-expense"],
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success("Expense deleted!");

      queryClient.setQueryData(
        getExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter(
            (expense) => expense.id !== expenseId,
          ),
        }),
      );
    },
    onError: () => {
      toast.error("Something went wrong! could not create expense.");
    },
  });

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => mutate(expenseId)}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <TrashIcon className="h-4 w-4" />}
    </Button>
  );
};

export default DeleteExpenseBtn;
