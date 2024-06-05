import { hc } from "hono/client";
import { type ApiRoutesType } from "@/server/app";

const client = hc<ApiRoutesType>("/");

export const api = client.api;
