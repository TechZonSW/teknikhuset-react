const { google } = require('googleapis');

// Create auth client from environment variables
const createAuthClient = () => {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};

// Create a booking event in Google Calendar
const createCalendarEvent = async (auth, calendarId, bookingData) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse the date and time
    const [year, month, day] = bookingData.date.split('-');
    const [hour, minute] = bookingData.time.split(':');
    
    const startTime = new Date(
      parseInt(year),
      parseInt(month) - 1, // JS months are 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
    
    const endTime = new Date(startTime.getTime() + bookingData.duration * 60000);
    
    // Build event description
    const description = `
Tjänst: ${bookingData.serviceTitle}
Tjänstkategori: ${bookingData.serviceGroup}

Kundinformation:
Namn: ${bookingData.customerName}
E-post: ${bookingData.customerEmail}
Telefon: ${bookingData.customerPhone || 'Inte angiven'}

Kundens behov/problem:
${bookingData.customerNotes}
`.trim();

    // Create the event
    const event = {
      summary: `${bookingData.serviceTitle} - ${bookingData.customerName}`,
      description: description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/Stockholm', // Swedish timezone
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/Stockholm',
      },
      attendees: [
        {
          email: bookingData.customerEmail,
          responseStatus: 'needsAction',
        }
      ],
      reminders: {
        useDefault: true,
      }
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      sendUpdates: 'externalOnly', // Send calendar invitation to customer
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Check if a time slot is already booked
const isTimeSlotAvailable = async (auth, calendarId, date, time, duration) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    const startTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
    
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
    });

    // If any events exist in this time range, it's not available
    return response.data.items.length === 0;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
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
    const bookingData = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['date', 'time', 'duration', 'serviceTitle', 'customerName', 'customerEmail', 'customerNotes'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            success: false,
            error: `Missing required field: ${field}` 
          })
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.customerEmail)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Invalid email format' 
        })
      };
    }

    // Validate date format (YYYY-MM-DD)
    if (!bookingData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD.' 
        })
      };
    }

    // Validate time format (HH:MM)
    if (!bookingData.time.match(/^\d{2}:\d{2}$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Invalid time format. Use HH:MM.' 
        })
      };
    }

    // Get environment variables
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

    // Check if time slot is still available
    const isAvailable = await isTimeSlotAvailable(
      auth,
      calendarId,
      bookingData.date,
      bookingData.time,
      bookingData.duration
    );

    if (!isAvailable) {
      return {
        statusCode: 409,
        body: JSON.stringify({ 
          success: false,
          error: 'This time slot is no longer available. Please choose another time.' 
        })
      };
    }

    // Create the booking
    const bookingResult = await createCalendarEvent(auth, calendarId, bookingData);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Booking created successfully',
        eventId: bookingResult.eventId,
        customerEmail: bookingData.customerEmail,
        bookingDetails: {
          date: bookingData.date,
          time: bookingData.time,
          service: bookingData.serviceTitle,
          customerName: bookingData.customerName
        }
      })
    };
  } catch (error) {
    console.error('Error in createBooking:', error);
    
    // Return specific error if it's a Google API error
    if (error.message.includes('Invalid Credentials')) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          success: false,
          error: 'Authentication error. Please contact support.' 
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to create booking. Please try again or contact us.' 
      })
    };
  }
};