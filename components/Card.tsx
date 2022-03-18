import * as React from "react";
import { PillProps } from "./Pill";
import { Pill } from "./Pill";

type CardProps = {
  title: string;
  subheader?: string;
  details?: string;
  body?: string;
  pills?: PillProps[];
  primaryAction?: React.ReactNode;
};

export function Card(props: CardProps) {
  const { pills, title, subheader, details, body, primaryAction } = props;
  return (
    <div className="card">
      <div className="post-date">{subheader}</div>
      <h3>{title}</h3>
      {pills?.length && (
        <ul className="pills">
          {pills.map((pill) => (
            <Pill key={pill.id} {...pill} />
          ))}
        </ul>
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
