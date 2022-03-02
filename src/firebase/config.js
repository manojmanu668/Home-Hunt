import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWzsnxFoZRH7jQmlxQ_uudrWDUuIQmLhA",
  authDomain: "home-hunt-3dbe5.firebaseapp.com",
  projectId: "home-hunt-3dbe5",
  storageBucket: "home-hunt-3dbe5.appspot.com",
  messagingSenderId: "249866524830",
  appId: "1:249866524830:web:a50b2d2c033f5e1886838f"
};
  
//init firebase
initializeApp(firebaseConfig)

//init firestore
const db = getFirestore()

//init auth
const auth = getAuth()

const storage = getStorage()

export { db, auth, storage }

