import React from 'react';

function MenuGrid({ items }) {
  if (items.length === 0) {
    return <p>No menu items match your filters.</p>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
      gap: '20px' 
    }}>
      {items.map((item, index) => (
        <div key={index} style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          textAlign: 'center' 
        }}>
          <h4>{item.name}</h4>
          <p>{item.description}</p>
          <p><strong>Station:</strong> {item.station}</p>
          <p><strong>Time:</strong> {item.timePeriod}</p>
          <p><strong>Allergens:</strong> {item.allergens.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default MenuGrid;