import * as React from "react";
import Link from "next/link";
import { ExpandedNote } from "../types/post";
import { Card } from "./Card";
import { marked } from "marked";

export type Props = {
  post: ExpandedNote;
};

export function Post({ post }: Props) {
  const { title, date, slug, excerpt } = post;

  return (
    <Card
      title={title}
      subheader={`Posted on ${date}`}
      details={marked(excerpt ?? "")}
      primaryAction={
        <Link href={`/blog/${slug}`}>
          <a className="btn">Read More</a>
        </Link>
      }
    />
  );
}
