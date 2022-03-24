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
import { extractNoteData } from "../../utils/serverUtils";
import { NavBar } from "../../components/NavBar";
import { formatDate } from "utils/formatters";
import { useEffect, useState } from "react";
import { useFormattedDates } from "hooks";

// import hljs from "highlight.js/lib/common";
// marked.setOptions({
//   highlight: function (code, lang) {
//     const language = hljs.getLanguage(lang) ? lang : "plaintext";
//     return hljs.highlight(code, { language }).value;
//   },
//   langPrefix: "hljs language-",
// });

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
      <NavBar />
      <div>
        <h1 className="text1 text-4xl font-bold">{title}</h1>
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
  const { content } = note;
  const html = marked.parse(content);

  return { props: { ...note, content: html } };
}

export default PostPage;
