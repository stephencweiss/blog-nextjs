import Link from "next/link";
import * as React from "react";

export type Pill = {
  id: string;
  path?: string;
  component: React.ReactElement;
};

export function createPill({
  text,
  type,
  path,
}: {
  text: string;
  type: string;
  path?: string;
}): Pill {
  const Component = path ? `a` : `div`;
  return {
    id: `${type}-${text}`,
    path,
    component: <Component className={`pill ${type}`}>{text}</Component>,
  };
}

export type CardProps = {
  body?: string;
  details?: string;
  pills?: Pill[];
  subheader?: string;
  title: string;
  primaryAction?: React.ReactNode;
};

export function Card(props: CardProps) {
  const { body, details, pills, subheader, title, primaryAction } = props;

  return (
    <div className="card">
      <div className="post-date">{subheader}</div>
      <h3>{title}</h3>
      {pills?.length ? (
        <ul className="pills">
          {pills.map((pill) => {
            console.log({ pill });
            const renderedPill = pill.path ? (
              <Link href={pill.path}>{pill.component}</Link>
            ) : (
              <>{pill.component}</>
            );

            return (
              <li className="pill-item" key={pill.id}>
                {renderedPill}
              </li>
            );
          })}
        </ul>
      ) : (
        <></>
      )}
      {body}
      {details ? (
        <div
          className="details"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      ) : (
        <></>
      )}

      {primaryAction}
    </div>
  );
}
