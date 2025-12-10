import admin from 'firebase-admin';

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
  // Ingen JWT-verifiering behövs här, den är publik!

  const repairCode = event.queryStringParameters.code;

  if (!repairCode) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: 'Reparationskod saknas.' }),
    };
  }

  try {
    const repairsRef = db.collection('Reparationer');
    // Normalisera input för säkerhets skull
    const snapshot = await repairsRef.where('repair_code', '==', repairCode.trim().toUpperCase()).limit(1).get();

    if (snapshot.empty) {
      return {
        statusCode: 404, // Not Found
        body: JSON.stringify({ message: 'Ingen reparation med den koden hittades. Vänligen kontrollera koden och försök igen.' }),
      };
    }

    const repairData = snapshot.docs[0].data();

    // Skicka tillbaka en renad version av datan
    // Vi vill inte skicka med kundens telefonnummer av integritetsskäl
    const publicRepairData = {
        device_name: repairData.device_name,
        repair_code: repairData.repair_code,
        status_history: repairData.status_history,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(publicRepairData),
    };

  } catch (error) {
    console.error('Error in getRepairStatus:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ett oväntat serverfel inträffade.' }),
    };
  }
};