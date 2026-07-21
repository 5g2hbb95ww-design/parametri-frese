// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️ Incolla qui i dati del tuo progetto Firebase
const firebaseConfig = {
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAZ6lMMVoqzvtREmDW1Ixn0_7qu4QRsvOU",
    authDomain: "programmazione-3754c.firebaseapp.com",
    projectId: "programmazione-3754c",
    storageBucket: "programmazione-3754c.firebasestorage.app",
    messagingSenderId: "964219306630",
    appId: "1:964219306630:web:0ef66620b036a6ef920707",
    measurementId: "G-8B6Z8WRX0M"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utente fisso (per ora)
const CURRENT_USER = "antonio";

export { db, collection, addDoc, getDocs, query, where, updateDoc, doc, CURRENT_USER };
