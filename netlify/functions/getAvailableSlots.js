const { google } = require('googleapis');

// Business hours (you can customize these)
const BUSINESS_HOURS = {
  start: 9, // 09:00
  end: 18,  // 18:00
  slotDuration: 30 // minutes
};

// Create auth client from environment variables
const createAuthClient = () => {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};

// Generate all possible time slots for a day
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

// Fetch booked times from Google Calendar
const getBookedSlots = async (auth, calendarId, dateString) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Create time range for the requested date
    const startOfDay = new Date(dateString + 'T00:00:00Z');
    const endOfDay = new Date(dateString + 'T23:59:59Z');
    
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const bookedSlots = [];
    
    if (response.data.items) {
      response.data.items.forEach(event => {
        if (event.start.dateTime && event.end.dateTime) {
          const startTime = new Date(event.start.dateTime);
          const endTime = new Date(event.end.dateTime);
          
          // Extract time in HH:MM format
          const startHour = String(startTime.getHours()).padStart(2, '0');
          const startMinute = String(startTime.getMinutes()).padStart(2, '0');
          const timeStr = `${startHour}:${startMinute}`;
          
          bookedSlots.push(timeStr);
        }
      });
    }
    
    return bookedSlots;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

// Main handler
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { date } = JSON.parse(event.body);
    
    // Validate date format (YYYY-MM-DD)
    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD.' 
        })
      };
    }

    // Check if date is in the past
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Cannot book dates in the past.' 
        })
      };
    }

    // Get required environment variables
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!calendarId || !serviceAccountEmail || !privateKey) {
      console.error('Missing environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          success: false,
          error: 'Server configuration error' 
        })
      };
    }

    // Create auth client
    const auth = createAuthClient();

    // Generate all possible time slots
    const allSlots = generateTimeSlots(
      BUSINESS_HOURS.start,
      BUSINESS_HOURS.end,
      BUSINESS_HOURS.slotDuration
    );

    // Get booked slots from Google Calendar
    const bookedSlots = await getBookedSlots(auth, calendarId, date);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        availableSlots: availableSlots,
        bookedSlots: bookedSlots,
        date: date
      })
    };
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to fetch available slots. Please try again.' 
      })
    };
  }
};