import { ParsedUrlQuery } from "querystring";
import tagDictionary from "../public/resources/tagDictionary.json";
import categoryDictionary from "../public/resources/categoryDictionary.json";

export type SearchQuery = ParsedUrlQuery & {
  q: string;
  type: "search";
  target: "tag" | "category" | "search";
};

export const isSearchQuery = (x: ParsedUrlQuery): x is SearchQuery => {
  const { type } = x;
  return type === "search";
};

export const selectMetaFilterDictionary = (query: SearchQuery) => {
  const { target } = query;
  switch (target) {
    case "tag":
      return tagDictionary;
    case "category":
      return categoryDictionary;
    default:
      throw new Error("Unknown query target");
  }
};
