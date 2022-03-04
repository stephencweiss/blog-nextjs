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
  const fileData = fs.readFileSync(filePath(fileName), "utf-8");
  const {
    data: { private: privateKey, ...frontmatter },
    content,
  } = matter(fileData);

  const slug = createSlug(fileName, frontmatter);
  const isPublished = String(frontmatter?.stage)
    .toLowerCase()
    .includes("publish");

  return {
    ...frontmatter,
    content,
    slug,
    fileName,
    isPrivate: privateKey || frontmatter.archived || !isPublished,
  };
}

function createSlug(fileName, frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}

function buildDictionary(dictionary, dictionaryName) {
  const dirPath = path.join(process.cwd(), "dictionaries");
  try {
    fs.readdirSync(dirPath);
  } catch (e) {
    fs.mkdirSync(dirPath);
  }

  console.log(dictionaryName, Array.isArray(dictionary));

  const data = Array.isArray(dictionary)
    ? JSON.stringify(dictionary)
    : JSON.stringify([...dictionary.entries()]);

  fs.writeFileSync(`${dirPath}/${dictionaryName}.json`, data, {
    encoding: "utf-8",
  });
}

function buildDictionaries() {
  const slugDictionary = new Map();
  const fileNameDictionary = new Map();
  const searchDictionary = [];

  const dir = fs.readdirSync(NOTES_PATH);

  const files = dir.filter((fileName) => fileFilter(NOTES_PATH, fileName));
  const extracted = files.map(extractFrontmatter);
  extracted.forEach(
    ({ fileName, stage, isPrivate = false, slug, content, ...rest }) => {
      slugDictionary.set(slug, { fileName, stage, slug, isPrivate });
      fileNameDictionary.set(fileName, { fileName, stage, slug, isPrivate });
      searchDictionary.push({
        fileName,
        stage,
        slug,
        isPrivate,
        content,
        ...rest,
      });
    }
  );

  buildDictionary(slugDictionary, "slugDictionary");
  buildDictionary(fileNameDictionary, "fileNameDictionary");
  buildDictionary(searchDictionary, "searchDictionary");
}

buildDictionaries();
