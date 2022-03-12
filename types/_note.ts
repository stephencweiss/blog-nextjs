export type ExpandedNote = Note &
  Frontmatter & {
    slug: string;
    fileName: string;
  };

export type VisibilityCount = {
  totalCount: number;
  publicCount: number;
};

export type CollectionEntry<T> = CommonDictionaryEntry & { collection: T[] };

export type CommonDictionaryEntry = Pick<
  ExpandedNote,
  "date" | "fileName" | "stage" | "slug" | "title" | "excerpt"
> & { isPrivate: boolean };

type Note = {
  content: string;
  excerpt?: string;
};

export type Frontmatter = {
  title: string;
  date: string; // ISO timestamp
  updated?: string | string[]; // ISO timestamp
  isPrivate: true;
  slug: string;
  category?: [];
  tags?: [];
} & (UnpublishedFrontmatter | PublishedFrontmatter);

type UnpublishedFrontmatter = {
  stage: "draft" | "archived";
};

type PublishedFrontmatter = {
  stage: "published";
  publish: string; // ISO timestamp
};
