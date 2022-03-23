import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage<{}> = () => {
  return (
    <div className="h-full">
      <Head>
        <title>Code Comments</title>
        <meta name="description" content="Notes on Life & Software" />
        <link rel="icon" href="/assets/initials.svg" />
      </Head>
      <main className="h-full">
        <div className="flex justify-center items-center text-center h-full">
          <div>
            <div>
              <Link href={"/blog"} passHref>
                <Image
                  className="link logo"
                  height="250px"
                  width="250px"
                  objectFit="contain"
                  src="/assets/initials.svg"
                  alt={"logo of initials"}
                />
              </Link>
            </div>
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
