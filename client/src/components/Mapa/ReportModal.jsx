import React, { useState } from 'react';
import { X, Send, Image as ImageIcon, MapPin, AlertTriangle, Sparkles, Heart, Bell, Wrench, Sprout } from 'lucide-react';

const CATEGORIAS_MAPA = [
  { id: 'aviso', label: 'Aviso Barrial', emoji: '📣', color: '#c48c26', icon: Bell, desc: 'Reuniones, avisos, actividades' },
  { id: 'alerta', label: 'Alerta / Precaución', emoji: '🚨', color: '#dc2626', icon: AlertTriangle, desc: 'Calles anegadas, ramas, cortes' },
  { id: 'mascota', label: 'Mascotas', emoji: '🐾', color: '#d97706', icon: Heart, desc: 'Perdidos, encontrados, tránsito' },
  { id: 'huerta', label: 'Huerta & Semillas', emoji: '🌿', color: '#2b5329', icon: Sprout, desc: 'Plantines, compost, saberes' },
  { id: 'oficio', label: 'Oficios & Servicios', emoji: '🛠️', color: '#0284c7', icon: Wrench, desc: 'Oficios vecinales, fletes' },
  { id: 'cultura', label: 'Cultura & Encuentro', emoji: '💫', color: '#7c3aed', icon: Sparkles, desc: 'Música, talleres, ferias' },
];

export default function ReportModal({ lat, lng, defaultCalles = '', onClose, onSuccess }) {
  const [categoria, setCategoria] = useState('aviso');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [autorNombre, setAutorNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [calles, setCalles] = useState(defaultCalles || 'Loma Verde');
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Compresor de fotos
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          try {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch (e) {
            resolve(readerEvent.target.result);
          }
        };
        img.onerror = () => resolve(readerEvent.target.result);
        img.src = readerEvent.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageProcessing(true);
      try {
        const compressed = await compressImage(file);
        setFoto(compressed);
      } catch (err) {
        console.error('Error procesando imagen:', err);
      } finally {
        setImageProcessing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      setError('Por favor completa el título y la descripción.');
      return;
    }

    setLoading(true);
    setError(null);

    const catObj = CATEGORIAS_MAPA.find(c => c.id === categoria) || CATEGORIAS_MAPA[0];

    try {
      const payload = {
        titulo: titulo.trim(),
        categoria: catObj.id,
        categoriaLabel: `${catObj.label} ${catObj.emoji}`,
        emoji: catObj.emoji,
        color: catObj.color,
        descripcion: descripcion.trim(),
        autorNombre: autorNombre.trim() || 'Vecino de Loma Verde',
        contacto: contacto.trim(),
        calles: calles.trim() || 'Loma Verde',
        lat: Number(lat) || -34.3547,
        lng: Number(lng) || -58.8258,
        foto: foto || ''
      };

      const res = await fetch('/api/mapa/puntos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al publicar el reporte.');

      if (onSuccess) onSuccess(data.punto || payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-loma-green shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera Modal */}
        <div className="bg-gradient-to-r from-loma-green to-emerald-900 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                Reportar Situación en el Mapa
              </h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Loma Verde y Alrededores ({lat.toFixed(4)}, {lng.toFixed(4)})</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario scrolleable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-bold">
              🚨 {error}
            </div>
          )}

          {/* Selector de Categorías */}
          <div>
            <label className="block font-bold text-loma-wood uppercase mb-2">
              Tipo de Situación *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIAS_MAPA.map((cat) => {
                const isSelected = categoria === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoria(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-loma-green bg-loma-green text-white shadow-sm ring-2 ring-loma-accent/30'
                        : 'border-gray-200 bg-[#faf9f5] text-gray-700 hover:border-loma-wood/40'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <strong className="text-[11px] leading-tight block">{cat.label}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block font-bold text-loma-wood uppercase mb-1">
              Título del Reporte o Novedad *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Perro mestizo con collar rojo encontrado"
              className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-xs font-bold text-loma-green focus:outline-none focus:border-loma-accent"
            />
          </div>

          {/* Referencia de Calles */}
          <div>
            <label className="block font-bold text-loma-wood uppercase mb-1">
              Calles / Referencia del Lugar
            </label>
            <input
              type="text"
              value={calles}
              onChange={(e) => setCalles(e.target.value)}
              placeholder="Ej: Calle Los Fresnos e/ Las Rosas y Los Cerros"
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-xs focus:outline-none focus:border-loma-accent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-bold text-loma-wood uppercase mb-1">
              ¿Qué está sucediendo? (Detalle) *
            </label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuenta qué pasó, detalles importantes o cómo ayudar..."
              className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-xs leading-relaxed focus:outline-none focus:border-loma-accent"
            />
          </div>

          {/* Datos del Vecino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-loma-wood uppercase mb-1">
                Tu Nombre y Apellido
              </label>
              <input
                type="text"
                value={autorNombre}
                onChange={(e) => setAutorNombre(e.target.value)}
                placeholder="Ej: Laura Vecina"
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-xs focus:outline-none focus:border-loma-accent"
              />
            </div>
            <div>
              <label className="block font-bold text-loma-wood uppercase mb-1">
                WhatsApp / Teléfono (Opcional)
              </label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Ej: 1122334455"
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-xs focus:outline-none focus:border-loma-accent"
              />
            </div>
          </div>

          {/* Adjuntar Foto */}
          <div>
            <label className="block font-bold text-loma-wood uppercase mb-1">
              Foto o Imagen de la situación (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-loma-wood file:text-white hover:file:bg-loma-green cursor-pointer"
            />
            {imageProcessing && (
              <span className="text-[11px] text-amber-700 italic block mt-1">Optimizando foto...</span>
            )}
            {foto && (
              <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300">
                <img src={foto} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFoto('')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Botón Publicar */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || imageProcessing}
              className="w-2/3 py-3 rounded-xl bg-loma-green hover:bg-loma-wood text-white font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Publicando...' : 'Publicar en el Mapa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
