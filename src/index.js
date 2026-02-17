import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/Main/App';
import CreateFood from './pages/Food/CreateFood';
import AdminDashboard from './pages/Main/AdminDashboard';
import AdminLayout from './components/Admin/AdminLayout';
import CreateCycle from './pages/Cycle/CreateCycle';
import ManageCycles from './pages/Cycle/ManageCycles';
import ManageFoods from './pages/Food/ManageFoods';
import FoodCycle from './pages/Cycle/FoodCycle';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* Public root */}
      <Route path="/" element={<App />} />
      
      {/* Admin routes with shared layout */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard - main admin page */}
        <Route index element={<AdminDashboard />} />
        
        {/* Food Management */}
        <Route path="food/add" element={<CreateFood />} />
        <Route path="food/manage" element={<ManageFoods />} />
        
        {/* Cycle Management */}
        <Route path="cycle/add" element={<CreateCycle />} />
        <Route path="cycle/manage" element={<ManageCycles />} />
        <Route path="cycle/:cycleId/configure" element={<FoodCycle />} />
        
        {/* Fallback for any unmatched /admin/* routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      
      {/* Fallback for any other unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);