import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateItem from './pages/CreateItem';
import AdminModeration from './pages/AdminModeration';
import MyRequests from './pages/MyRequests';
import MyDonations from './pages/MyDonations'; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta raíz '/' muestra tu Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Las demás vistas con su estructura limpia */}
        <Route path="/catalog" element={<AppShell><Catalog /></AppShell>} />
        <Route path="/donar" element={<AppShell><CreateItem /></AppShell>} />
        <Route path="/admin" element={<AppShell><AdminModeration /></AppShell>} />
        <Route path="/mis-solicitudes" element={<AppShell><MyRequests /></AppShell>} />
        
        {/* 🌟 2. Añadimos la nueva ruta para Mis Donaciones */}
        <Route path="/mis-donaciones" element={<AppShell><MyDonations /></AppShell>} />

        <Route path="/login" element={<AppShell><Login /></AppShell>} />
        <Route path="/register" element={<AppShell><Register /></AppShell>} />
      </Routes>
    </Router>
  );
}