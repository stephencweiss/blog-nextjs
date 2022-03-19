import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../utils/withSession";
import { searchBuilder } from "./searchBuilder";

const search = searchBuilder();

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
