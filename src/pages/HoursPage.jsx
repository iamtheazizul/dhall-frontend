import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HoursPage.css';

function HoursPage() {
  const navigate = useNavigate();

  const hours = [
    { day: 'Monday', breakfast: '7:00 AM - 11:00 AM', lunch: '11:00 AM - 2:00 PM', dinner: '5:00 PM - 8:00 PM', late_night: '8:00 PM - 10:00 PM' },
    { day: 'Tuesday', breakfast: '7:00 AM - 10:30 AM', lunch: '11:00 AM - 2:00 PM', dinner: '5:00 PM - 8:00 PM', late_night: '8:00 PM - 10:00 PM' },
    { day: 'Wednesday', breakfast: '7:00 AM - 10:30 AM', lunch: '11:00 AM - 2:00 PM', dinner: '5:00 PM - 8:00 PM', late_night: '8:00 PM - 10:00 PM' },
    { day: 'Thursday', breakfast: '7:00 AM - 10:30 AM', lunch: '11:00 AM - 2:00 PM', dinner: '5:00 PM - 8:00 PM', late_night: '8:00 PM - 10:00 PM' },
    { day: 'Friday', breakfast: '7:00 AM - 10:30 AM', lunch: '11:00 AM - 2:00 PM', dinner: '5:00 PM - 8:00 PM' },
    { day: 'Saturday', breakfast: '8:00 AM - 11:00 AM', lunch: '12:00 PM - 3:00 PM', dinner: '5:00 PM - 8:00 PM' },
    { day: 'Sunday', breakfast: '8:00 AM - 11:00 AM', lunch: '12:00 PM - 3:00 PM', dinner: '5:00 PM - 8:00 PM', late_night: '8:00 PM - 10:00 PM' },
  ];

  const stations = [
    { name: "Diner", hours: '7:00 AM - 8:00 PM' },
    { name: "Emily's Garden", hours: '7:00 AM - 8:00 PM' },
    { name: 'Global/Noodle Bar', hours: '11:00 AM - 8:00 PM' },
    { name: 'Minus 9', hours: '5:00 PM - 8:00 PM' },
    { name: 'The Corner Deli', hours: '7:00 AM - 8:00 PM' },
    { name: "Supremo's", hours: '11:00 AM - 8:00 PM' },
  ];

  return (
    <div className="hours-page-container">
      <div className="hours-page">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Menu
        </button>

        <h1 className="hours-title">Dining Hours</h1>

        {/* Daily Hours */}
        <section className="hours-section">
          <h2 className="hours-section-title">Daily Hours</h2>
          <div className="hours-grid">
            {hours.map((day, index) => (
              <div key={index} className="hours-card">
                <h3 className="day-name">{day.day}</h3>
                <div className="meal-times">
                  <div className="meal">
                    <span className="meal-label">Breakfast</span>
                    <span className="meal-time">{day.breakfast}</span>
                  </div>
                  <div className="meal">
                    <span className="meal-label">Lunch</span>
                    <span className="meal-time">{day.lunch}</span>
                  </div>
                  <div className="meal">
                    <span className="meal-label">Dinner</span>
                    <span className="meal-time">{day.dinner}</span>
                  </div>
                  <div className="meal">
                    <span className="meal-label">Late Night</span>
                    <span className="meal-time">{day.late_night}</span>
                  </div>                
                  </div>
              </div>
            ))}
          </div>
        </section>

        {/* Station Hours */}
        <section className="hours-section">
          <h2 className="hours-section-title">Station Hours</h2>
          <div className="stations-grid">
            {stations.map((station, index) => (
              <div key={index} className="station-card">
                <h3 className="station-name">{station.name}</h3>
                <p className="station-hours">{station.hours}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HoursPage;