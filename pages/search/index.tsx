import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
  PreviewData,
} from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import {
  addCountsToCollection,
  isCollection,
  reconstituteDictionary,
  removeUndefined,
  sessionOptions,
} from "../../utils";

import { Card, createPill, NavBar, Search } from "../../components";
import {
  SearchQuery,
  User,
  isSearchQuery,
  selectMetaFilterDictionary,
  CollectionEntryWithCounts,
} from "../../types/index";
import { canViewPrivateNotes } from "utils/userPermissionFunctions";
import { marked } from "marked";
import Link from "next/link";

type SearchResult = CollectionEntryWithCounts<string>;
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
        <h1>Blog</h1>
        <NavBar />
        <Search />
        <>
          {query.map((entry) => {
            const { title, collection, date, excerpt, slug } = entry;
            const pills = collection.map((e) => {
              const count =
                entry.collectionCounts?.find((ct) => ct.key == e)?.count ?? 0;

              return createPill({
                id: e,
                count,
                type: "tag",
                path: `/search?q=${e}&type=search&target=tag`,
              });
            });
            return (
              <>
                <Card
                  title={title}
                  date={date ? `Posted on ${date}` : ""}
                  details={marked(excerpt ?? "")}
                  pills={pills}
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
): Promise<
  GetServerSidePropsResult<{ query: CollectionEntryWithCounts<string>[] }>
> {
  const { query } = context;
  const user = context?.req?.session?.user;
  if (!isSearchQuery(query)) {
    return { props: { query: [] } };
  }

  if (query.target === "search") {
    await textSearch();
    return { props: { query: [] } };
  } else {
    return {
      props: { query: await metaFilter(query, user) },
    };
  }
}

function textSearch() {
  throw new Error("Not Implemented");
}

async function metaFilter(query: SearchQuery, user?: User) {
  const { dictionary, style } = selectMetaFilterDictionary(query);
  const dict = reconstituteDictionary(dictionary, style);
  if (!isCollection(dict)) return [];

  const canViewPrivate = canViewPrivateNotes(user);
  const qs = query?.q;
  const res = (
    Array.isArray(qs)
      ? qs.filter((q) => dict.data.has(q)).map((q) => dict.data.get(q))
      : [dict.data.get(qs)]
  )
    .filter(removeUndefined)
    .flat()
    .filter((cde) => (canViewPrivate ? true : !cde.isPrivate))
    .map((entry) => addCountsToCollection(entry, dict.style, user));

  return res;
}

export default SearchPage;
