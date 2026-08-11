// ========================================
// FIREBASE CONFIG
// ========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ========================================
// CONFIGURAÇÃO DO SEU PROJETO
// ========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAHG7rVYx-ac1vJcWI5wwvfW7RVoMJKl2w",

    authDomain:
        "ueg-hub.firebaseapp.com",

    projectId:
        "ueg-hub",

    storageBucket:
        "ueg-hub.firebasestorage.app",

    messagingSenderId:
        "976829125072",

    appId:
        "1:976829125072:web:d942ba3ddd23a39bf069d5",

    measurementId:
        "G-9N7NJ4JQ08"

};


// ========================================
// INICIALIZAR FIREBASE
// ========================================

const app =
    initializeApp(firebaseConfig);


// ========================================
// AUTHENTICATION
// ========================================

const auth =
    getAuth(app);


// ========================================
// FIRESTORE
// ========================================

const db =
    getFirestore(app);


// ========================================
// EXPORTAR
// ========================================

export {
    app,
    auth,
    db
};