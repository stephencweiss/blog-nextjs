import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { withIronSessionSsr } from "iron-session/next";
import { ExpandedNote } from "../../types/post";

import { NOTES_PATH } from "../../constants";

import dictionary from "../../public/resources/slugDictionary.json";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
} from "../../utils/rebuildDictionary";
import { sessionOptions } from "../../utils/withSession";
import { NavBar } from "../../components/NavBar";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

const dict: Dictionary = rebuildDictionary(dictionary);
const PostPage: NextPage<ExpandedNote> = (props) => {
  const { content, title, date } = props;
  return (
    <>
      <NavBar />
      <div>
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
