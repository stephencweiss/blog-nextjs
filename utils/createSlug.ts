import type { Frontmatter } from "../types/note";

export function createSlug(fileName: string, frontmatter: Frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}
