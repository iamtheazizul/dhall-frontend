import React, { useState } from 'react';
import '../styles/MenuGrid.css'; // Import the CSS file

function MenuGrid({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

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
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => handleCardClick(item)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(item)}
            role="button"
            tabIndex={0}
            className="menu-grid-item"
          >
            <h4 style={{ margin: '0', padding: '10px 0' }}>{item.name}</h4>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className={`menu-grid-modal-background ${selectedItem ? 'open' : ''}`} // Conditionally apply "open" class
          onClick={handleCloseModal}
        >
          <div
            className={`menu-grid-modal-content ${selectedItem ? 'open' : ''}`} // Conditionally apply "open" class
          >
            <button
              className="menu-grid-modal-button"
              onClick={() => setSelectedItem(null)}
            >
              &times;
            </button>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
            <p>
              <strong>Station:</strong> {selectedItem.station}
            </p>
            <p>
              <strong>Time:</strong> {selectedItem.timePeriod}
            </p>
            <p>
              <strong>Allergens:</strong> {selectedItem.allergens.join(', ')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuGrid;