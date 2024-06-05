import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
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
