import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import { withIronSessionSsr } from "iron-session/next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import dictionary from "../../public/resources/slugDictionary.json";
import { ExpandedNote } from "types/index";
import {
  Dictionary,
  markdownToHtml,
  PostLookup,
  rebuildDictionary,
  sessionOptions,
} from "utils";
import { extractNoteData } from "../../utils/serverUtils";
import { useFormattedDates } from "hooks";
import { getPostLayout } from "layout/post";

const dict: Dictionary = rebuildDictionary(dictionary);
const PostPage: NextPage<ExpandedNote> = (props) => {
  const { content, title, date, updated, publish } = props;

  const { postDate, updatedDate } = useFormattedDates(props);
  // todo: format date
  // add categories
  // add tags
  // style code
  // add backlinks

  return (
    <>
      <div>
        <h1>{title}</h1>
        {postDate ? <p className="italic">Posted on {postDate}</p> : <></>}
        {updatedDate ? (
          <p className="italic">Last updated on {updatedDate}</p>
        ) : (
          <></>
        )}
        <div className="post-body">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
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

  const content = await markdownToHtml(note.content || "");

  return { props: { ...note, content } };
}

// TODO: figure out how to type the PostPage
// (PostPage as any).getLayout = getPostLayout;
PostPage.getLayout = getPostLayout;

export default PostPage;
