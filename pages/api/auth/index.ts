import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/../lib/corsMiddleware";
import { findOrCreateUser } from "controllers/auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);
  if (req.method === "POST") {
    const { email, name } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email wasn't found" });
    }
    // if (!name) {
    //   res.status(400).json({ message: "Name wasn't found" });
    // }
    const userRes = await findOrCreateUser(email, name);
    res.send(userRes);
  } else {
    res.status(405).send({ message: "Method Not Allowed" });
  }
}
