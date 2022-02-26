import Link from "next/link";
import * as React from "react";

export function NavBar() {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/blog">
        <a>Blog</a>
      </Link>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
}
