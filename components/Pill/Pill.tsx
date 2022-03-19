import Link from "next/link";
import * as React from "react";

export type PillProps = {
  id: string;
  path?: string;
  component: React.ReactElement;
};

export function Pill(props: PillProps) {
  const { id, path, component } = props;

  return (
    <li className="pill-item link" key={id}>
      {path ? <Link href={path}>{component}</Link> : <>{component}</>}
    </li>
  );
}
