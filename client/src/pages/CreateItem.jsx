import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Upload, MapPin } from 'lucide-react';

export default function CreateItem() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Uniforme',
    size: '',
    locality: 'SUBA',
    description: '',
    image: '',
    instruccionesRecogida: '', // 🌟 NUEVO CAMPO
    status: 'Pendiente' // Queda pendiente de aprobación por el admin
  });
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  const bogotaLocalities = [
    'USAQUÉN', 'CHAPINERO', 'SANTA FE', 'SAN CRISTÓBAL', 'USME',
    'TUNJUELITO', 'BOSA', 'KENNEDY', 'FONTIBÓN', 'ENGATIVÁ',
    'SUBA', 'BARRIOS UNIDOS', 'TEUSAQUILLO', 'LOS MÁRTIRES',
    'ANTONIO NARIÑO', 'PUENTE ARANDA', 'CANDELARIA', 'RAFAEL URIBE URIBE',
    'CIUDAD BOLÍVAR', 'SUMAPAZ'
  ];

  // Convertir la imagen seleccionada localmente a vista previa con validación de 5 MB
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB límite
      
      if (file.size > maxSizeInBytes) {
        alert("La imagen supera el límite de 5 MB. Por favor selecciona un archivo más ligero.");
        e.target.value = null; // Limpiar el input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://unired-backend.onrender.com/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el insumo.');
      }

      alert('¡Insumo registrado! Se envió a revisión del Administrador antes de publicarse en el catálogo.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.message || 'No se pudo conectar con el servidor.'));
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <PackagePlus size={28} color="#1e40af" />
        <h2 style={{ margin: 0, color: '#1e293b' }}>Registrar Nueva Donación</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px' }}>Título del Insumo Escolar</label>
          <input 
            type="text" 
            required 
            placeholder="Ej: Kit de Uniforme Diario Talla 10 - Colegio Restrepo"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px' }}>Categoría</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="Uniforme">Uniforme</option>
              <option value="Útiles">Útiles Escolares</option>
              <option value="Texto">Libros de Texto</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px' }}>Talla / Medida</label>
            <input 
              type="text" 
              required 
              placeholder="Ej: Talla 12 / N/A"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
              onChange={(e) => setFormData({...formData, size: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px' }}>Localidad de Entrega (Bogotá)</label>
          <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} onChange={(e) => setFormData({...formData, locality: e.target.value})}>
            {bogotaLocalities.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/*  Punto e Instrucciones de Recogida */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px', color: '#1e40af' }}>
            📍 Instrucciones de Recogida / Medio de Contacto
          </label>
          <textarea 
            rows="2" 
            placeholder="Ej: Recoger en la portería de la Calle 100 #15-20 o comunicarse al WhatsApp 3001234567..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #93c5fd', backgroundColor: '#eff6ff', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({...formData, instruccionesRecogida: e.target.value})}
          />
          <small style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Esta información solo la podrá ver la persona cuando su solicitud sea aprobada.
          </small>
        </div>

        {/* Subida de Foto Real con control de 5MB */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px' }}>Foto Real del Insumo (Máx. 5 MB)</label>
          <div style={{ border: '2px dashed #cbd5e1', padding: '16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="file-upload" />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Upload size={24} color="#64748b" />
              <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>Haz clic aquí para adjuntar la foto del insumo</span>
            </label>
          </div>
          {preview && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Vista previa:</p>
              <img src={preview} alt="Vista Previa" style={{ maxHeight: '150px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px' }}>Estado y Descripción detallada</label>
          <textarea 
            rows="3" 
            placeholder="Describe las condiciones del insumo (ej: usado 6 meses, sin rasgaduras, cremalleras funcionales)..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
          Enviar a Revisión de Moderación
        </button>
      </form>
    </div>
  );
}