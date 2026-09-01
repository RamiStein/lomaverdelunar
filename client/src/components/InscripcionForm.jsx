import React, { useState } from 'react';
import { Send, CheckCircle, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function InscripcionForm({ config, onSuccess, onGoToFlyerStudio }) {
  const [formData, setFormData] = useState({
    nombre: '',
    nombrePersonal: '',
    contacto: '',
    tipo: 'Artesanías',
    descripcion: '',
    instagram: '',
    tienda: '',
    mapa: '',
    imagenBase64: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);
  const [error, setError] = useState(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  const categorias = config?.categorias || [
    "Música / Arte",
    "Gastronomía",
    "Artesanías",
    "Huerta / Vivero",
    "Terapias Holísticas",
    "Feria Americana",
    "Productos Naturales"
  ];

  // Compresor automático de imagen en el navegador (ideal para fotos de iPhone/Android)
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
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (e) {
            resolve(readerEvent.target.result);
          }
        };
        img.onerror = () => {
          resolve(readerEvent.target.result);
        };
        img.src = readerEvent.target.result;
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageProcessing(true);
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, imagenBase64: compressedBase64 }));
      } catch (err) {
        console.error('Error al procesar la foto:', err);
      } finally {
        setImageProcessing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: (formData.nombre || '').trim(),
        nombrePersonal: (formData.nombrePersonal || '').trim(),
        contacto: (formData.contacto || '').trim(),
        tipo: formData.tipo || 'Artesanías',
        categoria: formData.tipo || 'Artesanías',
        descripcion: (formData.descripcion || '').trim(),
        instagram: (formData.instagram || '').trim(),
        tienda: (formData.tienda || '').trim(),
        mapa: (formData.mapa || '').trim(),
        imagenBase64: formData.imagenBase64 || ''
      };

      if (!payload.nombre) {
        throw new Error('Por favor ingresa el nombre del emprendimiento.');
      }
      if (!payload.contacto) {
        throw new Error('Por favor ingresa tu WhatsApp de contacto.');
      }

      const res = await fetch('/api/feriantes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Respuesta del servidor (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar la inscripción. Por favor intenta nuevamente.');
      }

      setSubmitted(true);
      setLastCreated(data.feriante || payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error en formulario:', err);
      setError(err.message || 'Ocurrió un error al procesar la inscripción.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-loma-green shadow-xl text-center animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🌿
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-loma-green mb-2">
          ¡Propuesta Recibida con Éxito!
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          Gracias <strong>{formData.nombrePersonal || formData.nombre}</strong> por sumarte a la feria de Loma Verde. Tu propuesta ha quedado registrada en la red.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onGoToFlyerStudio && onGoToFlyerStudio(lastCreated)}
            className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Personalizar y Descargar mi Flyer</span>
          </button>

          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                nombre: '',
                nombrePersonal: '',
                contacto: '',
                tipo: 'Artesanías',
                descripcion: '',
                instagram: '',
                tienda: '',
                mapa: '',
                imagenBase64: ''
              });
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-loma-green font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors"
          >
            Inscribir otra propuesta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-8 bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border-2 border-loma-green shadow-[6px_6px_0px_rgba(43,83,41,0.1)]">
      <div className="text-center mb-6 border-b border-loma-wood/20 pb-4">
        <span className="bg-loma-wood/15 text-loma-wood font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider inline-block mb-1">
          Formulario de Participación
        </span>
        <h3 className="font-serif text-2xl font-bold text-loma-green">
          Sumate a la Feria Lunar 🌿
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Completa tus datos para formar parte de la cartelera y el directorio.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-200 text-xs font-bold mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
            Nombre del Emprendimiento / Proyecto *
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: LM Deco y Jardín"
            className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
              Tu Nombre Personal *
            </label>
            <input
              type="text"
              required
              value={formData.nombrePersonal}
              onChange={(e) => setFormData({ ...formData, nombrePersonal: e.target.value })}
              placeholder="Ej: Lorena"
              className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
              WhatsApp / Teléfono *
            </label>
            <input
              type="text"
              required
              value={formData.contacto}
              onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
              placeholder="Ej: 3484503056"
              className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
            Rubro / Categoría *
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm font-semibold focus:outline-none focus:border-loma-accent"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
            ¿Qué ofrecés? (Descripción detallada) *
          </label>
          <textarea
            required
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Deco boho, macetas rotomoldeadas, etc..."
            className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@lmdecoyjardin"
              className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
              Tienda / Web / Catálogo
            </label>
            <input
              type="text"
              value={formData.tienda}
              onChange={(e) => setFormData({ ...formData, tienda: e.target.value })}
              placeholder="www.tuweb.com"
              className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
            Foto o Logo para el Flyer (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-loma-wood file:text-white hover:file:bg-loma-green cursor-pointer"
          />
          {imageProcessing && (
            <span className="text-[11px] text-loma-wood italic mt-1 block">
              Optimizando imagen...
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || imageProcessing}
          className="w-full bg-loma-green hover:bg-loma-wood text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Publicando en la red...' : 'PUBLICAR MI PROPUESTA'}</span>
        </button>
      </form>
    </div>
  );
}
