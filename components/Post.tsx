import * as React from "react";
import Link from "next/link";
import { Post } from "../types/post";

export type Props = {
  post: Post;
};

export function Post({ post }: Props) {
  return (
    <div className="card">
      <div className="post-date">Posted on {post.frontmatter.date}</div>

      <h3>{post.frontmatter.title}</h3>

      {/* <p>{post.frontmatter.excerpt}</p> */}

      <Link href={`/${post.frontmatter.slug}`}>
        <a className="btn">Read More</a>
      </Link>
    </div>
  );
}
