import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Clock, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver tus solicitudes.');
      navigate('/login');
      return;
    }

    // Petición al backend para obtener los insumos del usuario logueado
    fetch('http://localhost:5000/api/items?misSolicitudes=true', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar las solicitudes');
        return res.json();
      })
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar tus solicitudes. Intenta de nuevo.');
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Encabezado */}
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '24px', borderRadius: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Mis Solicitudes e Insumos</h1>
        <p style={{ margin: '8px 0 0 0', color: '#bfdbfe' }}>
          Consulta el estado de tus reservas y las instrucciones de recogida proporcionadas por los donantes en Bogotá.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#475569', fontSize: '1rem' }}>Cargando tus solicitudes...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{error}</p>
        </div>
      ) : requests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', flex: '1 1 300px', alignItems: 'center' }}>
                <img 
                  src={item.fotos?.[0] || 'https://via.placeholder.com/100x100?text=Insumo'} 
                  alt={item.titulo} 
                  style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f1f5f9' }} 
                />
                <div>
                  <span style={{ backgroundColor: item.estado === 'RESERVADO' ? '#dbeafe' : '#dcfce7', color: item.estado === 'RESERVADO' ? '#1e40af' : '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {item.estado}
                  </span>
                  <h3 style={{ margin: '6px 0 4px 0', color: '#0f172a', fontSize: '1.1rem' }}>{item.titulo}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#2563eb" /> Localidad: <strong>{item.localidad}</strong> ({item.detalles?.colegio})
                  </p>
                </div>
              </div>

              {/* Sección de Instrucciones de Recogida del Donante */}
              <div style={{ flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <MessageSquare size={16} color="#2563eb" /> Instrucciones de Recogida:
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', fontStyle: item.comentarioEntrega ? 'normal' : 'italic' }}>
                  {item.comentarioEntrega || 'El donante aún no ha registrado las instrucciones de entrega. Pronto se pondrá en contacto o dejará el mensaje aquí.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Package size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: 0, color: '#334155' }}>No tienes solicitudes activas</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Explora el catálogo y solicita los insumos que necesites para tu periodo académico.</p>
        </div>
      )}
    </div>
  );
}