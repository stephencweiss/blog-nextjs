import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage<{}> = () => {
  return (
    <div>
      <Head>
        <title>Code Comments</title>
        <meta name="description" content="Notes on Life & Software" />
        <link rel="icon" href="/assets/initials.svg" />
      </Head>
      <main>
        <Link href={"/blog"} passHref>
          <h1>Code Comments</h1>
        </Link>
        <Image
          height="100px"
          width="100px"
          objectFit="contain"
          src="/assets/initials.svg"
          alt={"logo of initials"}
        />

        <Link href={"/blog"} passHref>
          <a style={{ display: "block", fontSize: "2.5rem" }}>
            {"/* Code-Comments */"}
          </a>
        </Link>
        <h2>Notes on Software and Life</h2>
        <p>
          <em>written by Stephen Weiss</em>
        </p>
      </main>
    </div>
  );
};

export default Home;
