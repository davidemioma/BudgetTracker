import { type Context } from "hono";
import { createMiddleware } from "hono/factory";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN || "",
    clientId: process.env.KINDE_CLIENT_ID || "",
    clientSecret: process.env.KINDE_CLIENT_SECRET || "",
    redirectURL: process.env.KINDE_REDIRECT_URI || "",
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI || "",
  }
);

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);

    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true, //Can not be accessed in the frontend
      secure: true, //Access through https
      sameSite: "Lax", //To avoid cross-site forgry attacks
    } as const;

    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getAuthUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);

    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (!isAuthenticated) return c.json({ error: "Unauthorised" }, 401);

    const user = await kindeClient.getUserProfile(manager);

    c.set("user", user);

    await next();
  } catch (err) {
    console.error(err);

    return c.json({ error: "Unauthorized" }, 401);
  }
});
