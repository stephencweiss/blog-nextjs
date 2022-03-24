import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage<{}> = () => {
  return (
    <div className="h-full">
      <Head>
        <title>code comments</title>
        <meta name="description" content="notes on software & life" />
        <link rel="icon" href="/assets/initials.svg" />
      </Head>
      {/* <main className="h-full"> */}
      <div className="flex justify-center items-center text-center h-full">
        <div>
          <div className="mb-4 logo">
            <Link href={"/blog"} passHref>
              <Image
                className="link"
                height="250px"
                width="250px"
                objectFit="contain"
                src="/assets/initials.svg"
                alt={"logo of initials"}
              />
            </Link>
          </div>
          <Link href={"/blog"} passHref>
            <h1 className="link text1 text-4xl font-bold">
              {"/* code comments */"}
            </h1>
          </Link>
          <h2 className="text2 text-2xl font-semibold">
            notes on software & life
          </h2>
          <p className="text2">
            <em>written by Stephen Weiss</em>
          </p>
        </div>
      </div>
      {/* </main> */}
    </div>
  );
};

export default Home;
