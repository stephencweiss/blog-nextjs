import fs from "fs";
import path from "path";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
// import {
//   addCountsToCollection,
//   isCollection,
//   reconstituteDictionary,
//   removeUndefined,
//   sessionOptions,
// } from "../../utils";

import { Card } from "../../components";
import {
  ExpandedNote,
  isSearchQuery,
  // SearchQuery,
  // isSearchQuery,
  // selectMetaFilterDictionary,
  // CollectionEntryWithCounts,
} from "../../types/index";
import { marked } from "marked";
import Link from "next/link";
import { createPillsFromNote } from "utils/pillHelpers";
import { sessionOptions } from "utils/withSession";
import { searchBuilder } from "../api/searchBuilder";

const search = searchBuilder();

type SearchResult = ExpandedNote;
const SearchPage: NextPage<{ query: SearchResult[] }> = ({ query }) => {
  // - [] Add search results
  // - [] Add sort functionality (a-z, z-a)
  // - [] remove search bar?
  return (
    <div>
      <Head>
        <title>Code Comments: Search</title>
        <meta name="description" content="Notes on Life & Software" />
        <meta name="keywords" content="TODO: Put in the query here" />
        <link rel="icon" href="/assets/initials.svg" />
      </Head>
      <main>
        <h1>Search</h1>

        <>
          {query.map((entry) => {
            const { title, excerpt, slug } = entry;
            return (
              <>
                <Card
                  title={title}
                  slug={`/blog/${slug}`}
                  // TODO: add date
                  // date={date ? `Posted on ${date}` : ""}
                  details={marked(excerpt ?? "")}
                  pills={createPillsFromNote(entry)}
                  primaryAction={
                    <Link href={`/blog/${slug}`}>
                      <a className="btn">Read More</a>
                    </Link>
                  }
                />
              </>
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
): Promise<GetServerSidePropsResult<{ query: ExpandedNote[] }>> {
  const { query } = context;
  const user = context?.req?.session?.user;
  if (!isSearchQuery(query)) {
    return { props: { query: [] } };
  }

  if (query.target === "search") {
    return { props: { query: search(query.q, user?.admin) } };
  } else {
    return { props: { query: search(query.q, user?.admin, [query.target]) } };
  }
}

// function textSearch() {
//   throw new Error("Not Implemented");
// }

// async function metaFilter(query: SearchQuery, user?: User) {
//   const { dictionary, style } = selectMetaFilterDictionary(query);
//   const dict = reconstituteDictionary(dictionary, style);
//   if (!isCollection(dict)) return [];

//   const canViewPrivate = canViewPrivateNotes(user);
//   const qs = query?.q;
//   const res = (
//     Array.isArray(qs)
//       ? qs.filter((q) => dict.data.has(q)).map((q) => dict.data.get(q))
//       : [dict.data.get(qs)]
//   )
//     .filter(removeUndefined)
//     .flat()
//     .filter((cde) => (canViewPrivate ? true : !cde.isPrivate))
//     .map((entry) => addCountsToCollection(entry, dict.style, user));

//   return res;
// }

export default SearchPage;
