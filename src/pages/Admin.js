import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [formData, setFormData] = useState({
    Name: '',
    Ingredients: '',
    Restrictions: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const allergens = ['Fish', 'Shellfish', 'Soy', 'Eggs', 'Gluten', 'Dairy', 'Sesame', 'Halal', 'Pork', 'Spicy', 'Vegetarian', 'Vegan'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle restrictions (checkboxes)
  const handleRestrictionToggle = (restriction) => {
    setFormData(prev => {
      const restrictions = prev.Restrictions.includes(restriction)
        ? prev.Restrictions.filter(r => r !== restriction)
        : [...prev.Restrictions, restriction];
      return { ...prev, Restrictions: restrictions };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://157.245.221.37:8080/newFood', {
        ...formData,
        station: formData.station === "Emily's Garden" ? "Emily's" : formData.station // Map to server format
      });
      setSuccess('Menu item added successfully!');
      setError(null);
      setFormData({ Name: '', Ingredients: '', Restrictions: [] }); // Reset form
    } catch (err) {
      setError('Failed to add menu item');
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Menu Item</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="Name">
              Item Name
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="Ingredients">
              Ingredients
            </label>
            <textarea
              name="Ingredients"
              value={formData.Ingredients}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Restrictions */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Dietary Restrictions</label>
            <div className="grid grid-cols-2 gap-2">
              {allergens.map(restriction => (
                <label key={restriction} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.Restrictions.includes(restriction)}
                    onChange={() => handleRestrictionToggle(restriction)}
                    className="mr-2"
                  />
                  {restriction}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;