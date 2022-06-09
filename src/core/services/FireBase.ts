// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export type UserType = User | null;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXBCMsayXV1fB3d3dlQRSZh7BoKG9_diE",
  authDomain: "voteservice-b6168.firebaseapp.com",
  projectId: "voteservice-b6168",
  storageBucket: "voteservice-b6168.appspot.com",
  messagingSenderId: "111840206951",
  appId: "1:111840206951:web:83cd1eb5908a1c9a13f4c2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const fbAuth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const DB = getFirestore(app);
