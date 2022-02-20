export type Post = {
  content?: any; // not sure what this is yet
  frontmatter: PostFrontmatter;
};

export type PostFrontmatter = {
  title: string;
  date: string; // ISO timestamp
  draft?: boolean | string; // get rid of this key!
  fileName: string;
  private?: true;
  publish?: string;
  slug: string;
  stage: "draft" | "published" | "archived";
};
