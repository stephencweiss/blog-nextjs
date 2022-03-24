import Sidebar from "@/components/Sidebar";
import React, { ReactElement } from "react";

export default function Layout({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="wrapper">
      {/* <Navbar /> */}
      <Sidebar />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
}

export function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}
