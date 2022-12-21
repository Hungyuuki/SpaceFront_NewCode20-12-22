"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
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
const firebaseApp = (0, app_1.initializeApp)(config);
const auth = (0, auth_1.getAuth)();
exports.authenticate = (email, password) => (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
//# sourceMappingURL=firestore.js.map