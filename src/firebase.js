// firebaseConfig.js
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   twitterApiKey: process.env.REACT_APP_TWITTER_API_KEY,
//   twitterApiSecretKey: process.env.REACT_APP_TWITTER_API_SECRET_KEY,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCSCXPL7SHsZWVfpQPZKzllktmy87YqMSs",
  authDomain: "worldwideadverts-1564913666580.firebaseapp.com",
  projectId: "worldwideadverts-1564913666580",
  storageBucket: "worldwideadverts-1564913666580.appspot.com",
  messagingSenderId: "186985254845",
  appId: "1:186985254845:web:63b25c669ab142cd72ccd4",
  measurementId: "G-M920EKEN3F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export const auth = firebase.auth();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();
// export const facebookProvider = new firebase.auth.FacebookAuthProvider();
// export const twitterProvider = new firebase.auth.TwitterAuthProvider();
