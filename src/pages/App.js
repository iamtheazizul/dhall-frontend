import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MenuGrid from '../components/MenuGrid';
import Slideshow from '../components/Slideshow';
import '../styles/index.css';
import HeaderComponent from '../components/HeaderComponent';

// Import images
import eventImage from '../assets/event_up2.jpg';
import rankingImage from '../assets/ranking_up2.jpg';
import themeImage from '../assets/theme_up2.jpg';


// Function flattens the menu data from JSON
function flattenMenuData(menuData) {
  return Object.keys(menuData).flatMap(timePeriod =>
    Object.keys(menuData[timePeriod]).flatMap(station =>
      menuData[timePeriod][station].map(item => ({
        name: item.Name,
        station: station === "Emily's" ? "Emily's Garden" : station,
        timePeriod,
        allergens: item.Restrictions,
        description: item.Ingredients,
      }))
    )
  );
}

// Function filtering menu items
function filterMenuItems(items, filters, searchTerm) {
  const { stations, times, allergens } = filters;
  return items.filter(item => {
    const stationMatch = stations.length === 0 || stations.includes(item.station);
    const timeMatch = times.length === 0 || times.includes(item.timePeriod);
    const allergenMatch = allergens.length === 0 || allergens.every(a => item.allergens.includes(a));
    
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.station.toLowerCase().includes(searchLower);
    
    return stationMatch && timeMatch && allergenMatch && searchMatch;
  });
}

// Main app
function App() {
  const [filters, setFilters] = useState({
    stations: [],
    times: [],
    allergens: [],
  });

  const [menuData, setMenuData] = useState({});
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stations = ['Diner', "Emily's Garden", 'Global'];
  const timePeriods = ['Breakfast', 'Lunch', 'Dinner'];
  const allergens = ['Fish', 'Shellfish', 'Soy', 'Eggs', 'Gluten', 'Dairy', 'Sesame', 'Halal', 'Pork', 'Spicy', 'Vegetarian', 'Vegan'];

  // Slideshow images using imported assets
  const slideshowImages = [
    {
      url: eventImage,
      alt: 'Event image',
      caption: 'Harry Potter Themed Dinner This Week'
    },
    {
      url: rankingImage,
      alt: 'Ranking image',
      caption: 'Skidmore Dining Services Ranks again in the Top 10'
    },
    {
      url: themeImage,
      alt: 'Theme image',
      caption: 'Free Dinner for Seniors (courtesy of SEC)'
    }
  ];

  // 1. Fetch menu data from the server
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
  const toggleFilter = (category, value) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[category];
      if (currentValues.includes(value)) {
        // Remove value
        return { 
          ...prevFilters, 
          [category]: currentValues.filter(v => v !== value) 
        };
      } else {
        // Add value
        return { 
          ...prevFilters, 
          [category]: [...currentValues, value] 
        };
      }
    });
  };

  // 2. Convert server data to flat array for filtering
  const flattenedMenu = flattenMenuData(menuData);

  // 3. Filter menu items based on selected criteria
  const filteredMenu = filterMenuItems(flattenedMenu, filters, searchTerm);

  // Group filtered menu by station
  const menuByStation = filteredMenu.reduce((acc, item) => {
    if (!acc[item.station]) {
      acc[item.station] = [];
    }
    acc[item.station].push(item);
    return acc;
  }, {});

  // Calculate active filter count
  const activeFilterCount = filters.stations.length + filters.times.length + filters.allergens.length;

  // Render stations and their menu items
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <Sidebar 
        stations={stations} 
        selectedStations={filters.stations} 
        onToggleStation={(station) => toggleFilter('stations', station)}
        timePeriods={timePeriods}
        selectedTimes={filters.times}
        onToggleTime={(time) => toggleFilter('times', time)}
        allergens={allergens}
        selectedAllergens={filters.allergens}
        onToggleAllergen={(allergen) => toggleFilter('allergens', allergen)}
        onCollapse={setIsSidebarCollapsed}
      />
      <main style={{ 
        flex: 1, 
        padding: '30px', 
        backgroundColor: '#f8f9fa',
        marginLeft: isSidebarCollapsed ? '0' : '280px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh'
      }}
      className="main-content"
      >
        {/* Header - Centered with Buttons*/}
        <HeaderComponent />

        {/* Slideshow */}
        <Slideshow images={slideshowImages} interval={5000} />

        {/* Search Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 40px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search menu items, ingredients, or stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 50px 16px 20px',
              fontSize: '16px',
              border: '2px solid #e5e5e5',
              borderRadius: '30px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#16a34a';
              e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e5e5';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          />
          <span style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            color: '#9ca3af',
            pointerEvents: 'none'
          }}>
            🔍
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '50px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c2c7'
          }}>
            {error}
          </div>
        )}

        {/* Menu Sections */}
        {filteredMenu.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍽️</div>
            <h2 style={{ color: '#6c757d', fontWeight: '600', marginBottom: '10px' }}>
              No items match your filters
            </h2>
            <p style={{ color: '#adb5bd' }}>
              Try adjusting your filter settings to see more items
            </p>
          </div>
        ) : (
          stations.map(station => (
            menuByStation[station] && menuByStation[station].length > 0 && (
              <section key={station} style={{ marginBottom: '50px' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  marginBottom: '20px', 
                  color: '#16a34a',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {station}
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6c757d',
                    backgroundColor: '#e9ecef',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    {menuByStation[station].length}
                  </span>
                </h2>
                {/* Horizontal Scrolling Container */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div 
                    className="menu-carousel"
                    style={{
                      display: 'flex',
                      gap: '20px',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      scrollBehavior: 'smooth',
                      paddingBottom: '10px',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e0 #f1f5f9'
                    }}
                  >
                    {menuByStation[station].map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        style={{
                          minWidth: '280px',
                          maxWidth: '280px',
                          flexShrink: 0
                        }}
                      >
                        <MenuGrid items={[item]} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          ))
        )}
      </main>
    </div>
  );
}

export default App;