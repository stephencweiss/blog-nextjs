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
      <>
        <div>
          <div className="mt-1">mt1</div>
          <div className="mt-2">mt2</div>
          <div className="mt-3">mt-3</div>
          <div className="mt-4">mt-4</div>
          <div className="mt-5">mt-5</div>
          <div className="mt-6">mt-6</div>
          <div className="mt-7">mt-7</div>
          <div className="mt-8">mt-8</div>
          <div className="mt-9">mt-9</div>
          <div className="mt-10">mt-10</div>
          <div className="mt-11">mt-11</div>
          <div className="mt-12">mt-12</div>
          <div className="mt-13">mt-13</div>
          <div className="mt-14">mt-14</div>
        </div>
      </>
    </div>
  );
};

export default Home;
