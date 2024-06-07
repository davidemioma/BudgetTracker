import { Toaster } from "@/components/ui/sonner";
import { type QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="mx-auto flex w-full max-w-2xl items-baseline justify-between p-4">
        <Link to="/" className="[&.active]:font-bold">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/profile" className="[&.active]:font-bold">
            Profile
          </Link>

          <Link to="/expenses" className="[&.active]:font-bold">
            Expenses
          </Link>

          <Link to="/create-expense" className="[&.active]:font-bold">
            Create
          </Link>
        </div>
      </div>

      <hr />

      <Outlet />

      <TanStackRouterDevtools />

      <Toaster />
    </>
  ),
});
