// pages/api/logout.ts

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../utils/withSession";

export default withIronSessionApiRoute(function logoutRoute(req, res, session) {
  req.session.destroy();
  res.send({ ok: true });
}, sessionOptions);
