import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextPage,
  NextPageContext,
  PreviewData,
} from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { Post } from "../../types/post";

import { NOTES_PATH } from "../../constants";

import dictionary from "../../dictionaries/slugDictionary.json";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
} from "../../utils/rebuildDictionary";
import { sessionOptions } from "../../utils/withSession";
import { NavBar } from "../../components/NavBar";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

const dict: Dictionary = rebuildDictionary(dictionary);
const PostPage: NextPage<Post> = (props) => {
  const { content, frontmatter } = props;
  const { title, date } = frontmatter;
  return (
    <>
      <NavBar />
      <div>
        hello, world
        <h1>{title}</h1>
        <div>Posted on {date}</div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  wrappableServerSideProps,
  sessionOptions
);

async function wrappableServerSideProps(
  context: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>
): Promise<
  GetServerSidePropsResult<
    { content: string; frontmatter: any } | { notFound: true }
  >
> {
  const { query, req } = context;
  const post = typeof query?.post === "string" ? query.post : "";
  const user = req?.session?.user;

  const specific = dict.get(post) ?? ({} as PostLookup);

  const file = fs.readFileSync(path.join(NOTES_PATH, specific?.fileName));

  const { content, data: frontmatter } = matter(file);

  // if the post is private and the user isn't an admin, show 404
  if (frontmatter?.private && user?.admin !== true) {
    return { notFound: true };
  }

  return { props: { content, frontmatter: { ...frontmatter } } };
}

export default PostPage;
