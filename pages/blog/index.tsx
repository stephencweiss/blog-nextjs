import type { NextPage, NextPageContext } from "next";
import fs from "fs/promises";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";

import { extractFrontmatter } from "../../utils/extractFrontmatter";
import { filterAsync, mapAsync } from "../../utils/asyncArrayFunctions";
import { NOTES_PATH } from "../../constants";
import { Post as PostType } from "../../types/post";
import { Post } from "../../components/Post";
import { fileFilter } from "../../utils/fileFilter";
import dictionary from "../../dictionaries/fileNameDictionary.json";
import { Dictionary, rebuildDictionary } from "../../utils/rebuildDictionary";
import { NavBar } from "../../components/NavBar";
import { sessionOptions } from "../../utils/withSession";

const Blog: NextPage<{ posts: PostType[] }> = ({ posts }) => {
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
        <>
          {posts.map((post: PostType) => (
            <Post key={post.frontmatter.slug} post={post} />
          ))}
        </>
      </main>
    </div>
  );
};

export default Blog;

export const getServerSideProps = withIronSessionSsr(async function (
  context: NextPageContext
) {
  const dir = await fs.readdir(NOTES_PATH);
  const filteredFiles = await filterAsync(dir, (fileName) =>
    fileFilter(NOTES_PATH, fileName)
  );
  const dict: Dictionary = rebuildDictionary(dictionary);

  function filterPrivate(files: string[], dictionary: Dictionary) {
    return files.filter(
      (file) => dictionary.has(file) && !dictionary.get(file)?.private
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

  const posts = await mapAsync(publicPosts, async (file) => ({
    frontmatter: await extractFrontmatter(file),
  }));

  return { props: { posts } };
},
sessionOptions);
