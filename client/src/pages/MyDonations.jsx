import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver tus donaciones.');
      navigate('/login');
      return;
    }

    // Petición al backend con misDonaciones=true
    fetch('https://unired-backend.onrender.com/api/items?misDonaciones=true', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar tus donaciones');
        return res.json();
      })
      .then((data) => {
        setDonations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar tus donaciones. Intenta de nuevo.');
        setLoading(false);
      });
  }, [navigate]);

  // Función para cambiar de RESERVADO a ENTREGADO
  const handleMarkAsDelivered = async (itemId) => {
    if (!window.confirm('¿Confirmas que entregaste físicamente este insumo al beneficiario?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://unired-backend.onrender.com/api/items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: 'ENTREGADO',
          comentarioEntrega: 'Insumo entregado exitosamente por el donante.'
        })
      });

      if (!res.ok) throw new Error('No se pudo actualizar el estado.');

      alert('¡Excelente! El insumo ha sido marcado como ENTREGADO.');
      
      // Actualizamos el estado local para reflejar el cambio sin recargar la página
      setDonations(prev => prev.map(item => 
        item._id === itemId ? { ...item, estado: 'ENTREGADO' } : item
      ));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Encabezado */}
      <div style={{ backgroundColor: '#15803d', color: 'white', padding: '24px', borderRadius: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart fill="white" size={28} /> Mis Donaciones Publicadas
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#dcfce7' }}>
          Administra las publicaciones que has realizado y confirma la entrega de tus insumos cuando los beneficiarios los recojan.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#475569' }}>Cargando tus donaciones...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{error}</p>
        </div>
      ) : donations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {donations.map((item) => {
            const isPendiente = item.estado === 'PENDIENTE';
            const isDisponible = item.estado === 'DISPONIBLE';
            const isReservado = item.estado === 'RESERVADO';
            const isEntregado = item.estado === 'ENTREGADO';
            const isRechazado = item.estado === 'RECHAZADO';

            // Colores por estado
            let badgeBg = '#f1f5f9';
            let badgeColor = '#475569';
            if (isPendiente) { badgeBg = '#fef3c7'; badgeColor = '#92400e'; }
            if (isDisponible) { badgeBg = '#dbeafe'; badgeColor = '#1e40af'; }
            if (isReservado) { badgeBg = '#ffedd5'; badgeColor = '#c2410c'; }
            if (isEntregado) { badgeBg = '#dcfce7'; badgeColor = '#166534'; }
            if (isRechazado) { badgeBg = '#fef2f2'; badgeColor = '#991b1b'; }

            return (
              <div key={item._id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', flex: '1 1 300px', alignItems: 'center' }}>
                  <img 
                    src={item.fotos?.[0] || 'https://via.placeholder.com/100x100?text=Insumo'} 
                    alt={item.titulo} 
                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f1f5f9' }} 
                  />
                  <div>
                    <span style={{ backgroundColor: badgeBg, color: badgeColor, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {item.estado}
                    </span>
                    <h3 style={{ margin: '6px 0 4px 0', color: '#0f172a', fontSize: '1.1rem' }}>{item.titulo}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#16a34a" /> Localidad: <strong>{item.localidad}</strong>
                    </p>
                  </div>
                </div>

                {/* Acciones y mensajes según el estado */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {isReservado && (
                    <button 
                      onClick={() => handleMarkAsDelivered(item._id)}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={18} /> Marcar como Entregado
                    </button>
                  )}

                  {isPendiente && (
                    <span style={{ fontSize: '0.8rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> En espera de aprobación por el Administrador
                    </span>
                  )}

                  {isDisponible && (
                    <span style={{ fontSize: '0.8rem', color: '#1d4ed8' }}>
                      Publicado en el catálogo, esperando solicitud
                    </span>
                  )}

                  {isEntregado && (
                    <span style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={16} /> Proceso de donación completado
                    </span>
                  )}

                  {isRechazado && (
                    <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>
                      Rechazado por moderación: {item.comentarioRechazo || 'Sin detalles'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Heart size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: 0, color: '#334155' }}>No has publicado donaciones aún</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Comparte uniformes o útiles escolares que ya no uses y ayuda a un estudiante.</p>
        </div>
      )}
    </div>
  );
}