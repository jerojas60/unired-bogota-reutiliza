import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, X, CheckCircle2, User, Calendar, BookOpen, LayoutDashboard } from 'lucide-react';

export default function AdminModeration() {
  const [items, setItems] = useState([]);
  const [filterState, setFilterState] = useState('PENDIENTE'); // PENDIENTE, RESERVADO, ENTREGADO, RECHAZADO
  const [loading, setLoading] = useState(true);
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const navigate = useNavigate();

  const fetchItems = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Acceso denegado. Debes iniciar sesión como administrador.');
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5000/api/items?moderacion=true&estado=${filterState}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [filterState]);

  // Aprobar: Pasa de PENDIENTE a DISPONIBLE (Catálogo)
  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/items/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'DISPONIBLE' })
      });

      if (res.ok) {
        alert('Insumo aprobado exitosamente y publicado en el catálogo público.');
        fetchItems();
      }
    } catch (err) {
      console.error(err);
      alert('Error al aprobar el insumo.');
    }
  };

  // Confirmar Rechazo y mover automáticamente la vista a la pestaña RECHAZADO
  const handleConfirmReject = async () => {
    if (!rejectComment.trim()) {
      alert('Por favor escribe un motivo de rechazo para orientar al donante.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/items/${rejectingItem._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          estado: 'RECHAZADO',
          comentarioRechazo: rejectComment 
        })
      });

      if (res.ok) {
        alert('Insumo rechazado correctamente.');
        setRejectingItem(null);
        setRejectComment('');
        
        // Cambiamos automáticamente al filtro RECHAZADO para que el admin vea el cambio reflejado de inmediato
        setFilterState('RECHAZADO');
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el rechazo.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
      
      {/* Barra de navegación superior de la vista de Administrador */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#1e293b' }}>
          <Shield size={20} color="#2563eb" /> Panel de Administración - UniRed Bogotá
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilterState('PENDIENTE')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            <LayoutDashboard size={16} /> Ir a Moderación
          </button>
          <button
            onClick={() => navigate('/catalog')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            <BookOpen size={16} /> Ver Catálogo
          </button>
        </div>
      </div>

      {/* Encabezado Principal */}
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Shield size={32} color="#38bdf8" />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Moderación y Trazabilidad de Insumos</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>Supervisión de calidad y ciclo de vida de las donaciones</p>
        </div>
      </div>

      {/* Pestañas de Filtro */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', overflowX: 'auto' }}>
        {[
          { key: 'PENDIENTE', label: 'Pendientes de Revisión' },
          { key: 'RESERVADO', label: 'Reservados en Proceso' },
          { key: 'ENTREGADO', label: 'Entregados (Histórico)' },
          { key: 'RECHAZADO', label: 'Rechazados' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterState(tab.key)}
            style={{
              padding: '10px 18px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: filterState === tab.key ? '#2563eb' : '#f1f5f9',
              color: filterState === tab.key ? 'white' : '#475569'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de Insumos */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '30px' }}>Cargando registros...</p>
      ) : items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: '1 1 350px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                    {item.categoria}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Localidad: <strong>{item.localidad}</strong> ({item.detalles?.colegio})
                  </span>
                </div>
                
                <h3 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>{item.titulo}</h3>
                
                <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>
                  Donante: <strong>{item.donanteId?.nombre || item.donanteId?.email || 'Usuario'}</strong>
                </p>

                {item.beneficiarioId && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                      <User size={14} /> Beneficiario: {item.beneficiarioId?.nombre || 'Estudiante'} ({item.beneficiarioId?.email})
                    </div>
                    {item.estado === 'ENTREGADO' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.8rem', color: '#15803d' }}>
                        <Calendar size={14} /> Proceso de entrega finalizado
                      </div>
                    )}
                  </div>
                )}

                {item.comentarioRechazo && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#dc2626', backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                    <strong>Motivo de rechazo:</strong> {item.comentarioRechazo}
                  </p>
                )}
              </div>

              {/* Botones de Acción */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {filterState === 'PENDIENTE' && (
                  <>
                    <button
                      onClick={() => handleApprove(item._id)}
                      style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Check size={16} /> Aprobar al Catálogo
                    </button>
                    <button
                      onClick={() => setRejectingItem(item)}
                      style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <X size={16} /> Rechazar
                    </button>
                  </>
                )}

                {filterState === 'RESERVADO' && (
                  <span style={{ fontSize: '0.85rem', color: '#d97706', backgroundColor: '#fef3c7', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>
                    En espera de entrega
                  </span>
                )}

                {filterState === 'ENTREGADO' && (
                  <span style={{ fontSize: '0.85rem', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>
                    Entregado con éxito
                  </span>
                )}

                {filterState === 'RECHAZADO' && (
                  <span style={{ fontSize: '0.85rem', color: '#dc2626', backgroundColor: '#fef2f2', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>
                    Rechazado por moderación
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ margin: 0, color: '#475569', fontWeight: 'bold' }}>No hay registros en esta sección ({filterState}).</p>
        </div>
      )}

      {/* Modal para Rechazo */}
      {rejectingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', maxWidth: '450px', width: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#991b1b' }}>Rechazar Insumo</h3>
            <p style={{ fontSize: '0.9rem', color: '#334155' }}>
              Indica la razón por la cual se rechaza <strong>{rejectingItem.titulo}</strong>. Al confirmar, el ítem se moverá automáticamente a la pestaña de Rechazados.
            </p>
            <textarea
              rows={4}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Ej: Foto poco clara o información incompleta..."
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontSize: '0.9rem' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => { setRejectingItem(null); setRejectComment(''); }}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #94a3b8', backgroundColor: '#f1f5f9', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReject}
                style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#dc2626', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}