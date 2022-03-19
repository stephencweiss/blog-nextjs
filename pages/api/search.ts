import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { withIronSessionApiRoute } from "iron-session/next";
import dictionary from "../../public/resources/slugDictionary.json";
import { sessionOptions } from "../../utils/withSession";
import { rebuildDictionary } from "../../utils/rebuildDictionary";
import { searchBuilder } from "./searchBuilder";
const slugDictionary = rebuildDictionary(dictionary);

const readPublicResource = (fileName: string) =>
  fs.readFileSync(path.join(process.cwd(), "public/resources", fileName), {
    encoding: "utf8",
  });

const allData = JSON.parse(readPublicResource("allData.json"));
const search = searchBuilder(allData, slugDictionary);

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

    const searchResults = search(qs, req.session?.user?.admin);
    res.json(searchResults);
  } catch (e) {
    res.status(500);
    res.end();
  }
}

export default withIronSessionApiRoute(searchHandler, sessionOptions);
