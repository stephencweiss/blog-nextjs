import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import { marked } from "marked";
import { withIronSessionSsr } from "iron-session/next";
import { ExpandedNote } from "../../types/index";

import dictionary from "../../public/resources/slugDictionary.json";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
} from "../../utils/rebuildDictionary";
import { sessionOptions } from "../../utils/withSession";
import { NavBar } from "../../components/NavBar";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { extractNoteData } from "../../utils/extractNoteData";

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
): Promise<GetServerSidePropsResult<ExpandedNote | { notFound: true }>> {
  const { query, req } = context;
  const post = typeof query?.post === "string" ? query.post : "";
  const user = req?.session?.user;

  const specific = dict.get(post) ?? ({} as PostLookup);
  const note = extractNoteData(specific.fileName);

  // if the post is private and the user isn't an admin, show 404
  if (note?.isPrivate && user?.admin !== true) {
    return { notFound: true };
  }

  return { props: { ...note } };
}

export default PostPage;
