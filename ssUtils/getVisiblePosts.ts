import fs from "fs/promises";
import {
  Dictionary,
  DictionaryStyle,
  isDictionary,
  reconstituteDictionary,
} from "../utils/rebuildDictionary";
import { User } from "../types/index";
import { NOTES_PATH } from "../constants";
import { filterAsync } from "../utils/asyncArrayFunctions";
import { fileFilter } from "./fileFilter";
import { canViewPrivateNotes } from "../utils/userPermissionFunctions";

export const allNotes = async () => {
  const dir = await fs.readdir(NOTES_PATH);
  return await filterAsync(dir, (fileName) => fileFilter(NOTES_PATH, fileName));
};

export async function getVisiblePosts(
  dictionary: any,
  style: DictionaryStyle,
  user?: User
) {
  function filterPrivate(files: string[], dictionary: Dictionary) {
    return files.filter(
      (file) =>
        dictionary.data.has(file) && !dictionary.data.get(file)?.isPrivate
    );
  }

  function filterPublished(files: string[], dictionary: Dictionary) {
    return files.filter(
      (file) =>
        dictionary.data.has(file) &&
        (dictionary.data.get(file)?.stage ?? "").toLowerCase() === "published"
    );
  }

  const filteredFiles = await allNotes();
  const dict = reconstituteDictionary(dictionary, style);
  if (!isDictionary(dict)) throw new Error("Check Dictionary reference");

  const visiblePosts = filterPublished(
    canViewPrivateNotes(user)
      ? filteredFiles
      : filterPrivate(filteredFiles, dict),
    dict
  );
  return visiblePosts;
}
