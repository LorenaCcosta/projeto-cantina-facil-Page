// web/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMFaLECd-F66HLznFwXC5xXytvLn_9Sxk",
  authDomain: "cantina-facil-app.firebaseapp.com",
  projectId: "cantina-facil-app",
  storageBucket: "cantina-facil-app.firebasestorage.app",
  messagingSenderId: "322044509416",
  appId: "1:322044509416:web:c9227385163b96cf281d5d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
