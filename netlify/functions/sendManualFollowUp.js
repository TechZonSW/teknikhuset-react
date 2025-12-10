import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

// Initiera Firebase EN GÅNG när funktionen laddas
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('Firebase (sendManualFollowUp) initialized.');
  } catch (e) {
    console.error('Firebase admin initialization error in sendManualFollowUp', e);
  }
}

// Initiera Twilio-klienten med dina nycklar
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const handler = async (event) => {
  const db = admin.firestore();

  // 1. Säkerhetskontroll (Metod)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Endast POST är tillåtet.' }) };
  }
  
  // 2. Säkerhetskontroll (JWT-verifiering)
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Åtkomst nekad. Authorization header saknas.' }) };
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return { statusCode: 403, body: JSON.stringify({ message: 'Ogiltig eller utgången token.' }) };
  }

  try {
    // 3. Hämta Ärende-ID från anropet
    const { repairId } = JSON.parse(event.body);
    if (!repairId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Ärende-ID krävs.' }) };
    }

    const repairRef = db.collection('Reparationer').doc(repairId);
    const doc = await repairRef.get();

    if (!doc.exists) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Ärendet hittades inte.' }) };
    }

    const repair = doc.data();

    // 4. Dubbelkolla så att vi inte skickar SMS i onödan
    if (repair.follow_up_sent) {
      // Använd 409 Conflict för att indikera att handlingen redan är utförd
      return { statusCode: 409, body: JSON.stringify({ message: 'Uppföljnings-SMS har redan skickats för detta ärende.' }) };
    }
    
    // 5. Bygg och skicka SMS
    const followUpMessage = `Hej ${repair.customer_name}!\nHoppas allt fungerar felfritt med din ${repair.device_name} nu. Vi ville bara dubbelkolla att du är nöjd med reparationen? Tveka inte att höra av dig på teknikhusetkalmar.se om du undrar över något.\nMvh\nTeamet på Teknikhuset Kalmar`;
    
    await twilioClient.messages.create({
        body: followUpMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: repair.customer_phone
    });

    console.log(`Manuell uppföljning skickad till ${repair.customer_phone} för ärende ${repairId}`);

    // 6. Uppdatera dokumentet i Firebase: markera som skickat OCH arkivera
    await repairRef.update({
      follow_up_sent: true,
      status: 'archived' // Arkivera ärendet
    });

    return { statusCode: 200, body: JSON.stringify({ message: 'Uppföljning skickad och ärendet har arkiverats.' }) };

  } catch (error) {
    console.error("Manual Follow-Up Error:", error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte skicka manuell uppföljning.' }) };
  }
};