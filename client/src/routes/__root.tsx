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
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>

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

      <hr />

      <Outlet />

      <TanStackRouterDevtools />
    </>
  ),
});
