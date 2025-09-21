import React, { useState } from 'react';
import Sidebar from './Sidebar';

function App() {
  const [selectedStations, setSelectedStations] = useState([]);

  const stations = ['Diner', "Emily's Garden", 'Global Cafe', 'Minus 9', 'The Noodle Bar', 'Bakery'];

  // Handler when user toggles a station checkbox
  const handleStationToggle = (station) => {
    setSelectedStations(prev => {
      if (prev.includes(station)) {
        // Remove station if already selected
        return prev.filter(s => s !== station);
      } else {
        // Add station if not selected
        return [...prev, station];
      }
    });
  };

  // Main display of code
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        stations={stations} 
        selectedStations={selectedStations} 
        onToggleStation={handleStationToggle} 
      />
      <div style={{ marginLeft: '20px', padding: '10px' }}>
        <h1>Selected Stations:</h1>
        <ul>
          {selectedStations.map(station => (
            <li key={station}>{station}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;