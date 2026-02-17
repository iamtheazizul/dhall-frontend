import React from 'react';
import '../../styles/HeaderComponent.css';

function HeaderComponent() {
  return (
    <div className="header-container">
      <h1 className="header-title">Today's Menu</h1>
      <div className="header-buttons">
        <button className="header-button">Hours</button>
        <button className="header-button">Calendar</button>
      </div>
    </div>
  );
}

export default HeaderComponent;