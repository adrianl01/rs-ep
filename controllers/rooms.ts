import { Room } from "models/rooms";

export async function findRooms(userId: string) {
  const res = Room.findRoom(userId);
  return res;
}

export async function newRoomCont(userId: string, userName: string) {
  const res = await Room.createNewRoom(userId, userName);
  return res;
}
export async function joinRoomCont(
  userId: string,
  roomId: string,
  guestName: string
) {
  const roomRef = await Room.getRoomById(roomId, userId, guestName);
  return roomRef;
}
