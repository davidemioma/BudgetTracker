import PageLoader from "@/components/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions } from "../../lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  loader: () => <PageLoader />,
  component: () => {
    const { data, isLoading, error } = useQuery(authUserQueryOptions);

    if (isLoading) {
      return <PageLoader />;
    }

    if (error) {
      return <span>Could not user profile! {error.message}</span>;
    }

    return (
      <div>
        <span>Hello {data?.family_name}!</span>

        <a href="/api/auth/logout">Logout!</a>
      </div>
    );
  },
});
