// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh1QQ6tXK0nN_8PWij2sU-TMDEAXEdliI",
  authDomain: "taxi-management-system-55dd3.firebaseapp.com",
  databaseURL: "https://taxi-management-system-55dd3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taxi-management-system-55dd3",
  storageBucket: "taxi-management-system-55dd3.appspot.com",
  messagingSenderId: "21436343962",
  appId: "1:21436343962:web:6b19df0a78f9ebca376123",
  measurementId: "G-65GRV92XRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);