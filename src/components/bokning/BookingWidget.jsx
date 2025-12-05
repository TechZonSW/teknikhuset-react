import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight } from 'phosphor-react';
import './BookingWidget.css';

const BookingWidget = ({ service, serviceGroup }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Fetch available slots from Netlify Function
  const fetchAvailableSlots = async (date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const dateString = date.toISOString().split('T')[0];
      
      const response = await fetch('/.netlify/functions/getAvailableSlots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          duration: getDurationInMinutes(service.duration)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAvailableTimes(data.availableSlots || []);
      } else {
        setError(data.error || 'Kunde inte hämta lediga tider');
        setAvailableTimes([]);
      }
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setError('Något gick fel när vi hämtade lediga tider. Försök igen.');
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert duration text to minutes
  const getDurationInMinutes = (durationText) => {
    if (durationText.includes('30')) return 30;
    if (durationText.includes('1 timme')) return 60;
    return 30; // default
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
    setSelectedTime(null);
    fetchAvailableSlots(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTime || !formData.name || !formData.email || !formData.notes) {
      setError('Vänligen fyll i alla obligatoriska fält.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const bookingData = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: getDurationInMinutes(service.duration),
        serviceId: service.id,
        serviceTitle: service.title,
        serviceGroup: serviceGroup.groupTitle,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerNotes: formData.notes
      };

      const response = await fetch('/.netlify/functions/createBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIsConfirmed(true);
      } else {
        setError(data.error || 'Något gick fel när vi bokade tiden. Försök igen.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Något gick fel. Försök igen senare eller kontakta oss direkt.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="booking-confirmation">
        <div className="booking-confirmation__icon">✓</div>
        <h3>Tack för din bokning!</h3>
        <p>Vi har skickat en bekräftelse till <strong>{formData.email}</strong>.</p>
        <p>Du är bokad för <strong>{service.title}</strong></p>
        <p className="booking-confirmation__datetime">
          <strong>{selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} kl {selectedTime}</strong>
        </p>
        <p className="booking-confirmation__closing">Vi ses snart på Teknikhuset Kalmar!</p>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];

  // Swedish calendar starts on Monday (1), but JS uses Sunday (0)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="booking-widget">
      {/* Error Message */}
      {error && (
        <div className="booking-error">
          <p>{error}</p>
        </div>
      )}

      {/* KALENDERVÄLJER */}
      <div className="calendar-section">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={handlePrevMonth} aria-label="Föregående månad">
            <CaretLeft size={20} />
          </button>
          <h3 className="calendar-month-year">{formatMonthYear(currentMonth)}</h3>
          <button className="calendar-nav-btn" onClick={handleNextMonth} aria-label="Nästa månad">
            <CaretRight size={20} />
          </button>
        </div>

        <div className="calendar-weekdays">
          {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-day calendar-day--empty"></div>;
            }

            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDate && 
              selectedDate.toDateString() === dateObj.toDateString();
            const isPast = isDatePast(dateObj);

            return (
              <button
                key={day}
                className={`calendar-day ${isSelected ? 'is-selected' : ''} ${isPast ? 'is-disabled' : ''}`}
                onClick={() => handleDateSelect(day)}
                disabled={isPast}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* TIDSVÄLJARE - VISAS NÄR DATUM ÄR VALT */}
      {selectedDate && (
        <div className="time-section">
          <p className="time-section__label">
            Vald dag: <strong>{selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </p>

          {isLoading ? (
            <div className="time-loading">
              <p>Laddar tillgängliga tider...</p>
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="time-slots-grid">
              {availableTimes.map(time => (
                <button 
                  key={time} 
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="time-no-slots">
              <p>Inga lediga tider denna dag. Välj en annan dag.</p>
            </div>
          )}
        </div>
      )}

      {/* FORMULÄR - VISAS NÄR TID ÄR VALD */}
      {selectedTime && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <h4>Din bokningssammanfattning</h4>
          
          <div className="booking-summary">
            <div className="summary-item">
              <span className="summary-label">Tjänst:</span>
              <span className="summary-value">{service.title}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Datum & tid:</span>
              <span className="summary-value">
                {selectedDate.toLocaleDateString('sv-SE')} kl {selectedTime}
              </span>
            </div>
          </div>

          <div className="form-divider"></div>

          <h4>Dina uppgifter</h4>
          <div className="form-group">
            <label htmlFor="name">Namn*</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
              placeholder="Ditt fullständiga namn"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-post*</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              placeholder="din@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefonnummer</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              placeholder="070-1234567"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Beskriv ditt behov eller problem*</label>
            <textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              rows="3"
              placeholder="Beskriv kort vad du behöver hjälp med så vi kan förbereda oss bäst..."
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="cta-button primary submit-booking"
            disabled={isLoading}
          >
            {isLoading ? 'Bearbetar...' : 'Bekräfta bokning'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingWidget;