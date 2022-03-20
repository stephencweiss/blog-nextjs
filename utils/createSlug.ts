import type { Frontmatter } from "../types/index";

export function createSlug(fileName: string, frontmatter: Frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}
