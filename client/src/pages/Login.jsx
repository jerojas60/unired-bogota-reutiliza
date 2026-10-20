import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Petición corregida apuntando a la ruta de usuarios en Render
      const response = await fetch('https://unired-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas o usuario no registrado.');
      }
      
      // Guardamos las credenciales reales
      localStorage.setItem('token', data.token);
      
      // ✅ CORREGIDO: Leemos directo de "data" (no de "data.user")
      const userObj = {
        email: data.email,
        role: (data.rol === 'ADMIN' || data.email === 'admin@unired.edu.co') ? 'ADMIN' : 'USER'
      };
      localStorage.setItem('user', JSON.stringify(userObj));

      if (userObj.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err.message || 'Credenciales inválidas o usuario no registrado.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
          <LogIn size={26} color="#2563eb" />
        </div>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem' }}>Iniciar Sesión</h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Ingresa a UniRed Bogotá Reutiliza</p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>Correo Electrónico</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#f8fafc' }}>
            <Mail size={18} color="#64748b" style={{ marginRight: '8px' }} />
            <input 
              type="email" 
              required 
              placeholder="tu-correo@unired.edu.co" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>Contraseña</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#f8fafc' }}>
            <Lock size={18} color="#64748b" style={{ marginRight: '8px' }} />
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s' }}
        >
          Entrar al Sistema
        </button>
      </form>

      <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px dashed #f59e0b', fontSize: '0.8rem', color: '#92400e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: '#b45309', marginBottom: '4px' }}>
          <ShieldCheck size={16} color="#d97706" /> Acceso Rápido para Jurados (Admin):
        </div>
        <div><strong>Correo:</strong> admin@unired.edu.co</div>
        <div><strong>Clave:</strong> Admin123*</div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '20px' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</Link>
      </p>
    </div>
  );
}