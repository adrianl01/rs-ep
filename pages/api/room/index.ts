import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/../lib/corsMiddleware";
import { findRooms } from "controllers/rooms";

export default async function room(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);
  if (req.method === "POST") {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ message: "Email wasn't found" });
    }

    const userRes = await findRooms(userId);
    res.send(userRes);
  } else {
    res.send({ message: "Method Not Allowed" });
  }
}
