import { useRouter } from "next/router";
import * as React from "react";
import { extractFormKeyValue } from "utils";

export type Props = {};

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
  };
  return (
    <div>
      <button onClick={onLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Login;
