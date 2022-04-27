import { withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsResult,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import * as React from "react";
import { User } from "types/index";
import { extractFormKeyValue, sessionOptions } from "utils";

export type Props = User & {};

function resStatusIsOkay(res: Response) {
  return res.status >= 200 && res.status < 400;
}

function Login(props: Props) {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = extractFormKeyValue(event, "password")[0];
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      if (resStatusIsOkay(res)) {
        router.push("/");
      }
    } catch (e) {
      console.log("error!", e);
    }
  };

  const onLogout = async () => {
    await fetch("/api/logout");
    router.push("/");
  };
  return (
    <div>
      <h1 className="text1 text-2xl">Login</h1>
      <p className="text1">
        Please note: At this time, there is no means to sign up for an account
        on this site. The login feature allows me to view notes in progress,
        edit existing notes, and write new notes from the web (feature coming).
      </p>
      {!props.isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          <button>Submit</button>
        </form>
      ) : (
        <button onClick={onLogout}>Logout</button>
      )}
    </div>
  );
}

export default Login;

export const getServerSideProps = withIronSessionSsr(
  wrappableServerSideProps,
  sessionOptions
);

function wrappableServerSideProps(
  context: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>
): GetServerSidePropsResult<User> {
  const { req } = context;

  const user = req?.session?.user || ({} as User);

  return { props: { ...user } };
}
