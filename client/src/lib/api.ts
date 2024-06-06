import { hc } from "hono/client";
import { type ApiRoutesType } from "@/server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutesType>("/");

export const api = client.api;

export const authUserQueryOptions = queryOptions({
  queryKey: ["get-user-profile"],
  queryFn: async () => {
    const res = await api.auth.me.$get();

    const data = await res.json();

    return data.user;
  },
  staleTime: Infinity, //This means it will stay cached until a user revalidate this path, refreshes the page or login/logout.
});
