import React from 'react';

function Sidebar({ stations, selectedStations, onToggleStation }) {
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
    </div>
  );
}

export default Sidebar;