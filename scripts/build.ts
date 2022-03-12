const fs = require("fs");
const path = require("path");
const lunr = require("lunr");
const { extractNoteData } = require("../utils/extractNoteData");
import {
  CollectionEntry,
  CommonDictionaryEntry,
  ExpandedNote,
  VisibilityCount,
} from "../types/index";
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

function buildSearchIndex(data: ExpandedNote[]) {
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

function addUpdateEntry<T extends string>(
  collection: T[],
  baseEntry: CommonDictionaryEntry,
  basicDictionary: Map<string, CollectionEntry<T>[]>,
  visibilityDictionary: Map<string, VisibilityCount>
) {
  collection.map((entry) => {
    const curVal: CollectionEntry<T> = {
      ...baseEntry,
      collection,
    };

    const newVal = [...(basicDictionary.get(entry) ?? []), curVal];

    basicDictionary.set(entry, newVal);

    const curEntry: VisibilityCount = visibilityDictionary.get(entry) ?? {
      totalCount: 0,
      publicCount: 0,
    };
    curEntry.totalCount += 1;
    if (!baseEntry.isPrivate) curEntry.publicCount += 1;
    visibilityDictionary.set(entry, curEntry);
  });
}

function buildDictionaries(data: ExpandedNote[]) {
  const slugDictionary = new Map<string, CommonDictionaryEntry>();
  const fileNameDictionary = new Map<string, CommonDictionaryEntry>();

  const tagDictionary = new Map<string, CollectionEntry<string>[]>();
  const tagVisiblityDictionary = new Map<string, VisibilityCount>();
  const categoryDictionary = new Map<string, CollectionEntry<string>[]>();
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
        addUpdateEntry(tags, baseEntry, tagDictionary, tagVisiblityDictionary);
      }
      if (category?.length) {
        addUpdateEntry(
          category,
          baseEntry,
          categoryDictionary,
          categoryVisbilityDictionary
        );
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
