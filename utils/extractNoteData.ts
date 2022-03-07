const matter = require("gray-matter");

import type { ExpandedNote, Frontmatter } from "../types/post";
import fs from "fs";
import path from "path";
import { createSlug } from "./createSlug";
import { isValidDate } from "./isValidDate";
import { NOTES_PATH } from "../constants";

export function extractNoteData(
  fileName: string,
  includeExcerpt = false
): ExpandedNote {
  const filePath = (fileName: string) => path.join(NOTES_PATH, fileName);
  const fileData = fs.readFileSync(filePath(fileName), "utf-8");
  const firstFourLines = (file: any) => {
    file.excerpt = file.content.split("\n").slice(0, 4).join(" ");
  };

  const matterOptions = includeExcerpt ? { excerpt: firstFourLines } : {};
  const {
    data: { private: privateKey, ...frontmatter },
    content,
    excerpt,
  } = matter(fileData, matterOptions);

  const slug = createSlug(fileName, frontmatter);
  const isPublished = String(frontmatter?.stage)
    .toLowerCase()
    .includes("publish");

  return {
    ...convertFrontmatterDatesToStrings(frontmatter),
    content,
    slug,
    fileName,
    excerpt,
    isPrivate: privateKey || frontmatter.archived || !isPublished,
  };
}

function convertFrontmatterDatesToStrings(
  frontmatter: Frontmatter
): Frontmatter {
  let updated = [];
  if (Array.isArray(frontmatter.updated)) {
    frontmatter.updated
      .filter((x) => x)
      .forEach((updt: string) => updated.push(convertDtToString(updt)));
  } else if (frontmatter.updated) {
    updated.push(convertDtToString(frontmatter.updated));
  }

  frontmatter.date = convertDtToString(frontmatter.date);

  if (frontmatter.stage === "published") {
    frontmatter.publish = convertDtToString(frontmatter.publish);
  }

  return { updated, ...frontmatter };
}

function convertDtToString(dt: string | Date) {
  return isValidDate(dt)
    ? new Date(dt).toISOString()
    : new Date().toISOString();
}
