import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import lunr from "lunr";
import fs from "fs";
import path from "path";
import { sessionOptions } from "../../utils/withSession";
import dictionary from "../../public/resources/slugDictionary.json";
import { rebuildDictionary } from "../../utils/rebuildDictionary";

const slugDictionary = rebuildDictionary(dictionary);

const publicData = fs.readFileSync(
  path.join(process.cwd(), "public/resources", "publicSearchIdx.json"),
  { encoding: "utf8" }
);
const privateData = fs.readFileSync(
  path.join(process.cwd(), "public/resources", "privateSearchIdx.json"),
  { encoding: "utf8" }
);
var publicIdx = lunr.Index.load(JSON.parse(publicData));
var privateIdx = lunr.Index.load(JSON.parse(privateData));

export default withIronSessionApiRoute(searchHandler, sessionOptions);

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
    let searchResults;
    if (req.session?.user) {
      searchResults = privateIdx.search(qs);
    } else {
      searchResults = publicIdx.search(qs);
    }

    const results = searchResults.map((res) => slugDictionary.get(res.ref));

    res.json(results);
  } catch (e) {
    res.status(500);
    res.end();
  }
}
