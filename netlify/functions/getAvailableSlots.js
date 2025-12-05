const { google } = require('googleapis');

// Business hours setup
const BUSINESS_HOURS = {
  start: 9, // 09:00
  end: 18,  // 18:00
  slotDuration: 30 // minutes
};

// Robust funktion för att hantera Private Key
const getPrivateKey = () => {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) return null;
  // Ersätt bokstavliga \n med riktiga radbrytningar och ta bort eventuella citattecken
  return key.replace(/\\n/g, '\n').replace(/"/g, '');
};

const createAuthClient = () => {
  const privateKey = getPrivateKey();
  
  if (!privateKey) throw new Error('Private Key missing');

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};

// Generera tidsluckor (HH:mm)
const generateTimeSlots = (startHour, endHour, slotDuration) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

// Hämta bokade tider med korrekt tidszon (Stockholm)
const getBookedSlots = async (auth, calendarId, dateString) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Sätt tidsintervall för hela dygnet i lokal tid
    // Vi skickar ISO-strängar men låter Google hantera tidszonen via timeMin/timeMax
    // Enklast: Sök brett (UTC) och filtrera sen
    const startOfDay = new Date(`${dateString}T00:00:00.000+01:00`); // Approximation för sökning
    const endOfDay = new Date(`${dateString}T23:59:59.000+01:00`);
    
    // Justera sökfönstret för att vara säker på att få med allt (UTC-12 till UTC+14)
    // Det viktiga är att vi filtrerar rätt nedan.
    
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date(startOfDay.getTime() - 86400000).toISOString(), // Ta i lite extra bakåt
      timeMax: new Date(endOfDay.getTime() + 86400000).toISOString(),   // Ta i lite extra framåt
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'Europe/Stockholm' // Be Google räkna i svensk tid
    });
    
    const bookedSlots = [];
    
    if (response.data.items) {
      response.data.items.forEach(event => {
        if (event.start.dateTime) {
          // Här är magin: Konvertera eventets tid specifikt till Svensk tid sträng (HH:mm)
          // oavsett vad servern (Netlify) har för tidszon.
          const eventDate = new Date(event.start.dateTime);
          
          // Kolla så att eventet faktiskt är på rätt dag (eftersom vi vidgade sökfönstret)
          const eventDayString = eventDate.toLocaleDateString('sv-SE', {
            timeZone: 'Europe/Stockholm'
          });

          if (eventDayString === dateString) {
             const timeStr = eventDate.toLocaleTimeString('sv-SE', {
              timeZone: 'Europe/Stockholm',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            // "09:00" format
            bookedSlots.push(timeStr);
          }
        }
      });
    }
    
    console.log('Booked slots (Stockholm time):', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { date } = JSON.parse(event.body);
    
    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid date format' }) };
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!calendarId || !serviceAccountEmail || !privateKey) {
      console.error('Missing env vars');
      return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Configuration error' }) };
    }

    const auth = createAuthClient();

    const allSlots = generateTimeSlots(
      BUSINESS_HOURS.start,
      BUSINESS_HOURS.end,
      BUSINESS_HOURS.slotDuration
    );

    const bookedSlots = await getBookedSlots(auth, calendarId, date);

    // Filtrera bort bokade tider
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        availableSlots,
        bookedSlots, // Bra för debugging
        date
      })
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to fetch slots'
      })
    };
  }
};