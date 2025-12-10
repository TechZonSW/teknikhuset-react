// netlify/functions/sendContactForm.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// --- SETUP & NYCKELHANTERING ---
const getPrivateKey = () => {
  const key = process.env.CONTACT_FORM_PRIVATE_KEY;
  if (!key) {
    console.error('CRITICAL: CONTACT_FORM_PRIVATE_KEY is missing');
    return null;
  }
  
  // Rensa bort citattecken och fixa radbrytningar
  let cleanKey = key.replace(/['"]/g, '');
  cleanKey = cleanKey.replace(/\\n/g, '\n');

  return cleanKey;
};

const createAuthClient = () => {
  const privateKey = getPrivateKey();
  const clientEmail = process.env.CONTACT_FORM_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Configuration Error: Missing CONTACT_FORM Private Key or Email');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

// --- GMAIL SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// --- HANDLER ---
export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { name, email, phone, message } = JSON.parse(event.body);

    // Validering
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Namn, email och meddelande är obligatoriska' }),
      };
    }

    const timestamp = new Date().toISOString();

    // 1. Spara till Google Sheets
    const sheets = google.sheets('v4');
    const auth = createAuthClient();

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: process.env.CONTACT_FORM_SHEETS_ID,
      range: 'Kontaktformulär!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [timestamp, name, email, phone || '(ej angett)', message, 'Ej besvarad'],
        ],
      },
    });

    // 2. Skicka email till team@teknikhusetkalmar.se
    await transporter.sendMail({
      from: email,
      to: 'team@teknikhusetkalmar.se',
      replyTo: email,
      subject: `Ny kontaktförfrågan från ${name}`,
      html: `
        <h2>Ny förfrågan från kontaktformuläret</h2>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Telefon:</strong> ${phone || '(ej angett)'}</p>
        <p><strong>Meddelande:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><small>Skickat: ${new Date().toLocaleString('sv-SE')}</small></p>
      `,
    });

    // 3. Skicka bekräftelsemail till kund
    await transporter.sendMail({
      from: 'team@teknikhusetkalmar.se',
      to: email,
      subject: 'Vi har mottagit din förfrågan – Teknikhuset Kalmar',
      html: `
        <h2>Tack för att du kontaktade oss!</h2>
        <p>Hej ${name},</p>
        <p>Vi har mottagit din förfrågan och återkommer till dig så snart som möjligt på denna email.</p>
        <hr>
        <p><strong>Ditt meddelande:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Om du har brådska kan du också nå oss på <a href="tel:+46761723014">076-172 30 14</a></p>
        <p>Med vänlig hälsning,<br><strong>Teknikhuset Kalmar</strong><br>Norra Långgatan 11 b, 392 32 Kalmar</p>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Tack! Din förfrågan har skickats. Vi återkommer inom kort.'
      }),
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || 'Något gick fel. Försök igen senare.' }),
    };
  }
};