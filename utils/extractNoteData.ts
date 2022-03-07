import { ExpandedNote, Frontmatter } from "../types/post";

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { createSlug } = require("./createSlug");

export function extractNoteData(
  fileName: string,
  includeExcerpt = false
): ExpandedNote {
  const NOTES_PATH = path.join(process.cwd(), "content/notes");
  const filePath = (fileName: string) => path.join(NOTES_PATH, fileName);
  const fileData = fs.readFileSync(filePath(fileName), "utf-8");
  const firstFourLines = (file: any) => {
    file.excerpt = file.content.split("\n").slice(0, 4).join(" ");
  };

  const {
    data: { private: privateKey, ...frontmatter },
    content,
    excerpt,
  } = matter(fileData, { excerpt: includeExcerpt && firstFourLines });

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

import { isValidDate } from "./isValidDate";

export function convertFrontmatterDatesToStrings(
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
