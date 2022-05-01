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
import fnDictionary from "../../public/resources/fileNameDictionary.json";
import { ExpandedNote, User } from "types/index";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
  removeUndefined,
  sessionOptions,
} from "utils";
import { extractNoteData } from "../../utils/serverUtils";
import { NavBar } from "../../components/NavBar";

const dict: Dictionary = rebuildDictionary(dictionary);
const fnDict: Dictionary = rebuildDictionary(fnDictionary);

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

const PostPage: NextPage<ExpandedNote> = (props) => {
  const { content, title, date, enhancedBacklinks } = props;

  const backlinksSection =
    enhancedBacklinks?.length ?? 0 > 0 ? (
      <div>
        <hr />
        <h1>Related Notes</h1>
        <div className="pills">
          <ul>
            {enhancedBacklinks?.map((eb) => (
              // <Post key={eb.slug} post={eb} />
              <li key={eb.slug}>{JSON.stringify(eb, null, 4)}</li>
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <></>
    );
  return (
    <>
      <NavBar />
      <div>
        <h1>{title}</h1>
        <div>Posted on {date}</div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
        {backlinksSection}
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

  // const content = await markdownToHtml(note.content || "");

  const expandedNote = {
    ...note,
    // content,
    enhancedBacklinks: enhanceBacklinks(note, user),
  };
  return { props: { ...expandedNote } };

  // return { props: { ...note } };
}

export default PostPage;
