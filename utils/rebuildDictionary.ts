import {
  CommonDictionaryEntry,
  CollectionEntry,
  VisibilityCount,
} from "types/index";

export type DictionaryStyle = "category" | "tags" | "slug" | "fileName";
export type Dictionary = StorageStyle & {
  type: "Dictionary";
  data: Map<string, CommonDictionaryEntry>;
};
export type Collection = StorageStyle & {
  type: "Collection";
  data: Map<string, CollectionEntry<string>[]>;
};

type StorageStyle = { style: DictionaryStyle };

export type StorageType = Dictionary | Collection;

export function reconstituteDictionary(
  flattenedDictionary: any[],
  style: DictionaryStyle
): StorageType {
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
    style,
  };
}

export function reconstituteCounts(
  flattenedCount: any[]
): Map<string, VisibilityCount> {
  const map = new Map();
  flattenedCount.map(([key, counts]) => map.set(key, counts));
  return map;
}

export const isDictionary = (x: StorageType): x is Dictionary => {
  return x.type === "Dictionary";
};
export const isCollection = (x: StorageType): x is Collection => {
  return x.type === "Collection";
};
