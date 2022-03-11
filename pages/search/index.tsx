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
  reconstituteDictionary,
  removeUndefined,
  sessionOptions,
} from "../../utils";
import { CommonDictionaryEntry } from "../../types/index";
import { NavBar, Post, Search } from "../../components";

import {
  ExpandedNote,
  SearchQuery,
  User,
  isSearchQuery,
  selectMetaFilterDictionary,
} from "../../types/index";
import { canViewPrivateNotes } from "utils/userPermissionFunctions";

type SearchResult = ExpandedNote;
const SearchPage: NextPage<{ query: SearchResult[] }> = ({ query }) => {
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
          {query.map((post: any) => (
            <Post key={post.slug} post={post} />
          ))}
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
): Promise<GetServerSidePropsResult<{ query: CommonDictionaryEntry[] }>> {
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
  const dict = reconstituteDictionary(selectMetaFilterDictionary(query));
  const canViewPrivate = canViewPrivateNotes(user);
  const qs = query?.q;
  const res = (
    Array.isArray(qs)
      ? qs.filter((q) => dict.data.has(q)).map((q) => dict.data.get(q))
      : [dict.data.get(qs)]
  )
    .filter(removeUndefined)
    .flat()
    .filter((cde) => (canViewPrivate ? true : !cde.isPrivate));

  return res;
}

export default SearchPage;
