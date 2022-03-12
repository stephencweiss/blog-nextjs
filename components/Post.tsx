import * as React from "react";
import Link from "next/link";
import { ExpandedNote } from "../types/_note";
import { Card } from "./Card";
import { createPill } from "./Pill";
import { marked } from "marked";

export type PostProps = {
  post: ExpandedNote;
};

export function Post({ post }: PostProps) {
  const { category, date, excerpt, isPrivate, slug, tags, title } = post;

  const pills = [
    ...[isPrivate && createPill({ text: "private", type: "isPrivate" })],
    ...[...new Set(category ?? [])].map((c) =>
      createPill({
        text: c,
        type: "category",
        path: `/search?q=${c}&type=search&target=category`,
      })
    ),
    ...[...new Set(tags ?? [])].map((t) =>
      createPill({
        text: t,
        type: "tag",
        path: `/search?q=${t}&type=search&target=tag`,
      })
    ),
  ];

  return (
    <>
      <Card
        title={title}
        date={date ? `Posted on ${date}` : ""}
        details={marked(excerpt ?? "")}
        pills={pills}
        primaryAction={
          <Link href={`/blog/${slug}`}>
            <a className="btn">Read More</a>
          </Link>
        }
      />
    </>
  );
}
