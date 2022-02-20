import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { convertDatesToStrings } from "./convertDatesToStrings";
import { NOTES_PATH } from "../constants";
import { PostFrontmatter } from "../types/post";

export const filePath = (fileName: string) => path.join(NOTES_PATH, fileName);

export async function extractFrontmatter(fileName: string) {
  const content = await fs.readFile(filePath(fileName), "utf-8");
  const { data: frontmatter } = matter(content);

  const slug = createSlug(fileName, frontmatter as PostFrontmatter);

  return { ...convertDatesToStrings(frontmatter), slug, fileName };
}

export function createSlug(fileName: string, frontmatter: PostFrontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}
