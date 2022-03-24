import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <nav className={styles.nav}>
      <input className={styles.input} placeholder="Search..." />
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
  );
}
