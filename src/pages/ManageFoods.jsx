import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ManageFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  const allergens = ['Fish', 'Shellfish', 'Soy', 'Eggs', 'Gluten', 'Dairy', 'Sesame', 'Halal', 'Pork', 'Spicy', 'Vegetarian', 'Vegan'];

  useEffect(() => {
    fetchFoods();
  }, []);

  // Add this to refetch whenever the page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchFoods();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://157.245.221.37:8080/foods');
      setFoods(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
      setLoading(false);
    }
  };

  const handleEdit = (food) => {
    setEditingId(food.id);
    setEditFormData(food);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://157.245.221.37:8080/foods/${editingId}`, editFormData);
      setFoods(foods.map(f => f.id === editingId ? editFormData : f));
      setEditingId(null);
      alert('Food item updated successfully!');
    } catch (error) {
      console.error('Failed to update food:', error);
      alert('Failed to update food item');
    }
  };

  const handleDelete = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`http://157.245.221.37:8080/foods/${foodId}`);
        setFoods(foods.filter(f => f.id !== foodId));
        alert('Food item deleted successfully!');
      } catch (error) {
        console.error('Failed to delete food:', error);
        alert('Failed to delete food item');
      }
    }
  };

  const handleRestrictionToggle = (restriction) => {
    setEditFormData(prev => {
      const restrictions = prev.Restrictions?.includes(restriction)
        ? prev.Restrictions.filter(r => r !== restriction)
        : [...(prev.Restrictions || []), restriction];
      return { ...prev, Restrictions: restrictions };
    });
  };

  if (loading) {
    return <div className="p-6">Loading food items...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Food Items</h1>
          <button
            onClick={() => navigate('/admin/food/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold"
          >
            + Add New Food
          </button>
        </div>

        {foods.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No food items found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {foods.map(food => (
              <div key={food.id} className="bg-white rounded-lg shadow-md p-6">
                {editingId === food.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={editFormData.Name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, Name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Ingredients</label>
                      <textarea
                        value={editFormData.Ingredients || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, Ingredients: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <div>
                      <span className="block text-gray-700 font-medium mb-2">Dietary Restrictions</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {allergens.map(restriction => (
                          <label key={restriction} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editFormData.Restrictions?.includes(restriction) || false}
                              onChange={() => handleRestrictionToggle(restriction)}
                              className="mr-2 h-4 w-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-600">{restriction}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{food.Name}</h3>
                      <p className="text-gray-600 mb-3">
                        <span className="font-semibold">Ingredients:</span> {food.Ingredients}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {food.Restrictions?.map(restriction => (
                          <span
                            key={restriction}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {restriction}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(food)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageFoods;