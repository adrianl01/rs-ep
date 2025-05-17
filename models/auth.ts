import { collection, doc, DocumentReference } from "firebase/firestore";
import { fsdb } from "../lib/db";
import { addDoc } from "firebase/firestore";
import { getDocs, where, query } from "firebase/firestore";
const usersRef = collection(fsdb, "users");

export class User {
  ref: DocumentReference;
  data!: { email: string; name: string } | null;
  id: string;
  constructor(id: string) {
    this.id = id;
    this.ref = doc(usersRef, id);
  }

  static async findByEmailOrCreate(email: string, name: string) {
    const cleanEmail = email.trim().toLowerCase();
    const q = await query(usersRef, where("email", "==", cleanEmail));
    const searchRes = await getDocs(q);
    if (searchRes.empty) {
      if (!name) {
        throw new Error("Name is required to create a new user");
      }
      const newUserRef = await this.createNewUser({
        email: cleanEmail,
        name: name,
      });
      return {
        id: newUserRef.id,
        new: true,
      };
    } else {
      const userData = searchRes.docs[0].data();
      return {
        userId: searchRes.docs[0].id,
        userData: userData,
      };
    }
  }
  static async createNewUser(data: { email: string; name: string }) {
    const newUserSnap = await addDoc(usersRef, data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
}
