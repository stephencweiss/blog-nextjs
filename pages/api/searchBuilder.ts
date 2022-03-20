import { Document } from "flexsearch";
import { FLEX_SEARCH_OPTIONS } from "../../constants";
import { ExpandedNote } from "types/index";
import slugDictionary from "../../public/resources/slugDictionary.json";
import { readPublicResource } from "../../utils/serverUtils";
import { removeUndefined, rebuildDictionary } from "utils";

const dictionary: Map<any, ExpandedNote> = rebuildDictionary(slugDictionary);
const data = JSON.parse(readPublicResource("allData.json"));

export function searchBuilder() {
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

  return function search(
    query: string,
    isAdmin = false,
    indices?: ("tags" | "category")[]
  ): ExpandedNote[] {
    const searchIdx = isAdmin ? privateIdx : publicIdx;

    if (!searchIdx) return [];
    const searchResults =
      searchIdx?.search({
        query,
        index: indices,
        limit: 100,
        suggest: true,
      }) ?? [];

    const consolidated = [
      ...new Set(searchResults.map((res) => res.result).flat()),
    ]
      .map((slug) => dictionary.get(slug))
      .filter(removeUndefined);

    return consolidated;
  };
}
