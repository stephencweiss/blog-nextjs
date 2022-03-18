import { NextApiRequest, NextApiResponse } from "next";

import { Document } from "flexsearch";
import fs from "fs";
import path from "path";
import { withIronSessionApiRoute } from "iron-session/next";
import dictionary from "../../public/resources/slugDictionary.json";
import { sessionOptions } from "../../utils/withSession";
import { rebuildDictionary } from "../../utils/rebuildDictionary";
import { FLEX_SEARCH_OPTIONS } from "../../constants";
const slugDictionary = rebuildDictionary(dictionary);

const readPublicResource = (fileName: string) =>
  fs.readFileSync(path.join(process.cwd(), "public/resources", fileName), {
    encoding: "utf8",
  });

const publicKeys = JSON.parse(readPublicResource("publicFlexSearchKeys.json"));
const privateKeys = JSON.parse(
  readPublicResource("privateFlexSearchKeys.json")
);

const publicIdx = new Document(FLEX_SEARCH_OPTIONS);
const privateIdx = new Document(FLEX_SEARCH_OPTIONS);
publicKeys.forEach((key: string) => {
  const data = JSON.parse(readPublicResource(`publicflex/${key}.json`));
  publicIdx.import(key, data);
});
privateKeys.forEach((key: string) => {
  const data = JSON.parse(readPublicResource(`privateflex/${key}.json`));
  privateIdx.import(key, data);
});

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
    const searchResults = searchIdx.search(qs);
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
