import * as React from "react";
import Link from "next/link";
import { ExpandedNote } from "../types/post";
import { Card } from "./Card";
import { marked } from "marked";
import { createPillsFromNote } from "utils/pillHelpers";

type PostProps = {
  post: ExpandedNote;
};

export function Post({ post }: PostProps) {
  const { title, date, slug, excerpt } = post;

  return (
    <Card
      title={title}
      slug={`/blog/${slug}`}
      subheader={`Posted on ${date}`}
      details={marked(excerpt ?? "")}
      pills={createPillsFromNote(post)}
      primaryAction={
        <Link href={`/blog/${slug}`}>
          <a className="btn">Read More</a>
        </Link>
      }
    />
  );
}
