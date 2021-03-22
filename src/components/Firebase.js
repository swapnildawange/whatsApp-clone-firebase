import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDQPbcIgM2NuzyP1CvpHR9iHB92hEKVWt4",
  authDomain: "whatssapp-clone-876bd.firebaseapp.com",
  projectId: "whatssapp-clone-876bd",
  storageBucket: "whatssapp-clone-876bd.appspot.com",
  messagingSenderId: "783660799217",
  appId: "1:783660799217:web:2f50991e0614ab28e50550"
};

const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider };
export default db;
