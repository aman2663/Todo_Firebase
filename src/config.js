import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAzUEGqa7ILgZZCf7WclZ4bEuCQUwJFq74",
    authDomain: "authentication-b36fa.firebaseapp.com",
    projectId: "authentication-b36fa",
    storageBucket: "authentication-b36fa.appspot.com",
    messagingSenderId: "470775831662",
    appId: "1:470775831662:web:8a32677668153be3391a7f",
    measurementId: "G-S402NCBJ8J"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth=getAuth(app);