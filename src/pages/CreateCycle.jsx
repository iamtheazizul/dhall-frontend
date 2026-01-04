import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCycle() {
  const [cycleName, setCycleName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!cycleName.trim() || !startDate || !endDate) {
      setError('All fields are required');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);

    try {
      // Create new cycle object
      const newCycle = {
        id: Date.now(),
        name: cycleName.trim(),
        startDate,
        endDate,
        createdAt: new Date().toISOString()
      };

      // Get existing cycles
      const existingCycles = JSON.parse(localStorage.getItem('cycles') || '[]');
      
      // Check for duplicate names
      if (existingCycles.some(c => c.name.toLowerCase() === cycleName.toLowerCase())) {
        setError('A cycle with this name already exists');
        setLoading(false);
        return;
      }

      // Add new cycle
      existingCycles.push(newCycle);
      localStorage.setItem('cycles', JSON.stringify(existingCycles));

      setSuccess('Cycle created successfully! Redirecting...');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/admin/cycle/manage');
      }, 1500);
    } catch (err) {
      setError('Failed to create cycle. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Cycle</h1>
        <p className="text-gray-600 mb-8">Set up a new menu cycle with start and end dates</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cycle Name */}
          <div>
            <label htmlFor="cycleName" className="block text-gray-700 font-medium mb-2">
              Cycle Name *
            </label>
            <input
              type="text"
              id="cycleName"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g., Fall 2024 Menu, Winter Break Menu"
              required
              disabled={loading}
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              disabled={loading}
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 rounded-md font-semibold transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Creating...' : 'Create Cycle'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/cycle/manage')}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-md font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          After creating a cycle, you'll be able to configure its menu items.
        </p>
      </div>
    </div>
  );
}

export default CreateCycle;