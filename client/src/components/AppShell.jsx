import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, UserPlus, LogIn, Heart, PlusCircle, ShieldCheck } from 'lucide-react';

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail'); // Guardado en el Login
  const userRole = localStorage.getItem('userRole');   // 'admin' o 'user'

  // El botón de moderación solo se activa si el rol es admin o es el correo del administrador
  const isAdmin = userRole === 'admin' || userEmail === 'admin@unired.edu.co';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
      <header style={{ backgroundColor: '#1e40af', color: 'white', padding: '12px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={24} color="#4ade80" />
            <span>UniRed Bogotá Reutiliza</span>
          </Link>
          <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Package size={18} /> Catálogo
            </Link>
            
            {token && (
              <Link to="/donar" style={{ backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <PlusCircle size={18} /> Donar
              </Link>
            )}

            {/* SOLO VISIBLE SI ES ADMINISTRADOR */}
            {token && isAdmin && (
              <Link to="/admin" style={{ backgroundColor: '#0f172a', color: '#f59e0b', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #f59e0b' }}>
                <ShieldCheck size={18} /> Moderación
              </Link>
            )}

            {token ? (
              <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={16} /> Salir
              </button>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" style={{ backgroundColor: '#16a34a', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserPlus size={18} /> Registro
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '20px auto', padding: '0 16px' }}>
        {children}
      </main>

      <footer style={{ backgroundColor: '#1e293b', color: '#cbd5e1', textAlign: 'center', padding: '16px', fontSize: '0.875rem' }}>
        UniRed Bogotá Reutiliza &copy; 2026 - Universidad Antonio Nariño
      </footer>
    </div>
  );
}