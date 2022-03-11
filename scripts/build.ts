import { ExpandedNote } from "../types/note";

const fs = require("fs");
const path = require("path");
const lunr = require("lunr");
const { extractNoteData } = require("../utils/extractNoteData");
import { NOTES_PATH } from "../constants";

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
    "category",
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
  const tagDictionary = new Map();
  const categoryDictionary = new Map();
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
      tags,
      category,
      ...rest
    }) => {
      const baseEntry = { fileName, stage, slug, isPrivate, title, excerpt };

      slugDictionary.set(slug, baseEntry);
      fileNameDictionary.set(fileName, baseEntry);

      if (tags?.length) {
        tags.map((tag) => {
          tagDictionary.set(
            tag,
            tagDictionary.has(tag)
              ? [...tagDictionary.get(tag), { ...baseEntry, tags }]
              : [baseEntry]
          );
        });
      }
      if (category?.length) {
        category.map((c) => {
          categoryDictionary.set(
            c,
            categoryDictionary.has(c)
              ? [...categoryDictionary.get(c), { ...baseEntry, category }]
              : [baseEntry]
          );
        });
      }
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
  writeToDisk([...tagDictionary.entries()], "tagDictionary");
  writeToDisk([...categoryDictionary.entries()], "categoryDictionary");
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
