import { ExpandedNote } from "../types/post";

const fs = require("fs");
const path = require("path");
const lunr = require("lunr");
const { extractNoteData } = require("../utils/extractNoteData");

const NOTES_PATH = path.join(process.cwd(), "content/notes");

const fileFilter = (parentDir: string, fileName: string): boolean => {
  const fullPath = path.join(parentDir, fileName);
  return fs.statSync(fullPath).isFile();
};

function writeToDisk(data: any, fileName: string) {
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

// function buildSearchIndex(data: ExpandedNote[]) {
function buildSearchIndex(data: any[]) {
  const _searchFields = [
    "fileName",
    "title",
    "slug",
    "tags",
    "category",
    "stage",
    "content",
  ];

  function standardLunrBuilder() {
    const builder = new lunr.Builder();
    builder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);
    builder.searchPipeline.add(lunr.stemmer);
    return builder;
  }

  const configFn = (indexPrivate = false) => {
    const builder = standardLunrBuilder();
    builder.ref("slug");
    _searchFields.forEach((f) => builder.field(f));
    data.forEach(
      (entry) => (indexPrivate ? true : !entry.isPrivate) && builder.add(entry)
    );
    return builder.build();
  };

  const privateSearchIdx = configFn(true);
  const publicSearchIdx = configFn();

  writeToDisk(publicSearchIdx, "publicSearchIdx");
  writeToDisk(privateSearchIdx, "privateSearchIdx");
}

function buildDictionaries(data: ExpandedNote[]) {
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
  const files: string[] = dir.filter((fileName: string) =>
    fileFilter(NOTES_PATH, fileName)
  );
  const extracted: ExpandedNote[] = files.map((f) => extractNoteData(f, true));

  buildDictionaries(extracted);
  buildSearchIndex(extracted);
}

builder();

// export {};
