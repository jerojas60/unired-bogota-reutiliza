import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Search, Eye, CheckCircle, Package, X } from 'lucide-react';

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [locality, setLocality] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [requested, setRequested] = useState(false);
  const navigate = useNavigate();

  const bogotaLocalities = [
    'USAQUÉN', 'CHAPINERO', 'SANTA FE', 'SAN CRISTÓBAL', 'USME',
    'TUNJUELITO', 'BOSA', 'KENNEDY', 'FONTIBÓN', 'ENGATIVÁ',
    'SUBA', 'BARRIOS UNIDOS', 'TEUSAQUILLO', 'LOS MÁRTIRES',
    'ANTONIO NARIÑO', 'PUENTE ARANDA', 'CANDELARIA', 'RAFAEL URIBE URIBE',
    'CIUDAD BOLÍVAR', 'SUMAPAZ'
  ];

  const sampleItems = [
    { 
      _id: '1', 
      title: 'Uniforme Diario Colegio Restrepo', 
      category: 'Uniforme', 
      size: 'Talla 12', 
      locality: 'SUBA', 
      status: 'Disponible',
      description: 'Chaqueta y pantalón en excelente estado, sin desgaste.',
      image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=500&q=80'
    },
    { 
      _id: '2', 
      title: 'Kit de Cuadernos y Colores', 
      category: 'Útiles', 
      size: 'N/A', 
      locality: 'KENNEDY', 
      status: 'Disponible',
      description: '5 cuadernos cuadriculados de 100 hojas y caja de colores nueva.',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80'
    },
    { 
      _id: '3', 
      title: 'Sudadera Deportiva Talla 14', 
      category: 'Uniforme', 
      size: 'Talla 14', 
      locality: 'ENGATIVÁ', 
      status: 'Disponible',
      description: 'Sudadera completa color azul oscuro, cremallera funcional.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80'
    }
  ];

  useEffect(() => {
    fetch('https://unired-backend.onrender.com/api/items')
      .then((res) => res.json())
      .then((data) => setItems(data.length ? data : sampleItems))
      .catch(() => setItems(sampleItems));
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !category || item.category === category;
    const matchesLocality = !locality || item.locality.toUpperCase() === locality.toUpperCase();
    const isAvailable = item.status !== 'Reservado' && item.status !== 'Entregado' && item.status !== 'Pendiente';
    
    return matchesSearch && matchesCategory && matchesLocality && isAvailable;
  });

  const handleRequestClick = (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión o registrarte para poder solicitar y reservar un insumo escolar.');
      navigate('/login');
      return;
    }
    setSelectedItem(item);
  };

  const handleConfirmRequest = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://unired-backend.onrender.com/api/items/${selectedItem._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'RESERVADO' })
      });
    } catch (err) {
      console.log('Error de conexión');
    }

    setRequested(true);
    setItems(prevItems => prevItems.map(i => 
      i._id === selectedItem._id ? { ...i, status: 'Reservado' } : i
    ));

    setTimeout(() => {
      setRequested(false);
      setSelectedItem(null);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '24px', borderRadius: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Catálogo de Donaciones</h1>
        <p style={{ margin: '8px 0 0 0', color: '#bfdbfe' }}>Reutilización sostenible de uniformes y útiles escolares en Bogotá</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '6px', flex: '1 1 250px', border: '1px solid #cbd5e1' }}>
          <Search size={18} color="#334155" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Buscar insumo o descripción..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '500', backgroundColor: '#f8fafc' }}>
          <option value="">Todas las Categorías</option>
          <option value="Uniforme">Uniformes</option>
          <option value="Útiles">Útiles Escolares</option>
          <option value="Texto">Libros de Texto</option>
        </select>

        <select value={locality} onChange={(e) => setLocality(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '500', backgroundColor: '#f8fafc', maxWidth: '200px' }}>
          <option value="">Todas las Localidades</option>
          {bogotaLocalities.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                <img src={item.image || 'https://via.placeholder.com/300x180?text=Sin+Imagen'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {item.category}
                </span>
              </div>

              <div style={{ padding: '16px', flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', fontWeight: '600' }}>
                  <MapPin size={14} color="#2563eb" /> Localidad: <strong>{item.locality}</strong>
                </div>
                <h3 style={{ margin: '4px 0 8px 0', color: '#0f172a', fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>Especificación: <strong>{item.size}</strong></p>
              </div>

              <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setDetailItem(item)}
                  style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Eye size={16} /> Ver
                </button>
                <button 
                  onClick={() => handleRequestClick(item)}
                  style={{ flex: 2, backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Solicitar Insumo
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Package size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ margin: 0, color: '#334155' }}>No se encontraron insumos disponibles</h3>
          </div>
        )}
      </div>

      {detailItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '90%', position: 'relative' }}>
            <button onClick={() => setDetailItem(null)} style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <X size={20} color="#64748b" />
            </button>
            <img src={detailItem.image} alt={detailItem.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>{detailItem.title}</h2>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}><strong>Descripción:</strong> {detailItem.description || 'Sin descripción detallada.'}</p>
            <p style={{ color: '#334155', fontSize: '0.95rem' }}><strong>Talla/Medida:</strong> {detailItem.size}</p>
            <p style={{ color: '#334155', fontSize: '0.95rem' }}><strong>Localidad:</strong> {detailItem.locality}</p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setDetailItem(null)} style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #94a3b8', backgroundColor: '#e2e8f0', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}>
                Cerrar
              </button>
              <button onClick={() => { handleRequestClick(detailItem); setDetailItem(null); }} style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                Solicitar Este Insumo
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', maxWidth: '420px', width: '90%' }}>
            {!requested ? (
              <>
                <h3 style={{ marginTop: 0, color: '#0f172a' }}>Confirmar Solicitud de Insumo</h3>
                <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.4' }}>
                  ¿Deseas solicitar <strong>{selectedItem.title}</strong>? El insumo se ocultará del catálogo público para evitar solicitudes duplicadas.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button onClick={() => setSelectedItem(null)} style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #64748b', backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}>
                    No, Cancelar
                  </button>
                  <button onClick={handleConfirmRequest} style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    Sí, Confirmar Reserva
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={52} color="#16a34a" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ margin: 0, color: '#16a34a' }}>¡Solicitud Registrada!</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569' }}>El artículo ha sido apartado y ocultado del catálogo.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}