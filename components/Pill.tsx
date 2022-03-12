import Link from "next/link";
import * as React from "react";

export type PillProps = {
  id: string;
  path?: string;
  component: React.ReactElement;
};
export function Pill(props: PillProps) {
  const { id, path, component } = props;
  console.log({ props });
  const renderedPill = path ? (
    <Link href={path}>{component}</Link>
  ) : (
    <>{component}</>
  );

  return (
    <li className="pill-item" key={id}>
      {renderedPill}
    </li>
  );
}

export type PillInput = {
  text: string;
  type: string;
  path?: string;
};

export function createPill({ text, type, path }: PillInput): Pill {
  const Component = path ? `a` : `div`;
  return {
    id: `${type}-${text}`,
    path,
    component: <Component className={`pill ${type}`}>{text}</Component>,
  };
}
