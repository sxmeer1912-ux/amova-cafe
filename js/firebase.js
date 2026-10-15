import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const firebaseConfig = {

    apiKey: "AIzaSyAtMGERvkvZZUpDlEIOadLKcH9neyikJKg",

    authDomain: "amova-cafe.firebaseapp.com",

    projectId: "amova-cafe",

    storageBucket: "amova-cafe.firebasestorage.app",

    messagingSenderId: "1054444427033",

    appId: "1:1054444427033:web:b6a93c8aa5d3bf56661788"

};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const auth = getAuth(app);


export {
    db,
    auth
};