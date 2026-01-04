import React, { useState, useRef, useEffect } from 'react';
import FoodPickerModal from '../components/FoodPickerModal';

const dummyFood = [
  { id: 1, name: 'Grilled Chicken' },
  { id: 2, name: 'Veggie Burger' },
  { id: 3, name: 'Caesar Salad' },
  { id: 4, name: 'Pancakes' },
  { id: 5, name: 'Spaghetti' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealPeriods = ['Breakfast', 'Lunch', 'Dinner'];
const stations = ['Diner', "Emily's Garden", 'Global'];

function AdminCycle() {
  // State for cycle selections
  const [selections, setSelections] = useState({});

  // State to track expanded days and meals (start fully collapsed)
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [expandedMeals, setExpandedMeals] = useState(new Set()); // tracks "day--meal" keys

  // State for modal picker
  const [modalData, setModalData] = useState({ open: false, day: null, meal: null, station: null });

  // Refs for each day to enable smooth scroll
  const dayRefs = useRef({});

  // Toggle day expand/collapse
  const toggleDay = (day) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) newSet.delete(day);
      else newSet.add(day);
      return newSet;
    });
  };

  // Toggle meal expand/collapse
  const mealKey = (day, meal) => `${day}--${meal}`;
  const toggleMeal = (day, meal) => {
    setExpandedMeals(prev => {
      const newSet = new Set(prev);
      const key = mealKey(day, meal);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  // Add food to selections
  const addFood = (day, meal, station, foodId) => {
    setSelections(prev => {
      const dayObj = prev[day] || {};
      const mealObj = dayObj[meal] || {};
      const stationFoods = mealObj[station] || [];

      if (stationFoods.includes(foodId)) return prev;

      return {
        ...prev,
        [day]: {
          ...dayObj,
          [meal]: {
            ...mealObj,
            [station]: [...stationFoods, foodId],
          },
        },
      };
    });
  };

  // Remove food from selections
  const removeFood = (day, meal, station, foodId) => {
    setSelections(prev => {
      const dayObj = prev[day] || {};
      const mealObj = dayObj[meal] || {};
      const stationFoods = mealObj[station] || [];

      return {
        ...prev,
        [day]: {
          ...dayObj,
          [meal]: {
            ...mealObj,
            [station]: stationFoods.filter(id => id !== foodId),
          },
        },
      };
    });
  };

  // Scroll to day on nav click
  const scrollToDay = (day) => {
    const el = dayRefs.current[day];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Save handler (demo alert)
  const onSave = () => {
    console.log('Saving cycle selections:', selections);
    alert('Cycle saved! Check console for data.');
    // TODO: send selections to your backend API here
  };

  // Close modal
  const closeModal = () => setModalData({ open: false, day: null, meal: null, station: null });

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto mb-10">
        {/* Header and day nav side-by-side */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Menu Cycle Setup
          </h1>
          <nav className="flex gap-2 flex-wrap">
            {days.map(day => (
              <button
                key={day}
                onClick={() => scrollToDay(day)}
                className="text-gray-700 hover:text-blue-600 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-3 py-1 whitespace-nowrap"
                aria-label={`Scroll to ${day}`}
              >
                {day}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {days.map(day => (
          <section
            key={day}
            ref={el => (dayRefs.current[day] = el)}
            className="mb-10 scroll-mt-32"
            aria-labelledby={`day-${day}`}
          >
            <h2
              id={`day-${day}`}
              className="text-2xl font-semibold text-blue-700 mb-3 flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleDay(day)}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleDay(day)}
              aria-expanded={expandedDays.has(day)}
              role="button"
            >
              {day}
              <span className="text-xl font-bold mr-2">{expandedDays.has(day) ? '−' : '+'}</span>
            </h2>

            {expandedDays.has(day) && mealPeriods.map(meal => {
              const mKey = mealKey(day, meal);
              const isMealExpanded = expandedMeals.has(mKey);

              return (
                <section key={meal} aria-labelledby={`${day}-${meal}`} className="ml-6 mb-6">
                  <h3
                    id={`${day}-${meal}`}
                    className="text-xl font-semibold text-indigo-600 mb-2 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => toggleMeal(day, meal)}
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleMeal(day, meal)}
                    aria-expanded={isMealExpanded}
                    role="button"
                  >
                    {meal}
                    <span className="text-lg font-bold mr-2">{isMealExpanded ? '−' : '+'}</span>
                  </h3>

                  {isMealExpanded && stations.map(station => (
                    <div key={station} className="ml-6 mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">{station}</h4>
                      <div className="flex flex-wrap gap-3 items-center">
                        {(selections[day]?.[meal]?.[station] || []).map(foodId => {
                          const foodItem = dummyFood.find(f => f.id === foodId);
                          return (
                            <div
                              key={foodId}
                              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded shadow-sm"
                            >
                              <span>{foodItem?.name}</span>
                              <button
                                onClick={() => removeFood(day, meal, station, foodId)}
                                aria-label={`Remove ${foodItem?.name}`}
                                className="text-blue-600 hover:text-blue-900 focus:outline-none"
                              >
                                &times;
                              </button>
                            </div>
                          );
                        })}
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded px-3 py-1 select-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={() => setModalData({ open: true, day, meal, station })}
                          aria-label={`Add food to ${station} for ${meal} on ${day}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}
          </section>
        ))}

        {/* Save Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Save menu cycle"
          >
            Save Cycle
          </button>
        </div>
      </div>

      {modalData.open && (
        <FoodPickerModal
          {...modalData}
          onClose={closeModal}
          // For multiple additions, call addFood for each selected id inside the modal component
          onAddFood={(foodId) => addFood(modalData.day, modalData.meal, modalData.station, foodId)}
          existing={(selections[modalData.day]?.[modalData.meal]?.[modalData.station]) || []}
          foodList={dummyFood}
        />
      )}
    </>
  );
}

export default AdminCycle;