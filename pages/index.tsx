import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Post as PostType } from "../types/post";

const Home: NextPage<{ posts: PostType[] }> = () => {
  return (
    <div>
      <Head>
        <title>Code Comments</title>
        <meta name="description" content="Notes on Life & Software" />
        <link rel="icon" href="/assets/initials.svg" />
      </Head>
      <main>
        <Link href={"/blog"} passHref>
          <Image
            height="100px"
            objectFit="contain"
            src="/assets/initials.svg"
            alt={"logo of initials"}
          />
        </Link>
        <Link href={"/blog"} passHref>
          <h1>{"/* Code-Comments */"}</h1>
        </Link>
        <h2>Notes on Software and Life</h2>

        <p>
          <em>written by Stephen Weiss</em>
        </p>

        {/* <Login />
        <>
          {posts.map((post: PostType) => (
            <Post key={post.frontmatter.slug} post={post} />
          ))}
        </> */}
      </main>
    </div>
  );
};

export default Home;
