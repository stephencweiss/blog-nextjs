import Link from "next/link";
import * as React from "react";

export type PillProps = {
  id: string;
  path?: string;
  component: React.ReactElement;
};
export function Pill(props: PillProps) {
  const { id, path, component } = props;

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
  id: string;
  count?: number;
  type: string;
  path?: string;
};

export function createPill({
  id,
  count = 0,
  type,
  path,
}: PillInput): PillProps {
  const Component = path ? `a` : `div`;
  return {
    id: `${type}-${id}`,
    path,
    component: (
      <Component className={`pill ${type}`}>
        {id}
        {count ? `-${count}` : ""}
      </Component>
    ),
  };
}
