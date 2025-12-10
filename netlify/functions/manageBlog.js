import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. IMPORT CONFIG & SECRETS
import { FIREBASE_PROJECT_ID } from './config.js';

// --- FIREBASE ADMIN SETUP ---
if (!getApps().length) {
  // We use the same secure setup as your other functions
  const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('CRITICAL: Missing Firebase Admin Credentials');
  }

  initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID, 
      clientEmail: clientEmail,       
      privateKey: privateKey         
    })
  });
}

const db = getFirestore();

// --- HANDLER ---

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Hantera pre-flight requests (CORS)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Endast POST tillåtet
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, id, postData } = data;

    // Optional: Add Auth check here if needed in the future

    if (action === 'create') {
      const docRef = await db.collection('blogPosts').add(postData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ id: docRef.id, message: 'Inlägget skapat' })
      };
    } 
    
    else if (action === 'update') {
      if (!id) throw new Error('ID saknas för uppdatering');
      await db.collection('blogPosts').doc(id).update(postData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Inlägget uppdaterat' })
      };
    } 
    
    else if (action === 'delete') {
      if (!id) throw new Error('ID saknas för borttagning');
      await db.collection('blogPosts').doc(id).delete();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Inlägget raderat' })
      };
    }

    return { statusCode: 400, headers, body: 'Ogiltig åtgärd (action)' };

  } catch (error) {
    console.error('Blog Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};