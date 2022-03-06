import { NextApiRequest, NextApiResponse } from "next";
import lunr from "lunr";
import fs from "fs";
import path from "path";
import { withIronSessionApiRoute } from "iron-session/next";
import dictionary from "../../public/resources/slugDictionary.json";
import { sessionOptions } from "../../utils/withSession";
import { rebuildDictionary } from "../../utils/rebuildDictionary";

const slugDictionary = rebuildDictionary(dictionary);

const readPublicResource = (fileName: string) =>
  fs.readFileSync(path.join(process.cwd(), "public/resources", fileName), {
    encoding: "utf8",
  });

const publicData = JSON.parse(readPublicResource("publicSearchIdx.json"));
const privateData = JSON.parse(readPublicResource("privateSearchIdx.json"));

var publicIdx = lunr.Index.load(publicData);
var privateIdx = lunr.Index.load(privateData);

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
    const searchResults = searchIdx
      .search(qs)
      .map((res) => slugDictionary.get(res.ref));

    res.json(searchResults);
  } catch (e) {
    res.status(500);
    res.end();
  }
}

export default withIronSessionApiRoute(searchHandler, sessionOptions);
