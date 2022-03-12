import { CommonDictionaryEntry, ExpandedNote } from "../types/index";

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

type VisibilityCount = {
  totalCount: number;
  publicCount: number;
};

type TagDictionaryEntry = (CommonDictionaryEntry & { tags: string[] })[];
type CategoryDictionaryEntry = (CommonDictionaryEntry & {
  category: string[];
})[];

function buildDictionaries(data: ExpandedNote[]) {
  const slugDictionary = new Map<string, CommonDictionaryEntry>();
  const fileNameDictionary = new Map<string, CommonDictionaryEntry>();

  const tagDictionary = new Map<string, TagDictionaryEntry[]>();
  const tagVisiblityDictionary = new Map<string, VisibilityCount>();
  const categoryDictionary = new Map<string, CategoryDictionaryEntry[]>();
  const categoryVisbilityDictionary = new Map<string, VisibilityCount>();
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
      date,
      ...rest
    }) => {
      const baseEntry: CommonDictionaryEntry = {
        date,
        fileName,
        stage,
        slug,
        isPrivate,
        title,
        excerpt,
      };

      slugDictionary.set(slug, baseEntry);
      fileNameDictionary.set(fileName, baseEntry);

      if (tags?.length) {
        tags.map((tag) => {
          // tagDictionary
          const curVal = {
            ...baseEntry,
            tags,
          } as unknown as TagDictionaryEntry;

          const newVal = [...(tagDictionary.get(tag) ?? []), curVal];

          tagDictionary.set(tag, newVal);

          const curEntry: VisibilityCount = tagVisiblityDictionary.get(tag) ?? {
            totalCount: 0,
            publicCount: 0,
          };
          curEntry.totalCount += 1;
          if (!baseEntry.isPrivate) curEntry.publicCount += 1;
          tagVisiblityDictionary.set(tag, curEntry);
        });
      }
      if (category?.length) {
        category.map((c) => {
          const curVal = {
            ...baseEntry,
            category,
          } as unknown as CategoryDictionaryEntry;

          const newVal: CategoryDictionaryEntry[] = [
            ...(categoryDictionary.get(c) ?? []),
            curVal,
          ];

          categoryDictionary.set(c, newVal);

          const curEntry: VisibilityCount = categoryVisbilityDictionary.get(
            c
          ) ?? {
            totalCount: 0,
            publicCount: 0,
          };
          curEntry.totalCount += 1;
          if (!baseEntry.isPrivate) curEntry.publicCount += 1;
          categoryVisbilityDictionary.set(c, curEntry);
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
  writeToDisk([...categoryDictionary.entries()], "categoryDictionary");
  writeToDisk(
    [...categoryVisbilityDictionary.entries()],
    "categorySearchDictionary"
  );
  writeToDisk([...tagDictionary.entries()], "tagDictionary");
  writeToDisk([...tagVisiblityDictionary.entries()], "tagSearchDictionary");
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
