import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageCycles() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCycleId, setActiveCycleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cycles from localStorage (replace with API call)
    const existingCycles = JSON.parse(localStorage.getItem('cycles') || '[]');
    setCycles(existingCycles);
    
    // Get active cycle
    const activeId = localStorage.getItem('activeCycleId');
    setActiveCycleId(activeId);
    
    setLoading(false);
  }, []);

  const handleConfigureCycle = (cycleId) => {
    // Navigate to AdminCycle.js with the selected cycle
    navigate(`/admin/cycle/configure/${cycleId}`);
  };

  const handleDeleteCycle = (cycleId) => {
    if (window.confirm('Are you sure you want to delete this cycle? This action cannot be undone.')) {
      const updatedCycles = cycles.filter(c => c.id !== cycleId);
      setCycles(updatedCycles);
      localStorage.setItem('cycles', JSON.stringify(updatedCycles));
      
      // If deleted cycle was active, clear it
      if (activeCycleId === cycleId) {
        localStorage.removeItem('activeCycleId');
        localStorage.removeItem('activeCycle');
        setActiveCycleId(null);
      }
    }
  };

  const handleSetActive = (cycleId, cycleName) => {
    localStorage.setItem('activeCycleId', cycleId);
    localStorage.setItem('activeCycle', cycleName);
    setActiveCycleId(cycleId);
    alert(`"${cycleName}" is now the active cycle!`);
  };

  const handleEditCycle = (cycle) => {
    const newName = prompt('Enter new cycle name:', cycle.name);
    if (newName && newName.trim()) {
      const updatedCycles = cycles.map(c =>
        c.id === cycle.id ? { ...c, name: newName.trim() } : c
      );
      setCycles(updatedCycles);
      localStorage.setItem('cycles', JSON.stringify(updatedCycles));
      
      // Update active cycle name if it's the active one
      if (activeCycleId === cycle.id) {
        localStorage.setItem('activeCycle', newName.trim());
      }
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
            {cycles.map(cycle => (
              <div
                key={cycle.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition ${
                  activeCycleId === String(cycle.id) || activeCycleId === cycle.id
                    ? 'border-green-500 ring-2 ring-green-200'
                    : 'border-blue-500'
                }`}
              >
                {/* Active Badge */}
                {(activeCycleId === String(cycle.id) || activeCycleId === cycle.id) && (
                  <div className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mb-3">
                    ✓ ACTIVE
                  </div>
                )}

                {/* Cycle Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{cycle.name}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Start Date:</span> {cycle.startDate}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">End Date:</span> {cycle.endDate}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleConfigureCycle(cycle.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold text-sm transition"
                    title="Set up menu items for this cycle"
                  >
                    Configure Menu
                  </button>

                  {(activeCycleId !== String(cycle.id) && activeCycleId !== cycle.id) && (
                    <button
                      onClick={() => handleSetActive(cycle.id, cycle.name)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-sm transition"
                      title="Set this as the active cycle"
                    >
                      Set Active
                    </button>
                  )}

                  <button
                    onClick={() => handleEditCycle(cycle)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-semibold text-sm transition"
                    title="Edit cycle name"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCycle(cycle.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-sm transition"
                    title="Delete this cycle"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCycles;