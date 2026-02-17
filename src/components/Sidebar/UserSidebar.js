import React, { useState } from 'react';
import '../../styles/Sidebar.css';

function UserSidebar({
  stations,
  selectedStations,
  onToggleStation,
  timePeriods,
  selectedTimes,
  onToggleTime,
  allergens,
  selectedAllergens,
  onToggleAllergen,
  onCollapse,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  return (
    <>
      {/* Toggle Button - Outside sidebar for better positioning */}
      <button 
        className={`sidebar-toggle ${isCollapsed ? 'collapsed' : 'expanded'}`}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="toggle-icon">
          {isCollapsed ? '»' : '«'}
        </span>
      </button>

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        {/* Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span className="icon">🍽️</span>
            <span className="text">Filters</span>
          </h2>
        </div>

        {/* Stations */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="icon">📍</span>
            <span className="text">Stations</span>
          </h3>
          <div className="filter-options">
            {stations.map((station) => (
              <label key={station} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedStations.includes(station)}
                  onChange={() => onToggleStation(station)}
                  className="filter-checkbox"
                />
                <span className="checkmark"></span>
                <span className="label-text">{station}</span>
                {selectedStations.includes(station) && (
                  <span className="badge">{selectedStations.filter(s => s === station).length}</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Time Periods */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="icon">⏰</span>
            <span className="text">Time Periods</span>
          </h3>
          <div className="filter-options">
            {timePeriods.map((time) => (
              <label key={time} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedTimes.includes(time)}
                  onChange={() => onToggleTime(time)}
                  className="filter-checkbox"
                />
                <span className="checkmark"></span>
                <span className="label-text">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergens */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="icon">🏷️</span>
            <span className="text">Dietary Info</span>
          </h3>
          <div className="filter-options">
            {allergens.map((allergen) => (
              <label key={allergen} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedAllergens.includes(allergen)}
                  onChange={() => onToggleAllergen(allergen)}
                  className="filter-checkbox"
                />
                <span className="checkmark"></span>
                <span className="label-text">{allergen}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear All Button */}
        <div className="sidebar-footer">
          <button 
            className="clear-button"
            onClick={() => {
              selectedStations.forEach(s => onToggleStation(s));
              selectedTimes.forEach(t => onToggleTime(t));
              selectedAllergens.forEach(a => onToggleAllergen(a));
            }}
            disabled={selectedStations.length === 0 && selectedTimes.length === 0 && selectedAllergens.length === 0}
          >
            <span className="text">Clear All Filters</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

export default UserSidebar;