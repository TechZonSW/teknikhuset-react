import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

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

// Initiera Twilio-klienten med dina nycklar
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const handler = async (event) => {
  // 1. Säkerhetskontroller (JWT)
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
    // 2. Ta emot data från frontend
    const { repairId, message } = JSON.parse(event.body);
    if (!repairId || !message) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Ärende-ID och meddelande krävs.' }) };
    }

    // 3. Hämta kundens telefonnummer från ärendet i Firebase
    const repairDoc = await db.collection('Reparationer').doc(repairId).get();
    if (!repairDoc.exists) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Ärende hittades ej.' }) };
    }
    
    const customerPhone = repairDoc.data().customer_phone;
    if (!customerPhone) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Kunden saknar telefonnummer i ärendet.' }) };
    }

    // 4. Skicka SMS med Twilio
    console.log(`Försöker skicka SMS till: ${customerPhone}`);
    await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customerPhone
    });
    
    console.log('SMS skickat framgångsrikt via Twilio.');
    return { statusCode: 200, body: JSON.stringify({ message: 'SMS skickat!' }) };

  } catch (error) {
    // Logga det detaljerade felet (från t.ex. Twilio) i Netlify-loggen
    console.error("sendSms function error:", error);
    // Skicka ett mer generellt felmeddelande tillbaka till användaren
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte skicka SMS. Kontrollera telefonnummer och Twilio-inställningar.' }) };
  }
};