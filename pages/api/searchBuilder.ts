import { Document } from "flexsearch";
import { FLEX_SEARCH_OPTIONS } from "../../constants";
import { ExpandedNote } from "types/index";

export function searchBuilder(data: any) {
  function _buildSearchIndexes(
    data: ExpandedNote[],
    idx: Document<unknown, false>,
    privateIdx = false
  ) {
    data.forEach((entry) => {
      const {
        fileName,
        title,
        slug,
        tags,
        category,
        stage,
        content,
        isPrivate,
      } = entry;
      // These keys match the FLEX_SEARCH_OPTIONS
      const item = {
        id: slug,
        fileName,
        title,
        slug,
        tag: tags,
        tags,
        category,
        stage,
        content,
      };

      if (privateIdx) {
        isPrivate && idx.add(item);
      }
      idx.add(item);
    });
  }
  const publicIdx = new Document(FLEX_SEARCH_OPTIONS);
  const privateIdx = new Document(FLEX_SEARCH_OPTIONS);
  _buildSearchIndexes(data, publicIdx);
  _buildSearchIndexes(data, privateIdx, true);

  return function search(query: string, isAdmin = false) {
    const searchIdx = isAdmin ? privateIdx : publicIdx;

    if (!searchIdx) return [];
    return searchIdx.search({
      query,
      limit: 100,
      suggest: true,
      bool: "or",
    });
  };
}
