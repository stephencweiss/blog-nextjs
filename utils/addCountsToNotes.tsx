import {
  CollectionEntry,
  CollectionEntryWithCounts,
  ExpandedNote,
  ExpandedNoteWithCounts,
  KeyCounts,
  User,
} from "../types/index";
import { canViewPrivateNotes } from "utils/userPermissionFunctions";
import { cCount, tCount } from "../pages/blog/index";
import { DictionaryStyle } from "./rebuildDictionary";

export function addCountsToNotes(
  note: ExpandedNote,
  user?: User
): ExpandedNoteWithCounts {
  const canViewPrivate = canViewPrivateNotes(user);
  const categoryCounts: KeyCounts[] = [];
  const tagCounts: KeyCounts[] = [];

  note.category?.forEach((c) => {
    const count =
      (canViewPrivate
        ? cCount.get(c)?.totalCount
        : cCount.get(c)?.publicCount) ?? 0;
    return categoryCounts.push({
      key: c,
      count,
    });
  });
  categoryCounts.filter((c) => c.count);

  note.tags?.forEach((t) => {
    const count =
      (canViewPrivate
        ? tCount.get(t)?.totalCount
        : tCount.get(t)?.publicCount) ?? 0;

    return tagCounts.push({
      key: t,
      count,
    });
  });
  tagCounts.filter((t) => t.count);

  return { ...note, categoryCounts, tagCounts };
}

function getCountRef(style: DictionaryStyle) {
  switch (style) {
    case "category":
      return cCount;
    case "tags":
      return tCount;
    default:
      throw new Error("Unexpected Style");
  }
}

export function addCountsToCollection(
  entry: CollectionEntry<string>,
  style: DictionaryStyle,
  user?: User
): CollectionEntryWithCounts<string> {
  const canViewPrivate = canViewPrivateNotes(user);
  const collectionCounts: KeyCounts[] = [];

  const countRef = getCountRef(style);

  entry.collection?.forEach((c) => {
    const count =
      (canViewPrivate
        ? countRef.get(c)?.totalCount
        : countRef.get(c)?.publicCount) ?? 0;
    return collectionCounts.push({
      key: c,
      count,
    });
  });

  collectionCounts.filter((c) => c.count);

  return { ...entry, collectionCounts };
}
