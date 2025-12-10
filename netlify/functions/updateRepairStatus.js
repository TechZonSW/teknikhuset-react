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
  // Skydda funktionen med JWT
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
    const { repairId, newStatus, isFinalizing } = JSON.parse(event.body);

    if (!repairId || !newStatus) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Ärende-ID och ny status krävs.' }) };
    }

    const repairRef = db.collection('Reparationer').doc(repairId);
    
    const newStatusEntry = {
      status: newStatus,
      timestamp: new Date(),
    };

    // Skapa ett objekt för uppdateringen
    const updateData = {
      status_history: admin.firestore.FieldValue.arrayUnion(newStatusEntry)
    };

    // *** NY LOGIK ***
    // Om detta är den slutgiltiga statusen, lägg till våra nya fält
    if (isFinalizing) {
      updateData.status = 'completed'; // Sätt en slutgiltig status
      updateData.picked_up_at = admin.firestore.FieldValue.serverTimestamp();
      updateData.follow_up_sent = false; // Markera att uppföljning INTE har skickats
    }

    await repairRef.update(updateData);
    
    return {
      statusCode: 200,
      body: JSON.stringify(newStatusEntry),
    };

  } catch (error) {
    console.error('Error updating repair status:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte uppdatera status.' }) };
  }
};