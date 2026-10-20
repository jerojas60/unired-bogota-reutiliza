import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, BookOpen, UserPlus, ArrowRight, Shield, Package, LogOut, LogIn, Leaf, Lock, MapPin } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token) {
      let parsedUser = {};
      try {
        parsedUser = userData ? JSON.parse(userData) : {};
      } catch (e) {
        parsedUser = {};
      }
      setUser({ token, role: parsedUser.role || 'USER' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      {/* Navbar Superior Original + Dinámico según sesión */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Recycle size={28} color="#16a34a" />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>UniRed Bogotá Reutiliza</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              {user.role === 'ADMIN' ? (
                <button 
                  onClick={() => navigate('/admin')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #0f172a', backgroundColor: '#0f172a', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                >
                  <Shield size={16} color="#38bdf8" /> Panel de Administración
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/mis-solicitudes')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #2563eb', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: '600', cursor: 'pointer' }}
                >
                  <Package size={16} /> Mis Solicitudes
                </button>
              )}
              <button 
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}
              >
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#334155', fontWeight: '600', cursor: 'pointer' }}
              >
                <LogIn size={16} /> Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate('/register')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: 'white', fontWeight: '600', cursor: 'pointer' }}
              >
                <UserPlus size={16} /> Registrarse
              </button>
            </>
          )}
        </div>
      </header>

      {/* Contenido Principal con el diseño exacto de tu captura */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '50px 20px', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 16px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '24px' }}>
          <Recycle size={16} /> Iniciativa de Economía Circular en Bogotá
        </div>
        
        <h2 style={{ fontSize: '2.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.15', marginBottom: '20px' }}>
          Dona, Reutiliza y Apoya la Educación en <br /> Nuestra Ciudad
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.6', marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px auto' }}>
          UniRed Bogotá Reutiliza es una plataforma tecnológica diseñada para conectar a donantes y beneficiarios, facilitando la donación, el inventario y la redistribución transparente de uniformes, libros y útiles escolares en las 20 localidades de Bogotá.
        </p>

        {/* Botones de acción originales */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button 
            onClick={() => navigate('/catalog')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 26px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <BookOpen size={20} /> Explorar el Catálogo <ArrowRight size={18} />
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            style={{ padding: '14px 26px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#0f172a', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Crear una Cuenta Gratis
          </button>
        </div>

        {/* Las 3 Tarjetas Exactas de tu diseño original */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', textAlign: 'left', marginBottom: '20px' }}>
          
          {/* Tarjeta 1: Impacto Sostenible */}
          <div style={{ backgroundColor: 'white', padding: '28px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Leaf size={22} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginTop: 0, marginBottom: '10px', fontWeight: '700' }}>Impacto Sostenible</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              Reducimos el desperdicio textil y de útiles escolares, promoviendo la economía circular en los hogares bogotanos.
            </p>
          </div>

          {/* Tarjeta 2: Transparencia y Control */}
          <div style={{ backgroundColor: 'white', padding: '28px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Lock size={22} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginTop: 0, marginBottom: '10px', fontWeight: '700' }}>Transparencia y Control</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              Seguimiento detallado de cada donación mediante pines únicos y moderación administrativa constante.
            </p>
          </div>

          {/* Tarjeta 3: Cobertura Local */}
          <div style={{ backgroundColor: 'white', padding: '28px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <MapPin size={22} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginTop: 0, marginBottom: '10px', fontWeight: '700' }}>Cobertura Local</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              Filtros inteligentes por localidad y colegio para encontrar apoyos cercanos a tu zona.
            </p>
          </div>

        </div>

      </main>

      {/* Footer original */}
      <footer style={{ textAlign: 'center', padding: '24px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
        UniRed Bogotá Reutiliza &copy; 2026 - Universidad Antonio Nariño (Trabajo de Grado)
      </footer>
    </div>
  );
}