import { CommonDictionaryEntry } from "types/_note";

export type Dictionary = {
  type: "Dictionary";
  data: Map<string, CommonDictionaryEntry>;
};
export type Collection = {
  type: "Collection";
  data: Map<string, CommonDictionaryEntry[]>;
};

type ReferenceType = Dictionary | Collection;

export function reconstituteDictionary(
  flattenedDictionary: any[]
): ReferenceType {
  const map = new Map();
  const input = Array.isArray(flattenedDictionary)
    ? flattenedDictionary
    : Object.entries(flattenedDictionary);

  input.map(([key, value]: any) => {
    map.set(key, value);
  });
  return {
    type: Array.isArray(input[0][1]) ? "Collection" : "Dictionary",
    data: map,
  };
}

export const isDictionary = (x: ReferenceType): x is Dictionary => {
  return x.type === "Dictionary";
};
export const isCollection = (x: ReferenceType): x is Collection => {
  return x.type === "Collection";
};
