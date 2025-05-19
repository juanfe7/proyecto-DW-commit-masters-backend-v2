const admin = require('firebase-admin');// Permite la inicialización de Firebase Admin SDK

//variables de entorno
// Se utilizan para almacenar información sensible y de configuración
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Inicializa la aplicación de Firebase Admin con las credenciales del servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Inicializa Firestore
const db = admin.firestore();
module.exports = { db };
