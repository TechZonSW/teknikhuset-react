import admin from 'firebase-admin';
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

export const handler = async () => {
  console.log('--- Kör schemalagd funktion: sendFollowUpSms ---');

  const db = admin.firestore();
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  // Sätt en tidsgräns. 24 timmar = 24 * 60 * 60 * 1000 millisekunder
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const snapshot = await db.collection('Reparationer')
      .where('status', '==', 'completed')
      .where('follow_up_sent', '==', false)
      .where('picked_up_at', '<=', twentyFourHoursAgo)
      .get();

    if (snapshot.empty) {
      console.log('Inga ärenden hittades för uppföljning. Avslutar.');
      return { statusCode: 200, body: 'Inga ärenden att följa upp.' };
    }

    console.log(`Hittade ${snapshot.docs.length} ärende(n) att skicka uppföljning till.`);

    // Skapa en array av löften (promises) för alla SMS och databasuppdateringar
    const tasks = snapshot.docs.map(async (doc) => {
      const repair = doc.data();
      const repairId = doc.id;

      // \n kommer att skapa en riktig radbrytning i SMS:et
      const followUpMessage = `Hej ${repair.customer_name}!\nHoppas allt fungerar felfritt med din ${repair.device_name} nu. Vi ville bara dubbelkolla att du är nöjd med reparationen? Tveka inte att höra av dig på teknikhusetkalmar.se om du undrar över något.\nMvh\nTeamet på Teknikhuset Kalmar`;

      try {
        await twilioClient.messages.create({
          body: followUpMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: repair.customer_phone
        });
        console.log(`Uppföljnings-SMS skickat till ${repair.customer_phone}`);

        // Om SMS lyckades, uppdatera dokumentet i databasen
        await db.collection('Reparationer').doc(repairId).update({
          follow_up_sent: true
        });
        console.log(`Ärende ${repairId} markerat som uppföljt.`);
      } catch (smsError) {
        console.error(`Misslyckades med att skicka SMS eller uppdatera för ärende ${repairId}:`, smsError);
      }
    });

    // Vänta på att alla uppgifter ska slutföras
    await Promise.all(tasks);

    return { statusCode: 200, body: 'Uppföljningar hanterade.' };

  } catch (error) {
    console.error('Allvarligt fel i sendFollowUpSms-funktionen:', error);
    return { statusCode: 500, body: 'Fel vid hantering av uppföljningar.' };
  }
};