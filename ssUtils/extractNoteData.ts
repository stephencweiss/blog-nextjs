import type { ExpandedNote, Frontmatter } from "../types/index";
import fs from "fs";
import path from "path";
import { createSlug } from "../utils/createSlug";
import { isValidDate } from "../utils/isValidDate";
import { NOTES_PATH } from "../constants";

const matter = require("gray-matter");
const getComposedRegex = (flags: string, ...regexes: RegExp[]) =>
  new RegExp(regexes.map((regex) => regex.source).join("|"), flags);

export function extractNoteData(
  fileName: string,
  includeExcerpt = false
): ExpandedNote {
  const filePath = (fileName: string) => path.join(NOTES_PATH, fileName);
  const fileData = fs.readFileSync(filePath(fileName), "utf-8");
  const cleanedFirstFourLines = (file: any) => {
    const imagePattern = new RegExp(/(!\[.*\]\(.*\))/g);
    const headerPattern = new RegExp(/(#+)/g);
    const quotesPattern = new RegExp(/((^|\n)>\s)/g);
    const pattern = getComposedRegex(
      "g",
      imagePattern,
      headerPattern,
      quotesPattern
    );

    file.excerpt = file.content
      .replace(pattern, "")
      .split("\n")
      .slice(0, 4)
      .join(" ");
  };

  const matterOptions = includeExcerpt
    ? { excerpt: cleanedFirstFourLines }
    : {};
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
