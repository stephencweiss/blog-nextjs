import path from "path";
/**
 * The full path to the directory where the blog content lives
 */
export const NOTES_PATH = path.join(process.cwd(), "content/notes");

export const SEARCH_FIELDS = [
  "fileName",
  "title",
  "slug",
  "tags",
  "category",
  "stage",
  "content",
];
export const FLEX_SEARCH_OPTIONS = {
  document: {
    id: "id",
    optimize: true,
    tokenize: "full",
    cache: 100,
    index: SEARCH_FIELDS,
  },
};
