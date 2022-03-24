import Link from "next/link";
import styles from "./Navigation.module.css";
import { Search } from "./Search";

export function Navigation() {
  return (
    <>
      <nav className={`${styles.nav} nav`}>
        <Search />
        <Link href="/">
          <a>home</a>
        </Link>
        <Link href="/blog">
          <a>blog</a>
        </Link>
        <Link href="/theme">
          <a>theme</a>
        </Link>
        <Link href="/login">
          <a>login</a>
        </Link>
      </nav>
    </>
  );
}
export default Navigation;
