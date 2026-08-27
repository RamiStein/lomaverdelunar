const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let db = null;
let isInitialized = false;

function initFirebase() {
  if (isInitialized && db) return db;

  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      db = getFirestore();
      isInitialized = true;
      return db;
    }

    // 1. Verificar si ya hay credenciales en JSON stringificado (ideal para Vercel / variables de entorno)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      let rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      let serviceAccount = null;
      try {
        serviceAccount = JSON.parse(rawKey);
      } catch {
        try {
          const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
          serviceAccount = JSON.parse(decoded);
        } catch {
          // Si tiene comillas envolventes
          if ((rawKey.startsWith("'") && rawKey.endsWith("'")) || (rawKey.startsWith('"') && rawKey.endsWith('"'))) {
            rawKey = rawKey.slice(1, -1);
            serviceAccount = JSON.parse(rawKey);
          }
        }
      }

      if (serviceAccount && serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        initializeApp({
          credential: cert(serviceAccount)
        });
        db = getFirestore();
        isInitialized = true;
        console.log('🔥 [Firebase] Conectado exitosamente vía FIREBASE_SERVICE_ACCOUNT_KEY.');
        return db;
      }
    }

    // 2. Verificar variables individuales (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      db = getFirestore();
      isInitialized = true;
      console.log(`🔥 [Firebase] Conectado exitosamente al proyecto: ${process.env.FIREBASE_PROJECT_ID}`);
      return db;
    }

    // 3. Verificar archivo local serviceAccountKey.json
    const possiblePaths = [
      path.join(__dirname, 'data', 'serviceAccountKey.json'),
      path.join(__dirname, 'serviceAccountKey.json'),
      path.join(process.cwd(), 'serviceAccountKey.json'),
      process.env.GOOGLE_APPLICATION_CREDENTIALS
    ].filter(Boolean);

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const serviceAccount = require(filePath);
        initializeApp({
          credential: cert(serviceAccount)
        });
        db = getFirestore();
        isInitialized = true;
        console.log(`🔥 [Firebase] Conectado exitosamente usando archivo: ${filePath}`);
        return db;
      }
    }

    console.warn('⚠️ [Firebase] No se encontraron credenciales de Firebase. Operando en modo local (db.json).');
  } catch (error) {
    console.error('❌ [Firebase] Error inicializando Firebase Admin SDK:', error.message);
  }

  return null;
}

// Inicializar al cargar el módulo
initFirebase();

module.exports = {
  getDb: () => db,
  isFirebaseEnabled: () => isInitialized && db !== null,
  initFirebase
};
