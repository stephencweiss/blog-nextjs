const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { createSlug } = require("./createSlug");

const NOTES_PATH = path.join(process.cwd(), "content/notes");

function extractFrontmatter(fileName) {
  const filePath = (fileName) => path.join(NOTES_PATH, fileName);
  const fileData = fs.readFileSync(filePath(fileName), "utf-8");
  function firstFourLines(file) {
    file.excerpt = file.content.split("\n").slice(0, 4).join(" ");
  }

  const {
    data: { private: privateKey, ...frontmatter },
    content,
    excerpt,
  } = matter(fileData, { excerpt: firstFourLines });

  const slug = createSlug(fileName, frontmatter);
  const isPublished = String(frontmatter?.stage)
    .toLowerCase()
    .includes("publish");

  return {
    ...frontmatter,
    content,
    slug,
    fileName,
    excerpt,
    isPrivate: privateKey || frontmatter.archived || !isPublished,
  };
}
exports.extractFrontmatter = extractFrontmatter;
