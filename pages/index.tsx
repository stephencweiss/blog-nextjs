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
        <div className="center centerText fullPage">
          <div>
            <Link href="/blog" passHref>
              <Image
                className="link"
                height="200px"
                width="200px"
                objectFit="contain"
                src="/assets/initials.svg"
                alt={"logo of initials"}
              />
            </Link>
            <Link href={"/blog"} passHref>
              <h1 className="link">{"/* Code Comments */"}</h1>
            </Link>
            <h2>Notes on Software and Life</h2>
            <p>
              <em>written by Stephen Weiss</em>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
