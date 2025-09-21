import React from 'react';

function Sidebar({ stations, selectedStations, onToggleStation, timePeriods, selectedTimes, onToggleTime, allergens, selectedAllergens, onToggleAllergen }) {
  return (
    <div style={{ width: '250px', backgroundColor: 'green', color: 'white', padding: '15px' }}>
      <h3>Station</h3>
      {stations.map(station => (
        <div key={station}>
          <label>
            <input 
              type="checkbox" 
              checked={selectedStations.includes(station)} 
              onChange={() => onToggleStation(station)} 
            />
            {' '}
            {station}
          </label>
        </div>
      ))}

      <h3 style={{ marginTop: '20px' }}>Time Period</h3>
      {timePeriods.map(time => (
        <div key={time}>
          <label>
            <input 
              type="checkbox" 
              checked={selectedTimes.includes(time)} 
              onChange={() => onToggleTime(time)} 
            />
            {' '}
            {time}
          </label>
        </div>
      ))}

      <h3 style={{ marginTop: '20px' }}>Allergens</h3> {/* New section */}
      {allergens.map(allergen => (
        <div key={allergen}>
          <label>
            <input 
              type="checkbox" 
              checked={selectedAllergens.includes(allergen)} 
              onChange={() => onToggleAllergen(allergen)} 
            />
            {' '}
            {allergen}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;