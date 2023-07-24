import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCksKHX2rX3Zb6FbSitci9hOzKgZQk9ROk",
  authDomain: "subcriber-nft.firebaseapp.com",
  projectId: "subcriber-nft",
  storageBucket: "subcriber-nft.appspot.com",
  messagingSenderId: "191734285808",
  appId: "1:191734285808:web:c2363d805ac090919e8935",
  measurementId: "G-7T38JRDL40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();
export const auth = getAuth();

export const db = getFirestore(app);
export const storage = getStorage(app);