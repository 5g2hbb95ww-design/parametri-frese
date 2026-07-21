// firebase-config.js

// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Import Firestore
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configurazione Firebase del tuo progetto
const firebaseConfig = {
  apiKey: "AIzaSyAZ6lMMVoqzvtREmDW1Ixn0_7qu4QRsvOU",
  authDomain: "programmazione-3754c.firebaseapp.com",
  projectId: "programmazione-3754c",
  storageBucket: "programmazione-3754c.firebasestorage.app",
  messagingSenderId: "964219306630",
  appId: "1:964219306630:web:0ef66620b036a6ef920707",
  measurementId: "G-8B6Z8WRX0M"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firestore
const db = getFirestore(app);

// Utente fisso (per ora)
const CURRENT_USER = "antonio";

// Esporta tutto per app.js
export {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  CURRENT_USER
};
