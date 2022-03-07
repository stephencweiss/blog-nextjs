import type { Frontmatter } from "../types/post";

export function createSlug(fileName: string, frontmatter: Frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}
