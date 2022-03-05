const fs = require("fs");
const path = require("path");
const lunr = require("lunr");
const matter = require("gray-matter");

const NOTES_PATH = path.join(__dirname, "../", "content/notes");

const fileFilter = (parentDir, fileName) => {
  const fullPath = path.join(parentDir, fileName);
  return fs.statSync(fullPath).isFile();
};

const filePath = (fileName) => path.join(NOTES_PATH, fileName);

function extractFrontmatter(fileName) {
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

function createSlug(fileName, frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}

function writeToDisk(data, fileName) {
  const dirPath = path.join(process.cwd(), "public/resources");
  try {
    fs.readdirSync(dirPath);
  } catch (e) {
    fs.mkdirSync(dirPath);
  }

  fs.writeFileSync(`${dirPath}/${fileName}.json`, JSON.stringify(data), {
    encoding: "utf-8",
  });
}

function buildSearchIndex(data) {
  const privateSearchIdx = lunr(function () {
    this.ref("slug");
    this.field("fileName");
    this.field("title");
    this.field("slug");
    this.field("tags");
    this.field("category");
    this.field("stage");
    this.field("isPrivate");
    this.field("content");

    data.forEach((entry) => this.add(entry));
  });

  const publicSearchIdx = lunr(function () {
    this.ref("slug");
    this.field("fileName");
    this.field("title");
    this.field("slug");
    this.field("tags");
    this.field("category");
    this.field("stage");
    this.field("isPrivate");
    this.field("content");

    data.forEach((entry) => !entry.isPrivate && this.add(entry));
  });

  writeToDisk(publicSearchIdx, "publicSearchIdx");
  writeToDisk(privateSearchIdx, "privateSearchIdx");
}

function buildDictionaries(data) {
  const slugDictionary = new Map();
  const fileNameDictionary = new Map();
  // const fullText = [];

  data.forEach(
    ({
      fileName,
      stage,
      isPrivate = false,
      slug,
      content,
      excerpt,
      ...rest
    }) => {
      slugDictionary.set(slug, { fileName, stage, slug, isPrivate, excerpt });
      fileNameDictionary.set(fileName, {
        fileName,
        stage,
        slug,
        isPrivate,
        excerpt,
      });
      // fullText.push({
      //   fileName,
      //   stage,
      //   slug,
      //   isPrivate,
      //   content,
      //   ...rest,
      // });
    }
  );

  writeToDisk([...slugDictionary.entries()], "slugDictionary");
  writeToDisk([...fileNameDictionary.entries()], "fileNameDictionary");
  // writeToDisk(fullText, "fullText");
}

function builder() {
  const dir = fs.readdirSync(NOTES_PATH);
  const files = dir.filter((fileName) => fileFilter(NOTES_PATH, fileName));
  const extracted = files.map(extractFrontmatter);

  buildDictionaries(extracted);
  buildSearchIndex(extracted);
}

builder();
