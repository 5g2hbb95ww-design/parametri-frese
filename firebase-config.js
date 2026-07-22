// Firebase v8 – Configurazione corretta

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
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();

// Utente corrente
const CURRENT_USER = "antonio";
