export type Dictionary = Map<string, PostLookup>;

export type PostLookup = {
  fileName: string;
  stage: string;
  slug: string;
  isPrivate: boolean;
  title: string;
  excerpt: string;
  // present in allData
  updated?: string[];
  date?: string;
  publish?: string;
  content?: string;
  tags?: string[];
  category?: string[];
};

export function rebuildDictionary(flattenedDictionary: any) {
  const map = new Map();
  flattenedDictionary.map(([key, value]: any) => {
    map.set(key, value);
  });
  return map;
}
