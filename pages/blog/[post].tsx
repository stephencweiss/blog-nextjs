import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { withIronSessionSsr } from "iron-session/next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import dictionary from "../../public/resources/slugDictionary.json";
import fileDictionary from "../../public/resources/fileNameDictionary.json";
import {
  createPillsFromNote,
  Dictionary,
  PostLookup,
  rebuildDictionary,
  removeUndefined,
  sessionOptions,
} from "utils";
import { Pill, Post } from "../../components";
import { extractNoteData, markdownToHtml } from "../../utils/serverUtils";
import { useFormattedDates } from "hooks";
import { getPostLayout } from "layout/post";
import { ExpandedNote, User } from "types/index";
import { NextPageWithLayout } from "types";

const dict: Dictionary = rebuildDictionary(dictionary);
const fnDict: Dictionary = rebuildDictionary(fileDictionary);

function enhanceBacklinks(note: ExpandedNote, user?: User): ExpandedNote[] {
  const backlinks = note.backlinks ?? [];

  if (backlinks?.length === 0) {
    return [];
  }

  const base = backlinks.map((b) => b.file?.base);
  const files = [...new Set(base)];

  return files
    .map((file) => fnDict.get(file))
    .filter(removeUndefined)
    .filter((item) => filterPrivate(item, user))
    .map((backlink) => extractNoteData(backlink.fileName, true));
}

function filterPrivate(item: { isPrivate: boolean }, user?: User) {
  return user?.admin ? true : !item.isPrivate;
}

const PostPage: NextPageWithLayout<ExpandedNote> = (props) => {
  const { content, title, enhancedBacklinks, date, updated, publish } = props;

  const pills = createPillsFromNote(props);
  const { postDate, updatedDate } = useFormattedDates(props);
  // todo: format date
  const backlinksSection =
    enhancedBacklinks?.length ?? 0 > 0 ? (
      <div>
        <hr />
        <h1>Related Notes</h1>
        <div className="pills">
          {enhancedBacklinks?.map((eb) => (
            <Post key={eb.slug} post={eb} />
          ))}
        </div>
      </div>
    ) : (
      <></>
    );

  return (
    <>
      <div className="post-container">
        <h1 className="capitalize">{title}</h1>
        {postDate ? <p className="italic">Posted on {postDate}</p> : <></>}
        {updatedDate ? (
          <p className="italic">Last updated on {updatedDate}</p>
        ) : (
          <></>
        )}
        <div className="pills">
          {pills.map((pill) => (
            <Pill key={pill.id} {...pill} />
          ))}
        </div>

        <div className="post-body">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>

      {backlinksSection}
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

  const expandedNote = {
    ...note,
    content,
    enhancedBacklinks: enhanceBacklinks(note, user),
  };
  return { props: { ...expandedNote } };
}

PostPage.getLayout = getPostLayout;

export default PostPage;
