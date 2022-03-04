import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ results: [] }));
  } catch (e) {
    res.status(500);
    res.end();
  }
}
