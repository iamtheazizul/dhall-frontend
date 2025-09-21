// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import MenuGrid from './MenuGrid'; // New import

// function App() {
//   const [selectedStations, setSelectedStations] = useState([]);
//   const [selectedTimes, setSelectedTimes] = useState([]);
//   const [selectedAllergens, setSelectedAllergens] = useState([]);

//   const stations = ['Diner', "Emily's Garden", 'Global Cafe', 'Minus 9', 'The Noodle Bar', 'Bakery'];
//   const timePeriods = ['Breakfast', 'Lunch', 'Dinner', 'Late Night'];
//   const allergens = ['Fish', 'Shellfish', 'Soy', 'Eggs', 'Gluten', 'Dairy', 'Sesame', 'Halal', 'Pork', 'Spicy', 'Vegetarian', 'Vegan'];

//   // Sample menu data (unchanged)
//   const menuData = [
//     {
//       name: 'Oven Roasted Vegetable Jambalaya',
//       station: "Emily's Garden",
//       timePeriod: 'Lunch',
//       allergens: ['Vegetarian', 'Vegan'],
//       description: 'A hearty mix of veggies with tofu bacon.'
//     },
//     {
//       name: 'Slow Simmered Seafood Gumbo',
//       station: 'Global Cafe',
//       timePeriod: 'Dinner',
//       allergens: ['Fish', 'Shellfish'],
//       description: 'Rich seafood stew with andouille sausage.'
//     },
//     {
//       name: 'Holy Trinity of Vegetables',
//       station: 'Global Cafe',
//       timePeriod: 'Lunch',
//       allergens: ['Vegetarian'],
//       description: 'Onions, celery, and bell peppers in a savory sauce.'
//     },
//     {
//       name: 'Sweet Crab and Tender Lobster',
//       station: 'Global Cafe',
//       timePeriod: 'Dinner',
//       allergens: ['Shellfish'],
//       description: 'Fresh seafood delight.'
//     },
//     {
//       name: 'Chicken & Dumpling Bar',
//       station: 'Diner',
//       timePeriod: 'Lunch',
//       allergens: ['Gluten', 'Dairy'],
//       description: 'Comfort food with house-made gravy.'
//     },
//   ];

//   // Handlers (unchanged)
//   const handleStationToggle = (station) => {
//     setSelectedStations(prev => {
//       if (prev.includes(station)) {
//         return prev.filter(s => s !== station);
//       } else {
//         return [...prev, station];
//       }
//     });
//   };

//   const handleTimeToggle = (time) => {
//     setSelectedTimes(prev => {
//       if (prev.includes(time)) {
//         return prev.filter(t => t !== time);
//       } else {
//         return [...prev, time];
//       }
//     });
//   };

//   const handleAllergenToggle = (allergen) => {
//     setSelectedAllergens(prev => {
//       if (prev.includes(allergen)) {
//         return prev.filter(a => a !== allergen);
//       } else {
//         return [...prev, allergen];
//       }
//     });
//   };

//   // Updated filtering logic: Show all if no filters, match all selected criteria
//   const filteredMenu = menuData.filter(item => {
//     const stationMatch = selectedStations.length === 0 || selectedStations.includes(item.station);
//     const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(item.timePeriod);
//     const allergenMatch = selectedAllergens.length === 0 || selectedAllergens.every(a => item.allergens.includes(a)); // Show only if item has ALL selected allergens
//     return stationMatch && timeMatch && allergenMatch;
//   });

//   // Main display updated to show filtered menu items
//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar 
//         stations={stations} 
//         selectedStations={selectedStations} 
//         onToggleStation={handleStationToggle}
//         timePeriods={timePeriods}
//         selectedTimes={selectedTimes}
//         onToggleTime={handleTimeToggle}
//         allergens={allergens}
//         selectedAllergens={selectedAllergens}
//         onToggleAllergen={handleAllergenToggle}
//       />
//       <div style={{ marginLeft: '20px', padding: '10px', flex: 1 }}> {/* Added flex: 1 for better spacing */}
//         <h1>Menu Items:</h1>
//         <MenuGrid items={filteredMenu} />
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from the endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get('http://157.245.221.37:8080/');
        setMessage(response.data); // Store the response data
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to fetch data from the server');
        console.error(err);
      }
    };

    fetchData(); // Call the function
  }, []); // Empty dependency array to run once on mount

  return (
    <div>
      <h1>Dhall Backend Response</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{message || 'Loading...'}</p>
      )}
    </div>
  );
}

export default App;