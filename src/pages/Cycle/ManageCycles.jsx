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
      cyclesData.sort((a, b) => a.order - b.order);
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

  const handleStartCycle = async (cycleId) => {
    try {
      const cycleToActivate = cycles.find(c => c.id === cycleId);
      const currentActiveCycle = cycles.find(c => c.is_active);
      
      const tempOrder = cycleToActivate.order;
      
      const updatedCycleToActivate = {
        ...cycleToActivate,
        order: currentActiveCycle?.order || 1,
        is_active: true,
        activated_at: new Date().toISOString()
      };
      
      const updatedCurrentCycle = {
        ...currentActiveCycle,
        order: tempOrder,
        is_active: false
      };
      
      await fetch(`${API_BASE_URL}/cycles?id=${cycleToActivate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCycleToActivate)
      });
      
      if (currentActiveCycle) {
        await fetch(`${API_BASE_URL}/cycles?id=${currentActiveCycle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCurrentCycle)
        });
      }
      
      fetchCycles();
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
        fetchCycles();
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
      order: cycle.order
    });
  };

  const handleSaveEdit = async (cycleId) => {
    if (!editFormData.name?.trim()) {
      alert('Cycle name is required');
      return;
    }
    if (editFormData.order < 1) {
      alert('Order must be at least 1');
      return;
    }
    try {
      const cycle = cycles.find(c => c.id === cycleId);
      const updatedCycle = {
        ...cycle,
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        order: editFormData.order
      };
      const response = await fetch(`${API_BASE_URL}/cycles?id=${cycleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCycle)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingCycleId(null);
      setEditFormData({});
      fetchCycles();
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
      const maxOrder = Math.max(...cycles.map(c => c.order), 0);
      
      const newCycle = {
        name: `${cycle.name} (Copy)`,
        description: cycle.description,
        order: maxOrder + 1,
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
      fetchCycles();
      alert(`Cycle duplicated as "${newCycle.name}"`);
    } catch (err) {
      alert('Failed to duplicate cycle. Please try again.');
      console.error(err);
    }
  };

  const handleMoveUp = async (cycle) => {
    const sortedCycles = [...cycles].sort((a, b) => a.order - b.order);
    const currentIndex = sortedCycles.findIndex(c => c.id === cycle.id);
    
    if (currentIndex > 0) {
      const temp = sortedCycles[currentIndex].order;
      sortedCycles[currentIndex].order = sortedCycles[currentIndex - 1].order;
      sortedCycles[currentIndex - 1].order = temp;
      
      try {
        await fetch(`${API_BASE_URL}/cycles?id=${sortedCycles[currentIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sortedCycles[currentIndex])
        });
        
        await fetch(`${API_BASE_URL}/cycles?id=${sortedCycles[currentIndex - 1].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sortedCycles[currentIndex - 1])
        });
        
        fetchCycles();
      } catch (err) {
        alert('Failed to reorder cycles');
        console.error(err);
      }
    }
  };

  const handleMoveDown = async (cycle) => {
    const sortedCycles = [...cycles].sort((a, b) => a.order - b.order);
    const currentIndex = sortedCycles.findIndex(c => c.id === cycle.id);
    
    if (currentIndex < sortedCycles.length - 1) {
      const temp = sortedCycles[currentIndex].order;
      sortedCycles[currentIndex].order = sortedCycles[currentIndex + 1].order;
      sortedCycles[currentIndex + 1].order = temp;
      
      try {
        await fetch(`${API_BASE_URL}/cycles?id=${sortedCycles[currentIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sortedCycles[currentIndex])
        });
        
        await fetch(`${API_BASE_URL}/cycles?id=${sortedCycles[currentIndex + 1].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sortedCycles[currentIndex + 1])
        });
        
        fetchCycles();
      } catch (err) {
        alert('Failed to reorder cycles');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading cycles...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Cycles</h1>
            <p className="text-gray-600 mt-1">Cycles rotate automatically every Saturday at midnight</p>
          </div>
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
          <div className="space-y-4">
            {cycles.map(cycle => {
              const isActive = cycle.is_active === true;
              const minOrder = Math.min(...cycles.map(c => c.order));
              const maxOrder = Math.max(...cycles.map(c => c.order));
              
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
                          Rotation Order
                        </label>
                        <input
                          type="number"
                          value={editFormData.order}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, order: parseInt(e.target.value) || 1 })
                          }
                          min="1"
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
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{cycle.name}</h3>
                          {cycle.description && (
                            <p className="text-gray-600 mb-3 text-sm">{cycle.description}</p>
                          )}
                        </div>
                        
                        {/* Up/Down Arrows */}
                        <div className="flex gap-1 ml-4">
                          <button
                            onClick={() => handleMoveUp(cycle)}
                            disabled={cycle.order === minOrder}
                            className={`w-10 h-10 flex items-center justify-center rounded text-white transition ${
                              cycle.order === minOrder
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                            title="Move up in rotation"
                          >
                            ⬆
                          </button>
                          <button
                            onClick={() => handleMoveDown(cycle)}
                            disabled={cycle.order === maxOrder}
                            className={`w-10 h-10 flex items-center justify-center rounded text-white transition ${
                              cycle.order === maxOrder
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                            title="Move down in rotation"
                          >
                            ⬇
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-1 text-sm">
                        <span className="font-semibold">Order:</span> {cycle.order}
                      </p>
                      {cycle.activated_at && (
                        <p className="text-gray-600 mb-4 text-sm">
                          <span className="font-semibold">Last Activated:</span>{' '}
                          {new Date(cycle.activated_at).toLocaleDateString()}
                        </p>
                      )}

                      <div className="flex gap-3 flex-wrap mt-4">
                        <button
                          onClick={() => handleConfigureCycle(cycle.id)}
                          className="flex-1 min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold text-sm transition"
                        >
                          ⚙️ Configure
                        </button>
                        {!isActive && (
                          <button
                            onClick={() => handleStartCycle(cycle.id)}
                            className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-sm transition"
                          >
                            ▶️ Start
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(cycle)}
                          className="flex-1 min-w-[100px] bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-semibold text-sm transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateCycle(cycle)}
                          className="flex-1 min-w-[100px] bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold text-sm transition"
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={() => handleDeleteCycle(cycle.id)}
                          className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-sm transition"
                        >
                          🗑️ Delete
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