import { api } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableCaption,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["get-expenses"],
      queryFn: async () => {
        const res = await api.expenses.$get();

        const data = await res.json();

        return data;
      },
    });

    if (error) {
      return <span>Could not get total expense! {error.message}</span>;
    }

    return (
      <div className="mx-auto w-full max-w-3xl p-4">
        <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>

              <TableHead>Title</TableHead>

              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array(3)
                .fill("")
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4" />
                    </TableCell>

                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>

                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))}

            {data &&
              data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>

                  <TableCell>{expense.title}</TableCell>

                  <TableCell>${expense.amount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  },
});
