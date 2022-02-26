import * as React from "react";

export type Props = {};

export function Login(props: Props) {
  const onLogin = async () => {
    await fetch("/api/login");
  };
  const onLogout = async () => {
    await fetch("/api/logout");
  };

  return (
    <div>
      <button onClick={onLogin}>Login</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
