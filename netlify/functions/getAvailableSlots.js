const { google } = require('googleapis');

// --- AUTH & NYCKELHANTERING ---
// --- AUTH & NYCKELHANTERING ---
const getPrivateKey = () => {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) return null;
  
  // 1. Ta bort ALLA citattecken
  let cleanKey = key.replace(/['"]/g, '');

  // 2. Fixa radbrytningar
  cleanKey = cleanKey.replace(/\\n/g, '\n');

  return cleanKey;
};

const createAuthClient = () => {
  const privateKey = getPrivateKey();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  
  if (!privateKey || !clientEmail) throw new Error('Auth Config Error');

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};

// --- HJÄLPMATEMATIK ---

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// --- LOGIK FÖR ÖPPETTIDER ---

const getOpeningHours = (dateString) => {
  // dateString är "2025-12-06"
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Söndag, 1 = Måndag... 6 = Lördag
  
  // Helg (Lördag 6, Söndag 0)
  if (day === 0 || day === 6) {
    return { start: 10, end: 18 }; // 10:00 - 18:00
  }
  
  // Vardagar (Måndag-Fredag)
  return { start: 9, end: 20 }; // 09:00 - 20:00
};

const STEP_INTERVAL = 15; // Vi kollar tider var 15:e minut

// --- HUVUDLOGIK ---

const getBusyIntervals = async (auth, calendarId, dateString) => {
  const calendar = google.calendar({ version: 'v3', auth });
  
  const timeMin = `${dateString}T00:00:00Z`;
  const timeMax = `${dateString}T23:59:59Z`;

  const response = await calendar.events.list({
    calendarId: calendarId,
    timeMin: timeMin,
    timeMax: timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const busyIntervals = [];

  if (response.data.items) {
    response.data.items.forEach(event => {
      if (event.start.dateTime && event.end.dateTime) {
        // Konvertera start/slut till Svensk tid strängar
        const startStr = new Date(event.start.dateTime).toLocaleTimeString('sv-SE', {
          timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', hour12: false
        });
        const endStr = new Date(event.end.dateTime).toLocaleTimeString('sv-SE', {
          timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', hour12: false
        });

        busyIntervals.push({
          start: timeToMinutes(startStr),
          end: timeToMinutes(endStr)
        });
      }
    });
  }
  return busyIntervals;
};

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
    const { date, duration } = JSON.parse(event.body);

    if (!date || !duration) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing date or duration' }) };
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const auth = createAuthClient();

    // 1. Hämta alla bokade intervaller
    const busySlots = await getBusyIntervals(auth, calendarId, date);
    
    // 2. Bestäm öppettider för dagen
    const hours = getOpeningHours(date);
    const dayStart = hours.start * 60; 
    const dayEnd = hours.end * 60;     

    const availableSlots = [];

    // 3. Loopa genom dagen
    for (let currentTime = dayStart; currentTime < dayEnd; currentTime += STEP_INTERVAL) {
      
      const potentialStart = currentTime;
      const potentialEnd = currentTime + duration;

      // Kollar om tjänsten hinner avslutas innan vi stänger
      // Om du vill att man ska kunna boka 19:30 för en 30min tjänst (slutar 20:00) => Använd <=
      // Om du vill att man ska vara ute ur butiken 20:00 => Använd <=
      if (potentialEnd > dayEnd) {
        continue; 
      }

      // Kollar krockar
      const hasConflict = busySlots.some(busy => {
        return (potentialStart < busy.end) && (potentialEnd > busy.start);
      });

      if (!hasConflict) {
        availableSlots.push(minutesToTime(potentialStart));
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        availableSlots: availableSlots,
        openingHours: `${hours.start}:00 - ${hours.end}:00`
      })
    };

  } catch (error) {
    console.error('Error fetching slots:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Kunde inte hämta tider.' })
    };
  }
};