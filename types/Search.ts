import { ParsedUrlQuery } from "querystring";

export type SearchQuery = ParsedUrlQuery & {
  q: string;
  type: "search";
  target: "tag" | "category" | "search";
};

export const isSearchQuery = (x: ParsedUrlQuery): x is SearchQuery => {
  const { type } = x;
  return type === "search";
};
