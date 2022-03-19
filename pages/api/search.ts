import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "flexsearch";
import fs from "fs";
import path from "path";
import { withIronSessionApiRoute } from "iron-session/next";
import dictionary from "../../public/resources/slugDictionary.json";
import { sessionOptions } from "../../utils/withSession";
import { rebuildDictionary } from "../../utils/rebuildDictionary";
import { FLEX_SEARCH_OPTIONS } from "../../constants";
import { ExpandedNote } from "types/post";
const slugDictionary = rebuildDictionary(dictionary);

const readPublicResource = (fileName: string) =>
  fs.readFileSync(path.join(process.cwd(), "public/resources", fileName), {
    encoding: "utf8",
  });

const allData = JSON.parse(readPublicResource("allData.json"));
const publicIdx = new Document(FLEX_SEARCH_OPTIONS);
const privateIdx = new Document(FLEX_SEARCH_OPTIONS);

function buildSearchIndexes(
  data: ExpandedNote[],
  idx: Document<unknown, false>,
  privateIdx = false
) {
  console.log(`building index`);
  data.forEach((entry) => {
    const { fileName, title, slug, tags, category, stage, content, isPrivate } =
      entry;
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

buildSearchIndexes(allData, publicIdx);
buildSearchIndexes(allData, privateIdx, true);

function searchHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const qs = req?.query?.query;
    if (Array.isArray(qs)) {
      res.status(400);
      res.send({ message: "Query should be strings only" });
      return;
    }
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    const searchIdx = req.session?.user?.admin ? privateIdx : publicIdx;

    const searchResults = searchIdx.search({
      query: qs,
      limit: 100,
      suggest: true,
      bool: "or",
    });

    const consolidated = [
      ...new Set(searchResults.map((res) => res.result).flat()),
    ].map((slug) => slugDictionary.get(slug));

    res.json(consolidated);
  } catch (e) {
    res.status(500);
    res.end();
  }
}

export default withIronSessionApiRoute(searchHandler, sessionOptions);
