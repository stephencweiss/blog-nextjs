import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import { marked } from "marked";
import { withIronSessionSsr } from "iron-session/next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import dictionary from "../../public/resources/slugDictionary.json";
import { ExpandedNote } from "types/index";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
  sessionOptions,
} from "utils";
import { extractNoteData } from "utils/serverUtils";
import { NavBar } from "../../components/NavBar";

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
