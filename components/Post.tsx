import * as React from "react";
import Link from "next/link";
import { ExpandedNote } from "../types/index";
import { Card } from "./Card";
import { marked } from "marked";
import { createPillsFromNote } from "utils/pillHelpers";
import { useFormattedDates } from "hooks";

type PostProps = {
  post: ExpandedNote;
};

export function Post({ post }: PostProps) {
  const { title, slug, excerpt } = post;
  const { postDate } = useFormattedDates(post);

  return (
    <Card
      title={title}
      slug={`/blog/${slug}`}
      subheader={`Posted on ${postDate}`}
      details={marked(excerpt ?? "")}
      pills={createPillsFromNote(post)}
      primaryAction={
        <div className="max-width flex flex-row-reverse">
          <Link href={`/blog/${slug}`}>
            <a className="btn">Read More &#10149;</a>
          </Link>
        </div>
      }
    />
  );
}
