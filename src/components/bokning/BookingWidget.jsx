import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight, CalendarPlus } from 'phosphor-react';
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

  useEffect(() => {
    setIsConfirmed(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableTimes([]);
    setError(null);
  }, [service]);

  // --- HJÄLPFUNKTIONER ---
  
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const formatMonthYear = (date) => date.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });
  
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

  const getDurationInMinutes = (durationText) => {
    if (!durationText) return 60; 
    const text = durationText.toLowerCase();
    if (text.includes('15')) return 15;
    if (text.includes('30')) return 30;
    return 60;
  };

  // --- SKAPA GOOGLE KALENDER LÄNK ---
  const createGoogleCalendarLink = () => {
    if (!selectedDate || !selectedTime) return '';

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    const duration = getDurationInMinutes(service.duration);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const pad = (n) => n.toString().padStart(2, '0');
    
    const formatTime = (date) => {
      return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    };

    const startStr = formatTime(startDate);
    const endStr = formatTime(endDate);

    const title = encodeURIComponent(`Teknikhuset: ${service.title}`);
    const details = encodeURIComponent(`Tjänst: ${service.title}\nAdress: Teknikhuset Kalmar`);
    const location = encodeURIComponent('Teknikhuset Kalmar');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  };

  // --- API ANROP ---

  const fetchAvailableSlots = async (date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const durationMinutes = getDurationInMinutes(service.duration);

      const response = await fetch('/.netlify/functions/getAvailableSlots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateString,
          duration: durationMinutes
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
    setSelectedTime(null);
    fetchAvailableSlots(selected);

    setTimeout(() => {
      const timeSection = document.getElementById('time-section-anchor');
      if (timeSection) timeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeout(() => {
      const formSection = document.getElementById('form-section-anchor');
      if (formSection) formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableTimes([]);
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setError(null);
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

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;

      const bookingData = {
        date: localDateString,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.success) {
        setIsConfirmed(true);
        // FIX: Skrolla till bekräftelserutan i mitten av skärmen
        setTimeout(() => {
            const confirmationBox = document.querySelector('.booking-confirmation');
            if(confirmationBox) {
                confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
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

  // --- BEKRÄFTELSE-VY ---
  if (isConfirmed) {
    return (
      <div className="booking-confirmation">
        <div className="booking-confirmation__icon">✓</div>
        <h3>Tack för din bokning!</h3>
        
        {/* FIX: Uppdaterad text - Inget löfte om mejl */}
        <p>Din tid är nu registrerad för <strong>{formData.email}</strong>.</p>
        
        <p>Du är bokad för <strong>{service.title}</strong> ({getDurationInMinutes(service.duration)} min)</p>
        <p className="booking-confirmation__datetime">
          <strong>{selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} kl {selectedTime}</strong>
        </p>

        <a 
          href={createGoogleCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button secondary"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '20px',
            textDecoration: 'none'
          }}
        >
          <CalendarPlus size={20} />
          Lägg till i Google Kalender
        </a>

        <p className="booking-confirmation__closing">Vi ses snart på Teknikhuset Kalmar!</p>
        
        <div style={{ marginTop: '30px' }}>
            <button 
                onClick={handleReset} 
                className="cta-button primary"
                style={{ padding: '12px 24px' }}
            >
                Boka en till tid
            </button>
        </div>
      </div>
    );
  }

  // --- STANDARD-VY ---
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];
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
      {error && (
        <div className="booking-error">
          <p>{error}</p>
        </div>
      )}

      {/* KALENDER */}
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

      <div id="time-section-anchor" style={{ scrollMarginTop: '20px' }}></div>

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
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="time-no-slots">
              <p>Inga lediga tider som passar längden ({getDurationInMinutes(service.duration)} min).</p>
            </div>
          )}
        </div>
      )}

      <div id="form-section-anchor" style={{ scrollMarginTop: '20px' }}></div>

      {selectedTime && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <h4>Din bokningssammanfattning</h4>
          
          <div className="booking-summary">
            <div className="summary-item">
              <span className="summary-label">Tjänst:</span>
              <span className="summary-value">{service.title}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tid:</span>
              <span className="summary-value">
                {selectedDate.toLocaleDateString('sv-SE')} kl {selectedTime}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Längd:</span>
              <span className="summary-value">{getDurationInMinutes(service.duration)} min</span>
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
              placeholder="Beskriv kort vad du behöver hjälp med..."
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