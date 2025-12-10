import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

// Initiera Firebase
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

const db = admin.firestore();

export const handler = async (event) => {
  // Steg 1: Verifiera JWT-token för att skydda funktionen
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Authorization header saknas eller är ogiltig.' }) };
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return { statusCode: 403, body: JSON.stringify({ message: 'Ogiltig eller utgången token.' }) };
  }

  // Steg 2: Hämta ärenden från Firestore
  try {
    const statusParam = event.queryStringParameters.status || 'active'; 

    const repairsRef = db.collection('Reparationer');
    let query;

    // *** NY LOGIK: Hämta alla som INTE är aktiva ***
    if (statusParam === 'finished') {
        query = repairsRef
            .where('status', 'in', ['completed', 'archived'])
            .orderBy('created_at', 'desc');
    } else {
        // Gamla logiken för aktiva
        query = repairsRef
            .where('status', '==', 'active')
            .orderBy('created_at', 'desc');
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return { statusCode: 200, body: JSON.stringify([]) }; // Returnera en tom lista
    }

    const repairs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { statusCode: 200, body: JSON.stringify(repairs) };

  } catch (error) {
    console.error('Error fetching repairs:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte hämta reparationsärenden.' }) };
  }
};