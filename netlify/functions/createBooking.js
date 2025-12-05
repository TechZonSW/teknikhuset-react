const { google } = require('googleapis');

// --- SETUP & NYCKELHANTERING (Denna fungerar nu!) ---
const getPrivateKey = () => {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) {
    console.error('CRITICAL: GOOGLE_PRIVATE_KEY is missing');
    return null;
  }
  
  // Rensa bort citattecken och fixa radbrytningar
  let cleanKey = key.replace(/['"]/g, '');
  cleanKey = cleanKey.replace(/\\n/g, '\n');

  return cleanKey;
};

const createAuthClient = () => {
  const privateKey = getPrivateKey();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Configuration Error: Missing Private Key or Email');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};

// --- HJÄLPFUNKTIONER ---

const calculateEndDateTime = (dateStr, timeStr, durationMinutes) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const tempDate = new Date();
  tempDate.setHours(hours);
  tempDate.setMinutes(minutes + durationMinutes);
  tempDate.setSeconds(0);

  const newH = tempDate.getHours().toString().padStart(2, '0');
  const newM = tempDate.getMinutes().toString().padStart(2, '0');
  
  return `${dateStr}T${newH}:${newM}:00`;
};

// --- LOGIK ---

const isTimeSlotAvailable = async (auth, calendarId, date, time) => {
  const calendar = google.calendar({ version: 'v3', auth });
  const timeMin = `${date}T00:00:00Z`;
  const timeMax = `${date}T23:59:59Z`;

  const response = await calendar.events.list({
    calendarId: calendarId,
    timeMin: timeMin,
    timeMax: timeMax,
    singleEvents: true,
  });

  const conflicts = response.data.items.filter(item => {
    if (!item.start.dateTime) return false;
    const eventTime = new Date(item.start.dateTime).toLocaleTimeString('sv-SE', {
      timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', hour12: false
    });
    return eventTime === time;
  });

  return conflicts.length === 0;
};

const createCalendarEvent = async (auth, calendarId, bookingData) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    
    const startDateTime = `${bookingData.date}T${bookingData.time}:00`;
    const endDateTime = calculateEndDateTime(bookingData.date, bookingData.time, bookingData.duration);

    const description = `
TJÄNST: ${bookingData.serviceTitle}
KATEGORI: ${bookingData.serviceGroup}
LÄNGD: ${bookingData.duration} min

KUNDINFORMATION:
Namn: ${bookingData.customerName}
E-post: ${bookingData.customerEmail}
Telefon: ${bookingData.customerPhone || '-'}

KUNDENS BEHOV/PROBLEM:
${bookingData.customerNotes}
`.trim();

    const event = {
      summary: `${bookingData.serviceTitle} - ${bookingData.customerName}`,
      description: description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Stockholm', 
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Stockholm',
      },
      // VIKTIGT: Jag har tagit bort 'attendees' helt härifrån.
      // Det är detta som löser 403-felet.
      reminders: {
        useDefault: true,
      }
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    });

    return { success: true, eventId: response.data.id };
  } catch (error) {
    console.error('Google API Insert Error:', error);
    throw error;
  }
};

// --- HANDLER ---

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const bookingData = JSON.parse(event.body);
    
    if (!process.env.GOOGLE_CALENDAR_ID) throw new Error('Missing GOOGLE_CALENDAR_ID');
    const auth = createAuthClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    // 1. Kolla om tiden är ledig
    const isAvailable = await isTimeSlotAvailable(auth, calendarId, bookingData.date, bookingData.time);
    if (!isAvailable) {
      return { statusCode: 409, headers, body: JSON.stringify({ success: false, error: 'Tiden är tyvärr inte längre tillgänglig.' }) };
    }

    // 2. Skapa bokningen (Utan attendees = Inget error)
    const result = await createCalendarEvent(auth, calendarId, bookingData);

    return { statusCode: 201, headers, body: JSON.stringify(result) };

  } catch (error) {
    console.error('Handler crashed:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message || 'Internt serverfel.' }) };
  }
};