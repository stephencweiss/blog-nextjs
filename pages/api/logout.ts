// pages/api/logout.ts

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../utils/withSession";

export default withIronSessionApiRoute(function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  req.session.destroy();
  res.send({ ok: true });
},
sessionOptions);
