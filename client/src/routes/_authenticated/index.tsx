import { api } from "../../lib/api";
import Spinner from "@/components/Spinner";
import PageLoader from "@/components/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/")({
  loader: () => <PageLoader />,
  component: () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["get-total-spent"],
      queryFn: async () => {
        const res = await api.expenses["total-spent"].$get();

        const data = await res.json();

        return data;
      },
    });

    if (error) {
      return <span>Could not get total expense! {error.message}</span>;
    }

    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>

            <CardDescription>The total amount you've spent.</CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? <Spinner /> : `$${data?.total || 0}`}
          </CardContent>
        </Card>
      </div>
    );
  },
});
