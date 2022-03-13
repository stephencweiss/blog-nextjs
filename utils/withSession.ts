// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session";
import type { User } from "../types/index";

export const sessionOptions: IronSessionOptions = {
  password: { 1: process.env.SECRET_COOKIE_PASSWORD },
  cookieName: process.env.IRON_SESSION_COOKIE_NAME ?? "iron-session-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
