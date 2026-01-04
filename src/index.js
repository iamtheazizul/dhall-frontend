import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/App';
import Admin from './pages/Admin';
import AdminDashboard from './components/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import CreateCycle from './pages/CreateCycle';
import ManageCycles from './pages/ManageCycles';
import ManageFoods from './pages/ManageFoods';
import AdminCycle from './pages/AdminCycle';
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
        <Route path="food/add" element={<Admin />} />
        <Route path="food/manage" element={<ManageFoods />} />

        {/* Cycle Management */}
        <Route path="cycle/add" element={<CreateCycle />} />
        <Route path="cycle/manage" element={<ManageCycles />} />
        <Route path="cycle/configure/:cycleId" element={<AdminCycle />} />

        {/* Fallback for any unmatched /admin/* routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Fallback for any other unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);