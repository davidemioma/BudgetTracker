import PageLoader from "@/components/PageLoader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-expense")({
  loader: () => <PageLoader />,
  component: () => {
    return <div className="p-2">Hello from Create Expense!</div>;
  },
});
