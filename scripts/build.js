const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const NOTES_PATH = path.join(__dirname, "../", "content/notes");

const fileFilter = (parentDir, fileName) => {
  const fullPath = path.join(parentDir, fileName);
  return fs.statSync(fullPath).isFile();
};

const filePath = (fileName) => path.join(NOTES_PATH, fileName);

function extractFrontmatter(fileName) {
  const content = fs.readFileSync(filePath(fileName), "utf-8");
  const { data: frontmatter } = matter(content);

  const slug = createSlug(fileName, frontmatter);

  return { ...frontmatter, slug, fileName };
}

function createSlug(fileName, frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}

function buildDictionary() {
  const slugDictionary = new Map();
  const fileNameDictionary = new Map();

  const dir = fs.readdirSync(NOTES_PATH);

  const files = dir.filter((fileName) => fileFilter(NOTES_PATH, fileName));
  const extracted = files.map(extractFrontmatter);
  extracted.forEach(({ fileName, stage, private = false, slug }) => {
    slugDictionary.set(slug, { fileName, stage, slug, private });
    fileNameDictionary.set(fileName, { fileName, stage, slug, private });
  });

  fs.writeFileSync(
    path.join(__dirname, "../dictionaries/slugDictionary.json"),
    JSON.stringify([...slugDictionary.entries()]),
    {
      encoding: "utf-8",
    }
  );
  fs.writeFileSync(
    path.join(__dirname, "../dictionaries/fileNameDictionary.json"),
    JSON.stringify([...fileNameDictionary.entries()]),
    {
      encoding: "utf-8",
    }
  );
}

buildDictionary();
