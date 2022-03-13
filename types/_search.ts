import { ParsedUrlQuery } from "querystring";
import tagDictionary from "../public/resources/tagDictionary.json";
import categoryDictionary from "../public/resources/categoryDictionary.json";
import { DictionaryStyle } from "utils";

export type SearchQuery = ParsedUrlQuery & {
  q: string;
  type: "search";
  target: "tag" | "category" | "search";
};

export const isSearchQuery = (x: ParsedUrlQuery): x is SearchQuery => {
  const { type } = x;
  return type === "search";
};

export const selectMetaFilterDictionary = (
  query: SearchQuery
): { dictionary: any; style: DictionaryStyle } => {
  const { target } = query;
  switch (target) {
    case "tag":
      return { dictionary: tagDictionary, style: "tags" };
    case "category":
      return { dictionary: categoryDictionary, style: "category" };
    default:
      throw new Error("Unknown query target");
  }
};
