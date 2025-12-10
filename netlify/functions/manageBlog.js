const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initiera Firebase Admin (Backend) om det inte redan är gjort
if (!getApps().length) {
  // Vi försöker läsa från miljövariablerna (samma som dina andra funktioner använder)
  // Om du har en specifik setup för 'createRepair.js', kopiera init-koden därifrån istället.
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  
  // Fallback om du kör lokalt och använder andra variabler i .env
  if (Object.keys(serviceAccount).length === 0) {
     initializeApp({
        credential: cert({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
        })
     });
  } else {
     initializeApp({ credential: cert(serviceAccount) });
  }
}

const db = getFirestore();

exports.handler = async (event, context) => {
  // Endast POST tillåtet
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, id, postData } = data;

    // Här kan du lägga till verifiering av JWT-token om du vill vara extra säker (likt dina andra filer)
    // const token = event.headers.authorization; ...

    if (action === 'create') {
      const docRef = await db.collection('blogPosts').add(postData);
      return {
        statusCode: 200,
        body: JSON.stringify({ id: docRef.id, message: 'Inlägget skapat' })
      };
    } 
    
    else if (action === 'update') {
      if (!id) throw new Error('ID saknas för uppdatering');
      await db.collection('blogPosts').doc(id).update(postData);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Inlägget uppdaterat' })
      };
    } 
    
    else if (action === 'delete') {
      if (!id) throw new Error('ID saknas för borttagning');
      await db.collection('blogPosts').doc(id).delete();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Inlägget raderat' })
      };
    }

    return { statusCode: 400, body: 'Ogiltig åtgärd (action)' };

  } catch (error) {
    console.error('Blog Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};