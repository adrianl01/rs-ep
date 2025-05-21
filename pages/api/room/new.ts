import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/../lib/corsMiddleware";
import { newRoomCont } from "controllers/rooms";

export default async function newRoom(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res);
  if (req.method === "POST") {
    const { userId, userName } = req.body;
    if (!userId || !userName) {
      res.status(400).json({ message: "User ID or User Name wasn't found" });
      return;
    }
    const userRes = await newRoomCont({ userId, userName });
    res.send(userRes);
  } else {
    res.send({ message: "Method Not Allowed" });
  }
}
