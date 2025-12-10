import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Initiera Firebase EN GÅNG när funktionen laddas in i minnet
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('Firebase initialized successfully on cold start.');
  } catch (e) {
    console.error('CRITICAL: Firebase admin initialization failed.', e);
  }
}

export const handler = async (event) => {
  // *** HÄR ÄR DEN VIKTIGA ÄNDRINGEN ***
  // Vi hämtar databas-referensen HÄR, inuti handlern.
  // Detta säkerställer att appen ovan garanterat är initierad.
  const db = admin.firestore();
  
  console.log('\n--- NEW LOGIN ATTEMPT ---');

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }
  
  try {
    // Steg 1: Ta emot och tolka inkommande data
    console.log('Step 1: Parsing request body...');
    const { username, password } = JSON.parse(event.body);
    console.log(` -> Received username: "${username}"`);

    if (!username || !password) {
      console.log(' -> FAIL: Missing username or password.');
      return { statusCode: 400, body: JSON.stringify({ message: 'Användarnamn och lösenord krävs.' }) };
    }
    console.log(' -> SUCCESS: Body parsed.');

    // Steg 2: Fråga databasen
    console.log('Step 2: Querying Firestore for username...');
    const adminsRef = db.collection('Admin');
    const snapshot = await adminsRef.where('username', '==', username).limit(1).get();
    console.log(' -> SUCCESS: Firestore query complete.');

    if (snapshot.empty) {
      console.log(' -> FAIL: No user found with that username.');
      return { statusCode: 401, body: JSON.stringify({ message: 'Fel användarnamn eller lösenord.' }) };
    }
    console.log(' -> User found in database.');

    // Steg 3: Hämta användardata
    console.log('Step 3: Extracting user data from document...');
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    console.log(' -> SUCCESS: User data extracted.');
    console.log('   -> Stored password_hash:', userData.password_hash ? 'Exists' : 'MISSING!');

    // Steg 4: Jämför lösenord
    console.log('Step 4: Comparing password with stored hash...');
    const passwordMatch = await bcrypt.compare(password, userData.password_hash);
    console.log(' -> SUCCESS: bcrypt comparison complete.');

    if (!passwordMatch) {
      console.log(' -> FAIL: Passwords do not match.');
      return { statusCode: 401, body: JSON.stringify({ message: 'Fel användarnamn eller lösenord.' }) };
    }
    console.log(' -> Passwords MATCH!');

    // Steg 5: Skapa JWT-token
    console.log('Step 5: Generating JWT token...');
    const token = jwt.sign(
      { userId: userDoc.id, username: userData.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );
    console.log(' -> SUCCESS: JWT token generated.');

    console.log('--- LOGIN ATTEMPT SUCCESSFUL ---');
    return { 
      statusCode: 200, 
      body: JSON.stringify({ token }) 
    };

  } catch (error) {
    console.error('--- CRITICAL ERROR during login attempt ---');
    console.error(error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Ett internt serverfel inträffade.' }) 
    };
  }
};