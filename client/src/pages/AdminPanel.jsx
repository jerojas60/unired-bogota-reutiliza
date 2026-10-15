import React, { useState } from 'react';
import { CheckCircle, XCircle, ShieldAlert, Eye } from 'lucide-react';

export default function AdminPanel() {
  // Lista simulada de insumos pendientes enviados por los donantes
  const [pendingItems, setPendingItems] = useState([
    {
      _id: '101',
      title: 'Chaqueta de Sudadera Talla 10',
      category: 'Uniforme',
      locality: 'KENNEDY',
      description: 'Chaqueta en buen estado, cierre funcionando.',
      size: 'Talla 10',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
      donor: 'carlos.donante@gmail.com'
    },
    {
      _id: '102',
      title: 'Diccionario Español-Inglés y Regla',
      category: 'Útiles',
      locality: 'SUBA',
      description: 'Sin hojas rotas, excelente estado para primaria.',
      size: 'N/A',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80',
      donor: 'marta.reutiliza@gmail.com'
    }
  ]);

  const handleApprove = (id) => {
    alert('Insumo APROBADO: Ahora es visible en el Catálogo Público.');
    setPendingItems(pendingItems.filter(item => item._id !== id));
  };

  const handleReject = (id) => {
    alert('Insumo RECHAZADO: No cumple con los criterios de calidad o presenta errores.');
    setPendingItems(pendingItems.filter(item => item._id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldAlert size={32} color="#f59e0b" />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem' }}>Panel de Administración y Moderación</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>Revisa la calidad y autenticidad de las donaciones antes de publicarlas</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.2rem' }}>Publicaciones Pendientes de Aprobación ({pendingItems.length})</h2>

        {pendingItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {pendingItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                <img src={item.image} alt={item.title} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b' }}>{item.title}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Donante: <strong>{item.donor}</strong> | Localidad: <strong>{item.locality}</strong> | Talla: <strong>{item.size}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{item.description}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleApprove(item._id)} 
                    style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCircle size={16} /> Aprobar
                  </button>
                  <button 
                    onClick={() => handleReject(item._id)} 
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <XCircle size={16} /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>No hay donaciones pendientes por moderar en este momento.</p>
        )}
      </div>
    </div>
  );
}