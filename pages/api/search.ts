import { NextApiRequest, NextApiResponse } from "next";
import lunr from "lunr";
import { Document, SimpleDocumentSearchResultSetUnit } from "flexsearch";
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
const flexKeys = JSON.parse(readPublicResource("flexSearchKeys.json"));

var publicIdx = lunr.Index.load(publicData);
var privateIdx = lunr.Index.load(privateData);
const _searchFields = [
  "fileName",
  "title",
  "slug",
  "tags",
  "category",
  "stage",
  "content",
];
const options = { document: { id: "id", index: _searchFields } };
const publicFlexIdx = new Document(options);
flexKeys.forEach((key: string) => {
  const data = JSON.parse(readPublicResource(`flex/${key}.json`));
  publicFlexIdx.import(key, data);
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
    const searchResults = publicFlexIdx.search(qs);

    const consolidated = [
      ...new Set(searchResults.map((res) => res.result).flat()),
    ].map((slug) => slugDictionary.get(slug));
    console.log(JSON.stringify({ consolidated }, null, 4));

    res.json(consolidated);
  } catch (e) {
    res.status(500);
    res.end();
  }
}

export default withIronSessionApiRoute(searchHandler, sessionOptions);
