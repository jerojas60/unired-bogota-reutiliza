import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateItem from './pages/CreateItem';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/donar" element={<CreateItem />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppShell>
    </Router>
  );
}