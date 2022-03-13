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
import categoryCount from "../../public/resources/categoryVisibilityDictionary.json";
import tagCount from "../../public/resources/tagVisiblityDictionary.json";
import { NavBar, Search, Post } from "../../components";
import { ExpandedNoteWithCounts } from "../../types/index";
import {
  addCountsToNotes,
  mapAsync,
  sessionOptions,
  reconstituteCounts,
} from "../../utils";
import { getVisiblePosts, extractNoteData } from "../../ssUtils";

export const cCount = reconstituteCounts(categoryCount);
export const tCount = reconstituteCounts(tagCount);

const Blog: NextPage<{ posts: ExpandedNoteWithCounts[] }> = ({ posts }) => {
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
          {posts.map((post) => {
            const { slug, tagCounts, categoryCounts } = post;
            return (
              <Post
                key={slug}
                post={post}
                tagCounts={tagCounts}
                categoryCounts={categoryCounts}
              />
            );
          })}
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
): Promise<GetServerSidePropsResult<{ posts: ExpandedNoteWithCounts[] }>> {
  const user = context?.req?.session?.user;
  const visiblePosts = await getVisiblePosts(dictionary, "fileName", user);

  const posts = await mapAsync(
    visiblePosts,
    async (file) => await extractNoteData(file, true)
  );

  const postsWithCounts: ExpandedNoteWithCounts[] = posts.map((post) =>
    addCountsToNotes(post, user)
  );

  return { props: { posts: postsWithCounts } };
}

export default Blog;
