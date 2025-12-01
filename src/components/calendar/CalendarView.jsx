import { useState, useMemo } from 'react';
import { isDateInRange } from '../../utils/dateUtils';

export default function CalendarView({ bookings }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendar = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isBooked = bookings.some(booking => 
        isDateInRange(date, booking.startDate, booking.endDate)
      );
      
      days.push({
        date,
        day,
        isBooked,
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }
    
    return days;
  }, [currentMonth, bookings]);

  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={previousMonth} className="btn btn-sm">←</button>
        <h3>{monthName}</h3>
        <button onClick={nextMonth} className="btn btn-sm">→</button>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color today"></span>
          <span>Today</span>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {calendar.map((day, idx) => (
            <div 
              key={idx} 
              className={`calendar-day ${!day ? 'empty' : ''} ${day?.isBooked ? 'booked' : 'available'} ${day?.isToday ? 'today' : ''}`}
            >
              {day && <span>{day.day}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
