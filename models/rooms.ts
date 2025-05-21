import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Query,
} from "firebase/firestore";
import { fsdb, rtdb } from "../lib/db";
import { getDocs, getDoc, where, query, setDoc } from "firebase/firestore";
import { randomUUID } from "crypto";
import { ref, set } from "firebase/database";
const roomsRef = collection(fsdb, "rooms");
const usersRef = collection(fsdb, "users");
const roomShortId = 1000 + Math.floor(Math.random() * 999);
const createDocRoomsRef = doc(fsdb, "rooms/" + roomShortId.toString());
export class Room {
  ref: DocumentReference;
  data!: { email: string; name: string } | null;
  id: string;
  constructor(id: string) {
    this.id = id;
    this.ref = doc(roomsRef, id);
  }
  static async findRoom(userId: string) {
    const qOwner = await query(roomsRef, where("owner", "==", userId));
    const qUserId = await query(roomsRef, where("userId", "==", userId));
    const qGuest = await query(roomsRef, where("guest", "==", userId));
    const qGuest2 = await query(roomsRef, where("guestUserId", "==", userId));
    const list: { id: string; [key: string]: unknown }[] = [];
    const res = async (q: Query<unknown, DocumentData>) => {
      const searchRes = await getDocs(q);
      await searchRes.docs.map((doc) => {
        const data = doc.data();
        if (typeof data === "object" && data !== null) {
          return list.push({
            ...data,
            id: doc.id,
          });
        } else {
          return list.push({
            id: doc.id,
          });
        }
      });
    };
    await res(qOwner);
    await res(qUserId);
    await res(qGuest);
    await res(qGuest2);
    return list;
  }
  static async getRoomById({
    userId,
    roomId,
    guestName,
  }: {
    userId: string;
    roomId: string;
    guestName: string;
  }) {
    const roomRef = doc(roomsRef, roomId);
    const roomSnap = await getDoc(roomRef);
    const dataRes = roomSnap.data();
    if (roomSnap.exists()) {
      if (dataRes?.guestName === null) {
        console.log("guestName is null");
        await setDoc(roomRef, {
          ...dataRes,
          updatedAt: new Date().toISOString(),
          guestName: guestName,
          guestUserId: userId,
        });
        const roomSnap2 = await getDoc(roomRef);
        const dataRes2 = roomSnap2.data();
        return dataRes2;
      } else {
        console.log("guestName is not null");
        const roomSnap2 = await getDoc(roomRef);
        const dataRes2 = roomSnap2.data();
        return dataRes2;
      }
    } else {
      throw new Error("Room not found");
    }
  }
  static async createNewRoom({
    userId,
    userName,
  }: {
    userId: string;
    userName: string;
  }) {
    try {
      const userDoc = await getDoc(doc(usersRef, userId));
      if (userDoc.exists()) {
        console.log("userId:", userId);
        const rtdbRoomsRef = ref(rtdb, "rooms/" + randomUUID());
        await set(rtdbRoomsRef, {
          messages: [],
          owner: userId,
          ownerName: userName,
          guest: "",
          guestInfo: {
            guestName: "none",
            guestUserId: "none",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        const roomLongId = rtdbRoomsRef.key;
        await setDoc(createDocRoomsRef, {
          rtdbRoomId: roomLongId,
          owner: userId,
          ownerName: userName,
          guest: "",
          guestUserId: "",
          createdAt: new Date().toISOString(),
        });
        return {
          id: roomShortId.toString(),
          rtdbRoomId: roomLongId,
          owner: userId,
        };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error creating new room:", error);
      throw error;
    }
  }
}
