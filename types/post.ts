export type ExpandedNote = Note &
  Frontmatter & {
    slug: string;
    fileName: string;
  };

type Note = {
  content: string;
  excerpt?: string;
};

export type Frontmatter = {
  title: string;
  date: string; // ISO timestamp
  isPrivate: true;
  slug: string;
} & (UnpublishedFrontmatter | PublishedFrontmatter);

type UnpublishedFrontmatter = {
  stage: "draft" | "archived";
};

type PublishedFrontmatter = {
  stage: "published";
  publish: string; // ISO timestamp
};
