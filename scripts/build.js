const fs = require("fs");
const path = require("path");
const lunr = require("lunr");
const { extractFrontmatter } = require("../utils/extractFrontmatter2");

const NOTES_PATH = path.join(process.cwd(), "content/notes");

const fileFilter = (parentDir, fileName) => {
  const fullPath = path.join(parentDir, fileName);
  return fs.statSync(fullPath).isFile();
};

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
  const _searchFields = [
    "fileName",
    "title",
    "slug",
    "tags",
    "category",
    "stage",
    "content",
  ];
  const privateSearchIdx = lunr(function () {
    this.ref("slug");
    _searchFields.forEach((f) => this.field(f));
    data.forEach((entry) => this.add(entry));
  });

  const publicSearchIdx = lunr(function () {
    this.ref("slug");
    _searchFields.forEach((f) => this.field(f));
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
      title,
      ...rest
    }) => {
      slugDictionary.set(slug, {
        fileName,
        stage,
        slug,
        isPrivate,
        title,
        excerpt,
      });
      fileNameDictionary.set(fileName, {
        fileName,
        stage,
        slug,
        isPrivate,
        title,
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
