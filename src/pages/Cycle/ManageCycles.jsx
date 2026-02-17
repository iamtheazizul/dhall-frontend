import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

function ManageCycles() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCycleId, setEditingCycleId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/cycles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cyclesData = await response.json();
      setCycles(cyclesData);
    } catch (err) {
      setError('Failed to load cycles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureCycle = (cycleId) => {
    navigate(`/admin/cycle/${cycleId}/configure`);
  };

  // Optimized: Update active cycle in backend
  const handleStartCycle = async (cycleId) => {
    try {
      // First, deactivate all cycles
      const deactivatePromises = cycles
        .filter(c => c.is_active)
        .map(c =>
          fetch(`${API_BASE_URL}/cycles?id=${c.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...c, is_active: false })
          })
        );

      await Promise.all(deactivatePromises);

      // Then activate the selected cycle
      const cycleToActivate = cycles.find(c => c.id === cycleId);
      const response = await fetch(`${API_BASE_URL}/cycles?id=${cycleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cycleToActivate, is_active: true })
      });

      if (!response.ok) {
        throw new Error('Failed to set active cycle');
      }

      // Update local state
      const updatedCycles = cycles.map(c => ({
        ...c,
        is_active: c.id === cycleId
      }));
      setCycles(updatedCycles);
      alert('Cycle set as active!');
    } catch (err) {
      alert('Failed to set active cycle. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteCycle = async (cycleId) => {
    if (window.confirm('Are you sure you want to delete this cycle? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/cycles?id=${cycleId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedCycles = cycles.filter(c => c.id !== cycleId);
        setCycles(updatedCycles);
      } catch (err) {
        alert('Failed to delete cycle. Please try again.');
        console.error(err);
      }
    }
  };

  const handleEditClick = (cycle) => {
    setEditingCycleId(cycle.id);
    setEditFormData({
      name: cycle.name,
      description: cycle.description,
      start_date: cycle.start_date.split('T')[0],
      end_date: cycle.end_date.split('T')[0]
    });
  };

  const handleSaveEdit = async (cycleId) => {
    if (!editFormData.name?.trim()) {
      alert('Cycle name is required');
      return;
    }
    if (new Date(editFormData.start_date) >= new Date(editFormData.end_date)) {
      alert('Start date must be before end date');
      return;
    }
    try {
      const cycle = cycles.find(c => c.id === cycleId);
      const updatedCycle = {
        ...cycle,
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        start_date: new Date(editFormData.start_date).toISOString().split('T')[0] + 'T00:00:00Z',
        end_date: new Date(editFormData.end_date).toISOString().split('T')[0] + 'T23:59:59Z'
      };
      const response = await fetch(`${API_BASE_URL}/cycles?id=${cycleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCycle)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCycleData = await response.json();
      const updatedCycles = cycles.map(c =>
        c.id === cycleId ? updatedCycleData : c
      );
      setCycles(updatedCycles);
      setEditingCycleId(null);
      setEditFormData({});
    } catch (err) {
      alert('Failed to update cycle. Please try again.');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingCycleId(null);
    setEditFormData({});
  };

  const handleDuplicateCycle = async (cycle) => {
    try {
      const newCycle = {
        name: `${cycle.name} (Copy)`,
        description: cycle.description,
        start_date: cycle.start_date,
        end_date: cycle.end_date,
        is_active: false,
        days: cycle.days || []
      };
      const response = await fetch(`${API_BASE_URL}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCycle)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdCycle = await response.json();
      setCycles([...cycles, createdCycle]);
      alert(`Cycle duplicated successfully as "${createdCycle.name}"`);
    } catch (err) {
      alert('Failed to duplicate cycle. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading cycles...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Cycles</h1>
          <button
            onClick={() => navigate('/admin/cycle/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition"
          >
            + Add New Cycle
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={fetchCycles}
              className="ml-4 underline font-semibold hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {cycles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No cycles found. Create one to get started!</p>
            <button
              onClick={() => navigate('/admin/cycle/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold"
            >
              Create First Cycle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cycles.map(cycle => {
              const isActive = cycle.is_active === true;
              
              return (
                <div
                  key={cycle.id}
                  className={`rounded-lg shadow-md p-6 border-l-4 transition ${
                    isActive
                      ? 'bg-green-50 border-l-green-500'
                      : 'bg-white border-l-blue-500'
                  }`}
                >
                  {isActive && (
                    <div className="mb-4 inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">
                      ✓ ACTIVE
                    </div>
                  )}

                  {editingCycleId === cycle.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Cycle Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={editFormData.start_date}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, start_date: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={editFormData.end_date}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, end_date: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(cycle.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-sm transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md font-semibold text-sm transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display View
                    <>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{cycle.name}</h3>
                      {cycle.description && (
                        <p className="text-gray-600 mb-3 text-sm">{cycle.description}</p>
                      )}
                      <p className="text-gray-600 mb-1">
                        <span className="font-semibold">Start Date:</span>{' '}
                        {new Date(cycle.start_date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 mb-4">
                        <span className="font-semibold">End Date:</span>{' '}
                        {new Date(cycle.end_date).toLocaleDateString()}
                      </p>

                      <div className="flex gap-3 flex-wrap mt-4">
                        <button
                          onClick={() => handleConfigureCycle(cycle.id)}
                          className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold text-sm transition"
                          title="Configure this cycle"
                        >
                          ⚙️ Configure
                        </button>

                        {!isActive && (
                          <button
                            onClick={() => handleStartCycle(cycle.id)}
                            className="flex items-center justify-center gap-2 flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-sm transition"
                            title="Set as active cycle"
                          >
                            ▶️ Start
                          </button>
                        )}

                        <button
                          onClick={() => handleEditClick(cycle)}
                          className="flex items-center justify-center w-10 h-10 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-semibold transition"
                          title="Edit cycle"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDuplicateCycle(cycle)}
                          className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition"
                          title="Duplicate this cycle"
                        >
                          📋
                        </button>

                        <button
                          onClick={() => handleDeleteCycle(cycle.id)}
                          className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition"
                          title="Delete this cycle"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCycles;