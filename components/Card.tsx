import * as React from "react";

type CardProps = {
  title: string;
  subheader?: string;
  details?: string;
  body?: string;
  primaryAction?: React.ReactNode;
};

export function Card(props: CardProps) {
  const { title, subheader, details, body, primaryAction } = props;
  return (
    <div className="card">
      <div className="post-date">{subheader}</div>
      <h3>{title}</h3>

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
