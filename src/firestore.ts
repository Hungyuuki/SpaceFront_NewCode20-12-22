import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// import { getFirestore } from "firebase/firestore";

require('dotenv').config();

const config = {
  apiKey: "AIzaSyAneplPWcNnC9JN4HQJ-oWoLG9AOdnXPl0",
  authDomain: "space202210.firebaseapp.com",
  databaseURL: "",
  projectId: "space202210",
  storageBucket: "space202210.appspot.com",
  messagingSenderId: "822783775338",
  appId: "1:822783775338:web:88a54940c8d8fe50147013",
  measurementId: ""
};

const firebaseApp = initializeApp(config);

const auth = getAuth();

exports.authenticate = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

