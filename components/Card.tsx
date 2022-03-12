import Link from "next/link";
import * as React from "react";
import { Pill, PillProps } from "./Pill";

export type CardProps = {
  body?: string;
  details?: string;
  pills?: PillProps[];
  date?: string;
  title: string;
  primaryAction?: React.ReactNode;
};

export function Card(props: CardProps) {
  const { body, details, pills, date, title, primaryAction } = props;

  return (
    <div className="card">
      <div className="post-date">{date}</div>
      <h3>{title}</h3>
      {pills?.length ? (
        <ul className="pills">
          {pills.map((pill) => (
            <Pill key={pill.id} {...pill} />
          ))}
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
