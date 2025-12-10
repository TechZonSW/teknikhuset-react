// netlify/functions/registerMember.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// --- SETUP (Återanvänder din befintliga nyckelhantering) ---
const getPrivateKey = () => {
  const key = process.env.CONTACT_FORM_PRIVATE_KEY;
  if (!key) {
    console.error('CRITICAL: CONTACT_FORM_PRIVATE_KEY is missing');
    return null;
  }
  return key.replace(/['"]/g, '').replace(/\\n/g, '\n');
};

const createAuthClient = () => {
  const privateKey = getPrivateKey();
  const clientEmail = process.env.CONTACT_FORM_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Configuration Error: Missing keys');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { 
      plan,          // "Essential", "Pro", "Elite"
      period,        // "monthly", "yearly"
      type,          // "individual", "family"
      price,         // Summan
      mainMember,    // { name, ssn, email, phone }
      familyMembers  // Array av { name, ssn } (kan vara tom)
    } = data;

    // Enkel validering
    if (!mainMember.name || !mainMember.ssn || !mainMember.email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Saknar obligatoriska uppgifter.' }) };
    }

    const timestamp = new Date().toLocaleString('sv-SE');
    
    // Formatera familjemedlemmar till en snygg sträng för Excel/Sheets
    const familyString = familyMembers && familyMembers.length > 0 
      ? familyMembers.map(m => `${m.name} (${m.ssn})`).join(', ')
      : '-';

    // 1. SPARA TILL GOOGLE SHEETS
    const sheets = google.sheets('v4');
    const auth = createAuthClient();

    // Se till att fliken i ditt Google Sheet heter exakt "Medlemmar"
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: process.env.MEMBER_SHEETS_ID, 
      range: 'Medlemmar!A:K', 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          plan,
          period === 'yearly' ? 'Årsvis' : 'Månadsvis',
          type === 'family' ? 'Familj' : 'Individ',
          mainMember.name,
          mainMember.ssn,
          mainMember.email,
          mainMember.phone,
          familyString,
          price + ' kr',
          'Ny'
        ]],
      },
    });

    // 2. SKAPA MAIL-INNEHÅLL BASERAT PÅ PLAN
    // Vi bygger listan dynamiskt baserat på vad som ingår i respektive paket enligt hemsidan.
    
    let benefitsList = [];

    // Helper för att matcha plan-namn lite flexiblare
    const p = plan.toLowerCase();

    if (p.includes('essential')) {
      benefitsList = [
        'Alltid Gratis Felsökning',
        '10% rabatt på första Reparation/Service/Köp',
        'Digitalt kvittoarkiv',
        'Personlig Support'
      ];
    } else if (p.includes('pro')) {
      benefitsList = [
        'Prioriterad Service (Förtur i kön)',
        '10% rabatt på ALLA reparationer',
        '10% rabatt på ALLA tillbehör',
        'Kalmar Förmånsklubb™ (10% hos partners)',
        'Nytt skärmskydd varje år (Värde 399 kr)',
        'Årlig hälsokontroll av enhet',
        'Gratis dataradering',
        // Essential features
        'Alltid Gratis Felsökning',
        'Digitalt kvittoarkiv',
        'Personlig Support'
      ];
    } else if (p.includes('elite')) {
      benefitsList = [
        // Elite Specifika
        'Gratis Lånetelefon vid service',
        'Garanterad svarstid (Samma dag)',
        '50% rabatt på batteribyte (1 gång/år)',
        'Årlig fysisk rengöring & sanering',
        'Gratis dataöverföring',
        'VIP-inbjudningar till events',
        // Pro features (inkluderar nu även dataradering)
        'Prioriterad Service (Förtur i kön)',
        '10% rabatt på ALLA reparationer',
        '10% rabatt på ALLA tillbehör',
        'Kalmar Förmånsklubb™ (10% hos partners)',
        'Nytt skärmskydd varje år (Värde 399 kr)',
        'Årlig hälsokontroll av enhet',
        'Gratis dataradering',
        // Essential features
        'Alltid Gratis Felsökning',
        'Digitalt kvittoarkiv',
        'Personlig Support'
      ];
    }

    // Skapa HTML-listan
    const planBenefits = benefitsList.map(item => `<li>✅ ${item}</li>`).join('');

    const isFamily = type === 'family';
    const welcomeTitle = isFamily ? `Välkomna till familjen, ${mainMember.name}!` : `Välkommen till klubben, ${mainMember.name}!`;

    // 3. SKICKA BEKRÄFTELSE TILL KUND
    await transporter.sendMail({
      from: 'Teknikhuset Kalmar <team@teknikhusetkalmar.se>',
      to: mainMember.email,
      subject: `Bekräftelse: Ditt medlemskap i ${plan}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #0a0e27; padding: 30px; text-align: center;">
            <h1 style="color: #d4af37; margin: 0;">TEKNIKHUSET</h1>
            <p style="color: #fff; letter-spacing: 2px; font-size: 12px; text-transform: uppercase;">Members Club</p>
          </div>
          
          <div style="padding: 30px; background-color: #faf9f7;">
            <h2 style="color: #0a0e27;">${welcomeTitle}</h2>
            <p>Tack för att du valt att bli medlem hos oss. Här nedan ser du en sammanställning av ditt valda medlemskap.</p>
            
            <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #d4af37; margin-top: 0;">${plan} ${isFamily ? '(Familj)' : ''}</h3>
              <p><strong>Pris:</strong> ${price} kr / ${period === 'yearly' ? 'år' : 'månad'}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
              <ul style="list-style: none; padding: 0; line-height: 1.6;">
                ${planBenefits}
              </ul>
            </div>

            ${isFamily ? `<p style="font-size: 0.9em; color: #666;">Dina registrerade familjemedlemmar är inkluderade i detta skydd.</p>` : ''}

            <h3>Vad händer nu?</h3>
            <p>Ditt medlemskap är nu registrerat. Om du valt ett betalmedlemskap kommer vi att kontakta dig inom kort för att sätta upp den automatiska betalningen, alternativt löser vi det vid ditt nästa besök i butiken.</p>
            
            <p>Varmt välkommen in till oss på Norra Långgatan 11B!</p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #888;">
            <p>Teknikhuset Kalmar | Norra Långgatan 11B | 076-172 30 14</p>
          </div>
        </div>
      `
    });

    // 4. SKICKA NOTIS TILL BUTIKEN (DIG)
    await transporter.sendMail({
      from: 'system@teknikhusetkalmar.se',
      to: 'team@teknikhusetkalmar.se',
      subject: `NY MEDLEM: ${plan} (${mainMember.name})`,
      html: `
        <h2>Ny medlemsregistrering</h2>
        <p><strong>Namn:</strong> ${mainMember.name}</p>
        <p><strong>Personnr:</strong> ${mainMember.ssn}</p>
        <p><strong>Plan:</strong> ${plan} (${type})</p>
        <p><strong>Period:</strong> ${period}</p>
        <p><strong>Pris:</strong> ${price} kr</p>
        <p><strong>Familjemedlemmar:</strong> ${familyString}</p>
        <hr>
        <p>Datan är sparad i Google Sheets ("Medlemmar").</p>
      `
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Registrering lyckades!' }),
    };

  } catch (error) {
    console.error('Member reg error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};