import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MenuGrid from '../components/MenuGrid';

function App() {
  const [selectedStations, setSelectedStations] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [menuData, setMenuData] = useState({});
  const [error, setError] = useState(null);

  const stations = ['Diner', "Emily's Garden", 'Global'];
  const timePeriods = ['Breakfast', 'Lunch', 'Dinner'];
  const allergens = ['Fish', 'Shellfish', 'Soy', 'Eggs', 'Gluten', 'Dairy', 'Sesame', 'Halal', 'Pork', 'Spicy', 'Vegetarian', 'Vegan'];

  // Fetch menu data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://157.245.221.37:8080/daily');
        setMenuData(response.data.Data); // Store the Data portion of the response
        setError(null);
      } catch (err) {
        setError('Failed to fetch data from the server');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Handlers for filter toggles
  const handleStationToggle = (station) => {
    setSelectedStations(prev => 
      prev.includes(station) 
        ? prev.filter(s => s !== station) 
        : [...prev, station]
    );
  };

  const handleTimeToggle = (time) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time) 
        : [...prev, time]
    );
  };

  const handleAllergenToggle = (allergen) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen) 
        : [...prev, allergen]
    );
  };

  // Convert server data to flat array for filtering
  const flattenedMenu = Object.keys(menuData).flatMap(timePeriod => 
    Object.keys(menuData[timePeriod]).flatMap(station => 
      menuData[timePeriod][station].map(item => ({
        name: item.Name,
        station: station === "Emily's" ? "Emily's Garden" : station, // Map server station name to display name
        timePeriod,
        allergens: item.Restrictions,
        description: item.Ingredients
      }))
    )
  );

  // Filter menu items based on selected criteria
  const filteredMenu = flattenedMenu.filter(item => {
    const stationMatch = selectedStations.length === 0 || selectedStations.includes(item.station);
    const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(item.timePeriod);
    const allergenMatch = selectedAllergens.length === 0 || selectedAllergens.every(a => item.allergens.includes(a));
    return stationMatch && timeMatch && allergenMatch;
  });

  // Group filtered menu by station
  const menuByStation = filteredMenu.reduce((acc, item) => {
    if (!acc[item.station]) {
      acc[item.station] = [];
    }
    acc[item.station].push(item);
    return acc;
  }, {});

  // Render stations and their menu items
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar 
        stations={stations} 
        selectedStations={selectedStations} 
        onToggleStation={handleStationToggle}
        timePeriods={timePeriods}
        selectedTimes={selectedTimes}
        onToggleTime={handleTimeToggle}
        allergens={allergens}
        selectedAllergens={selectedAllergens}
        onToggleAllergen={handleAllergenToggle}
      />
      <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Menu Items</h1>
        {stations.map(station => (
          menuByStation[station] && menuByStation[station].length > 0 && (
            <div key={station} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#007bff' }}>{station}</h2>
              <MenuGrid items={menuByStation[station]} />
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default App;