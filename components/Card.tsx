import Link from "next/link";
import * as React from "react";
import { PillProps } from "./Pill";
import { Pill } from "./Pill";

type CardProps = {
  title: string;
  slug: string;
  subheader?: string;
  details?: string;
  body?: string;
  pills?: PillProps[];
  primaryAction?: React.ReactNode;
};

export function Card(props: CardProps) {
  const { pills, title, subheader, details, body, primaryAction, slug } = props;
  return (
    <div>
      <Link href={slug} passHref>
        <h2 className="link">{title}</h2>
      </Link>
      <p className="post-date">{subheader}</p>
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
