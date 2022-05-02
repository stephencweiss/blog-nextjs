import { Navigation } from "../components";
import React, { ReactElement } from "react";

export function Layout({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="with-nav">
      <Navigation />
      <main className="not-nav">{children}</main>
    </div>
  );
}

export function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}
