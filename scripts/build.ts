import { ExpandedNote } from "../types/index";
import fs from "fs";
import path from "path";
import { extractNoteData } from "utils/serverUtils";
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
      tags,
      category,
      ...rest
    }) => {
      slugDictionary.set(slug, {
        fileName,
        stage,
        slug,
        isPrivate,
        title,
        excerpt,
        tags,
        category,
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
  writeToDisk(extracted, "allData");
  buildDictionaries(extracted);
}

builder();

// export {};
