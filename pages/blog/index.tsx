import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";

import { withIronSessionSsr } from "iron-session/next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";
import dictionary from "../../public/resources/fileNameDictionary.json";
import { NavBar, Search, Post } from "../../components";
import { ExpandedNote } from "../../types/index";
import {
  mapAsync,
  extractNoteData,
  sessionOptions,
  getVisiblePosts,
} from "../../utils";

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
  const user = context?.req?.session?.user;

  const visiblePosts = await getVisiblePosts(dictionary, user);

  const posts = await mapAsync(
    visiblePosts,
    async (file) => await extractNoteData(file, true)
  );

  return { props: { posts } };
}

export default Blog;
