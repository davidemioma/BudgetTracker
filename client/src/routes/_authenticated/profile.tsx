import { Button } from "@/components/ui/button";
import PageLoader from "@/components/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions } from "../../lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={data?.picture || "https://github.com/shadcn.png"}
            />

            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <span>
            {data?.given_name} {data?.family_name}!
          </span>
        </div>

        <Button asChild>
          <a href="/api/auth/logout">Logout!</a>
        </Button>
      </div>
    );
  },
});
