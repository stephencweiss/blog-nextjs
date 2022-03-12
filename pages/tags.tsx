import * as React from "react";
import { withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { CommonDictionaryEntry } from "types/index";
import { isCollection, reconstituteDictionary, sessionOptions } from "utils";
import tagDictionary from "../public/resources/tagDictionary.json";
import { createPill, Pill, PillInput } from "../components";
import Link from "next/link";

const dict = reconstituteDictionary(tagDictionary);

// - [] pills for each tag
// - [] pills that are linked to the /search page to see all notes
// - [] pills with counts for each tag
// - [] pills with counts that are dynamic based on whether or not the notes are private
// - [] order pills by count & a-z - client side

const Tags: NextPage<{ tags: PillInput[] }> = (props) => {
  const pills = props.tags.map(createPill);

  return (
    <div>
      <ul className="pills">
        {pills.map((pill) => {
          const renderedPill = pill.path ? (
            <Link href={pill.path}>{pill.component}</Link>
          ) : (
            <>{pill.component}</>
          );

          return (
            <li className="pill-item" key={pill.id}>
              {renderedPill}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  wrappableServerSideProps,
  sessionOptions
);

async function wrappableServerSideProps(
  context: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>
): Promise<GetServerSidePropsResult<{ tags: PillInput[] }>> {
  const user = context?.req?.session?.user;
  const tags: PillInput[] = [];

  if (isCollection(dict)) {
    dict.data.forEach((val, key) => {
      tags.push({
        text: `${key}, ${val.length}`,
        type: "tag",
        path: `/search?q=${key}&type=search&target=tag`,
      });
    });
  }
  return { props: { tags } };
}

export default Tags;
