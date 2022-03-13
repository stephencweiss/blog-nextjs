import * as React from "react";
import Link from "next/link";
import { ExpandedNote, KeyCounts } from "../types/_note";
import { Card } from "./Card";
import { createPill } from "./Pill";
import { marked } from "marked";

export type PostProps = {
  post: ExpandedNote;
  tagCounts: KeyCounts[];
  categoryCounts: KeyCounts[];
};

export function Post({ post, tagCounts, categoryCounts }: PostProps) {
  const { category, date, excerpt, isPrivate, slug, tags, title } = post;

  const pills = [
    ...[isPrivate && createPill({ id: "private", type: "isPrivate" })],
    ...[...new Set(category ?? [])].map((c) => {
      const categoryCount =
        categoryCounts?.find((ct) => ct.key === c)?.count ?? 0;
      return createPill({
        id: c,
        count: categoryCount,
        type: "category",
        path: `/search?q=${c}&type=search&target=category`,
      });
    }),
    ...[...new Set(tags ?? [])].map((t) => {
      const tagCount = tagCounts?.find((ct) => ct.key === t)?.count ?? 0;
      return createPill({
        id: t,
        count: tagCount,
        type: "tag",
        path: `/search?q=${t}&type=search&target=tag`,
      });
    }),
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
