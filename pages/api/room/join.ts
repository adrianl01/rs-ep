import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/../lib/corsMiddleware";
import { joinRoomCont } from "controllers/rooms";

export default async function joinRoom(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res);
  if (req.method === "POST") {
    const { userId, roomId, guestName } = req.body;
    if (!userId) {
      res.status(400).json({ message: "UserId wasn't found" });
    }
    const userRes = await joinRoomCont({ userId, roomId, guestName });
    res.send(userRes);
  } else {
    res.send({ message: "Method Not Allowed" });
  }
}
