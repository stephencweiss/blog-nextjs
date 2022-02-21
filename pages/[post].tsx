import { NextPage } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { Post } from "../types/post";

import { NOTES_PATH } from "../constants";

import dictionary from "../dictionaries/slugDictionary.json";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
} from "../utils/rebuildDictionary";

const dict: Dictionary = rebuildDictionary(dictionary);
const PostPage: NextPage<Post> = (props) => {
  const { content, frontmatter } = props;
  const { title, date } = frontmatter;
  return (
    <>
      <Link href="/">
        <a className="btn btn-back">Go Back</a>
      </Link>
      <div className="card card-page">
        hello, world
        <h1 className="post-title">{title}</h1>
        <div className="post-date">Posted on {date}</div>
        <div className="post-body">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
      </div>
    </>
  );
};

export function getServerSideProps(context: any) {
  const post = context?.query?.post;

  const specific = dict.get(post) ?? ({} as PostLookup);

  const file = fs.readFileSync(path.join(NOTES_PATH, specific?.fileName));

  const { content, data: frontmatter } = matter(file);

  return { props: { content, frontmatter: { ...frontmatter } } };
}

export default PostPage;
