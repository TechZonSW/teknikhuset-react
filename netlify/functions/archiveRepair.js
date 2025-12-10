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
    const { repairId } = JSON.parse(event.body);
    if (!repairId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Ärende-ID krävs.' }) };
    }

    const repairRef = db.collection('Reparationer').doc(repairId);
    await repairRef.update({
      status: 'archived',
    });

    return { statusCode: 200, body: JSON.stringify({ message: 'Ärendet har arkiverats.' }) };
  } catch (error) {
    console.error('Error archiving repair:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte arkivera ärendet.' }) };
  }
};