import type { NextPage } from "next";
import fs from "fs/promises";

import Head from "next/head";
import { extractFrontmatter } from "../utils/extractFrontmatter";
import { filterAsync, mapAsync } from "../utils/asyncArrayFunctions";
import { NOTES_PATH } from "../constants";
import { Post as PostType } from "../types/post";
import { Post } from "../components/Post";
import { fileFilter } from "../utils/fileFilter";
import dictionary from "../dictionaries/fileNameDictionary.json";
import { Dictionary, rebuildDictionary } from "../utils/rebuildDictionary";
import { Login } from "../components/Login";

const Home: NextPage<{ posts: PostType[] }> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Code Comments</title>
        <meta name="description" content="Notes on Life & Software" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Login />
        <>
          {posts.map((post: PostType) => (
            <Post key={post.frontmatter.slug} post={post} />
          ))}
        </>
      </main>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
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

  const publicOnly = filterPrivate(filteredFiles, dict);
  const publicPosts = filterPublished(filterPrivate(filteredFiles, dict), dict);
  console.log({
    publicLength: publicOnly.length,
    published: publicPosts.length,
  });
  const posts = await mapAsync(publicPosts, async (file) => ({
    frontmatter: await extractFrontmatter(file),
  }));

  return { props: { posts } };
}
