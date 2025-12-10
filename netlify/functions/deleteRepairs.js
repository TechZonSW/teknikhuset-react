import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

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
    const authHeader = event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return { statusCode: 401, body: JSON.stringify({ message: 'Åtkomst nekad.' }) };
        }
        const token = authHeader.split(' ')[1];
        try {
          jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
          return { statusCode: 403, body: JSON.stringify({ message: 'Ogiltig token.' }) };
        }

    if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Endast POST är tillåtet.' }) };
    }

  try {
    const { repairIds } = JSON.parse(event.body); // Tar emot en lista med ID:n
    if (!repairIds || !Array.isArray(repairIds) || repairIds.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ message: 'En lista med Ärende-ID:n krävs.' }) };
    }

    const batch = db.batch();
    repairIds.forEach(id => {
      const docRef = db.collection('Reparationer').doc(id);
      batch.delete(docRef);
    });

    await batch.commit();

    return { statusCode: 200, body: JSON.stringify({ message: `${repairIds.length} ärende(n) har raderats.` }) };
  } catch (error) {
    console.error('Error deleting repairs:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte radera ärenden.' }) };
  }
};