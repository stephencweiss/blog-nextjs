// pages/api/login.ts

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../utils/withSession";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { password } = JSON.parse(req.body);

  if (password === process.env.SECRET_COOKIE_PASSWORD) {
    req.session.user = {
      id: 230,
      admin: true,
    };
    await req.session.save();
    res.status(200).send({ ok: true });
  }
  res.status(401).send({ ok: false });
}
