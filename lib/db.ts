// import * as admin from "firebase-admin";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// const firebaseConnection = process.env.FIREBASE_CONNECTION;
// if (!firebaseConnection) {
//   throw new Error("FIREBASE_CONNECTION environment variable is not set");
// }
// const serviceAccount = JSON.parse(firebaseConnection);

// if (admin.apps.length == 0) {
//   console.log("adminApp:", admin.app.length);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }
// // const app = initializeApp(firebaseConfig);
// const rtdb = admin.database();
// const fsdb = getFirestore(admin);
// export { rtdb, fsdb };

const firebaseConfig = {
  apikey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const fsdb = getFirestore(app);
export { rtdb, fsdb };
