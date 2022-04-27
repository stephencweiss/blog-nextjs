export type ExpandedNote = Note &
  Frontmatter & {
    slug: string;
    fileName: string;
    enhancedBacklinks?: ExpandedNote[];
  };

type Note = {
  content: string;
  excerpt?: string;
};

export type Backlink = {
  file: {
    base: string;
    dir: string;
    ext: ".md";
    name: string;
    root: string;
  };
  title: string;
};

export type Frontmatter = {
  title: string;
  date: string; // ISO timestamp
  publish?: string;
  updated?: string | string[]; // ISO timestamp
  isPrivate: true;
  pinned?: boolean;
  slug: string;
  tags?: string[];
  category?: string[];
  backlinks?: Backlink[];
} & (UnpublishedFrontmatter | PublishedFrontmatter);

type UnpublishedFrontmatter = {
  stage: "draft" | "archived";
};

type PublishedFrontmatter = {
  stage: "published";
  publish: string; // ISO timestamp
};
