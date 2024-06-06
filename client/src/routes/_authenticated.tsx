import { Button } from "@/components/ui/button";
import { authUserQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const user = await queryClient.fetchQuery(authUserQueryOptions);

      return { user };
    } catch (e) {
      return { user: null };
    }
  },
  component: () => {
    const { user } = Route.useRouteContext();

    if (!user) {
      return (
        <Card className="mx-auto flex w-full max-w-xl flex-col items-center">
          <CardHeader>
            <CardTitle>Login or Register</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center gap-2">
            <Button asChild>
              <a href="/api/auth/login">Login!</a>
            </Button>

            <Button asChild>
              <a href="/api/auth/register">Register!</a>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return <Outlet />;
  },
});
