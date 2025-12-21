import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import twilio from 'twilio'; // Importera twilio

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

// Initiera Twilio-klienten
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Funktion för att generera en unik, läsbar kod
const generateRepairCode = () => {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  const nums = '123456789';
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 3; i++) {
    code += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return code;
};

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
    return { statusCode: 405, body: JSON.stringify({ message: 'Endast POST-metoden är tillåten.' }) };
  }

  try {
    const { deviceName, customerName, customerPhone } = JSON.parse(event.body);

    if (!deviceName || !customerName || !customerPhone) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Alla fält är obligatoriska.' }) };
    }

    const newRepairCode = generateRepairCode();

    const newRepairData = {
      device_name: deviceName,
      customer_name: customerName,
      customer_phone: customerPhone,
      repair_code: newRepairCode,
      status: 'active',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      status_history: [
        {
          status: 'Ärende skapat och registrerat.',
          timestamp: new Date(),
        }
      ]
    };

    const docRef = await db.collection('Reparationer').add(newRepairData);
    
    // --- START PÅ SMS-LOGIK ---
    if (customerPhone) {
        // Korrekt länk till din spårningssida
        const welcomeMessage = `Hej ${customerName}! \nVi har nu tagit emot din ${deviceName}. Spåra reparationen med kod ${newRepairCode} på: https://teknikhusetkalmar.se/spara. \nMvh, Teknikhuset Kalmar`;

        try {
            console.log("DEBUG: Sending SMS...från Create");
            console.log("DEBUG: Using TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER); 
            await twilioClient.messages.create({
                body: welcomeMessage,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: customerPhone
            });
            console.log(`Välkomst-SMS skickat till ${customerPhone}`);
        } catch (smsError) {
            // Logga felet men krascha inte hela funktionen.
            // Det är viktigare att ärendet skapas än att SMS:et skickas.
            console.error(`Kunde inte skicka välkomst-SMS till ${customerPhone}. Twilio-fel:`, smsError.message);
        }
    }
    // --- SLUT PÅ SMS-LOGIK ---

    const newDoc = await docRef.get();
    
    return {
      statusCode: 201,
      body: JSON.stringify({ id: newDoc.id, ...newDoc.data() }),
    };

  } catch (error) {
    console.error('Error creating repair:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Kunde inte skapa ärende.' }) };
  }
};