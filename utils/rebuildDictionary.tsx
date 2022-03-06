export type Dictionary = Map<string, PostLookup>;

export type PostLookup = {
  fileName: string;
  stage: string;
  slug: string;
  isPrivate: boolean;
};

export function rebuildDictionary(flattenedDictionary: any) {
  const map = new Map();
  flattenedDictionary.map(([key, value]: any) => {
    map.set(key, value);
  });
  return map;
}
