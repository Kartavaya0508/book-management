import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0_9LTSkyf005TGSVbfve4nnr29SAxtyE",
  authDomain: "library-system-147d0.firebaseapp.com",
  projectId: "library-system-147d0",
  storageBucket: "library-system-147d0.appspot.com",
  messagingSenderId: "458789559371",
  appId: "1:458789559371:web:afdbb00fcda98c4b3e41ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
