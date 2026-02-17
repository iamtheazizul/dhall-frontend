import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCycle() {
  const [cycleName, setCycleName] = useState('');
  const [description, setDescription] = useState('');
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
      setError('Cycle name, start date, and end date are required');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      const newCycle = {
        name: cycleName.trim(),
        description: description.trim(),
        start_date: new Date(startDate).toISOString().split('T')[0] + 'T00:00:00Z',
        end_date: new Date(endDate).toISOString().split('T')[0] + 'T23:59:59Z',
        foods: []
      };

      const response = await fetch('http://localhost:8080/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCycle)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const createdCycle = await response.json();
      setSuccess('Cycle created successfully! Redirecting...');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/admin/cycle/manage');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create cycle. Please try again.');
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
              placeholder="e.g., Fall 2025 Week 1"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="e.g., Additional details about this cycle"
              rows="3"
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
          After creating a cycle, you'll be able to add food items and assign them to mealtimes.
        </p>
      </div>
    </div>
  );
}

export default CreateCycle;