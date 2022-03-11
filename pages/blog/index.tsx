import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import fs from "fs/promises";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";

import { extractNoteData } from "../../utils/extractNoteData";
import { filterAsync, mapAsync } from "../../utils/asyncArrayFunctions";
import { NOTES_PATH } from "../../constants";
import { ExpandedNote } from "../../types/note";
import { Post } from "../../components/Post";
import { fileFilter } from "../../utils/fileFilter";
import dictionary from "../../public/resources/fileNameDictionary.json";
import { Dictionary, rebuildDictionary } from "../../utils/rebuildDictionary";
import { NavBar } from "../../components/NavBar";
import { sessionOptions } from "../../utils/withSession";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Search from "../../components/Search";

const Blog: NextPage<{ posts: ExpandedNote[] }> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Code Comments: Blog</title>
        <meta name="description" content="Notes on Life & Software" />
        <link rel="icon" href="/assets/initials.svg" />
      </Head>
      <main>
        <h1>Blog</h1>
        <NavBar />
        <Search />
        <>
          {posts.map((post: ExpandedNote) => (
            <Post key={post.slug} post={post} />
          ))}
        </>
      </main>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  wrappableServerSideProps,
  sessionOptions
);

async function wrappableServerSideProps(
  context: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>
): Promise<GetServerSidePropsResult<{ posts: ExpandedNote[] }>> {
  const dir = await fs.readdir(NOTES_PATH);
  const filteredFiles = await filterAsync(dir, (fileName) =>
    fileFilter(NOTES_PATH, fileName)
  );
  const dict: Dictionary = rebuildDictionary(dictionary);

  function filterPrivate(files: string[], dictionary: Dictionary) {
    return files.filter(
      (file) => dictionary.has(file) && !dictionary.get(file)?.isPrivate
    );
  }

  function filterPublished(files: string[], dictionary: Dictionary) {
    return files.filter(
      (file) =>
        dictionary.has(file) &&
        (dictionary.get(file)?.stage ?? "").toLowerCase() === "published"
    );
  }

  const user = context?.req?.session?.user;

  const publicPosts = filterPublished(
    user?.admin !== true ? filterPrivate(filteredFiles, dict) : filteredFiles,
    dict
  );

  const posts = await mapAsync(
    publicPosts,
    async (file) => await extractNoteData(file, true)
  );

  return { props: { posts } };
}

export default Blog;
