export type ExpandedNote = Note &
  Frontmatter & {
    slug: string;
    fileName: string;
  };

export type KeyCounts = { key: string; count: number };
export type ExpandedNoteWithCounts = ExpandedNote & {
  tagCounts: KeyCounts[];
  categoryCounts: KeyCounts[];
};
export type CollectionEntry<T> = CommonDictionaryEntry & { collection: T[] };
export type CollectionEntryWithCounts<T> = CollectionEntry<T> & {
  collectionCounts: KeyCounts[];
};

export type VisibilityCount = {
  totalCount: number;
  publicCount: number;
};

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
