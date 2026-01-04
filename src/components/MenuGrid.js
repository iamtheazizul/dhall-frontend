import React, { useState } from 'react';
import '../styles/MenuGrid.css';

// Dietary restriction icons mapping
const dietaryIcons = {
  'Vegetarian': '🥬',
  'Vegan': '🌱',
  'Gluten': '🌾',
  'Dairy': '🥛',
  'Eggs': '🥚',
  'Fish': '🐟',
  'Shellfish': '🦐',
  'Soy': '🫘',
  'Sesame': '🌰',
  'Halal': '☪️',
  'Pork': '🐷',
  'Spicy': '🌶️'
};

function MenuGrid({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredRestriction, setHoveredRestriction] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedItem(null);
    }
  };

  if (items.length === 0) {
    return <p>No menu items match your filters.</p>;
  }

  return (
    <>
      <div className="menu-grid">
        {items.map((item, index) => {
          // Get up to 3 dietary restrictions
          const displayRestrictions = item.allergens.slice(0, 3);
          
          return (
            <div
              key={`${item.name}-${index}`}
              onClick={() => handleCardClick(item)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(item)}
              role="button"
              tabIndex={0}
              className="menu-grid-item"
            >
              {/* Top: Food Name */}
              <div className="card-header">
                <h4 className="card-title">{item.name}</h4>
              </div>

              {/* Bottom: Dietary Icons (left) and Time (right) */}
              <div className="card-footer">
                {/* <div className="card-dietary-icons">
                  {displayRestrictions.map((restriction) => (
                    <span
                      key={restriction}
                      className="dietary-icon"
                      title={restriction}
                    >
                      {dietaryIcons[restriction] || '🏷️'}
                    </span>
                  ))}
                  {item.allergens.length > 3 && (
                    <span className="dietary-icon more-icon" title={`+${item.allergens.length - 3} more`}>
                      +{item.allergens.length - 3}
                    </span>
                  )}
                </div> */}
                <span className="card-time">{item.timePeriod}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className={`menu-grid-modal-background ${selectedItem ? 'open' : ''}`}
          onClick={handleCloseModal}
        >
          <div className={`menu-grid-modal-content ${selectedItem ? 'open' : ''}`}>
            <button
              className="menu-grid-modal-button absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-400 rounded p-1"
              onClick={() => setSelectedItem(null)}
              aria-label="Close modal"
            >
              &times;
            </button>            
            {/* Top Left: Food Name */}
            <div className="modal-header">
              <h2 className="modal-title">{selectedItem.name}</h2>
            </div>

            {/* Center: Description and Allergens */}
            <div className="modal-body">
              <p className="modal-description">{selectedItem.description}</p>
              
              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div className="modal-allergens">
                  <strong>Dietary Info:</strong>
                  <div className="allergen-tags-modal">
                    {selectedItem.allergens.map(allergen => (
                      <span
                        key={allergen}
                        className="allergen-tag-icon"
                        onMouseEnter={() => setHoveredRestriction(allergen)}
                        onMouseLeave={() => setHoveredRestriction(null)}
                      >
                        <span className="icon-large">{dietaryIcons[allergen] || '🏷️'}</span>
                        {hoveredRestriction === allergen && (
                          <span className="icon-tooltip">{allergen}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom: Station (left) and Time (right) */}
            <div className="modal-footer">
              <div className="modal-station">
                <span className="footer-label">Station</span>
                <span className="footer-value">{selectedItem.station}</span>
              </div>
              <div className="modal-time">
                <span className="footer-label">Available</span>
                <span className="footer-value">{selectedItem.timePeriod}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuGrid;