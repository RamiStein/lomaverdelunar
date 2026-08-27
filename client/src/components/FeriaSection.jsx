import React, { useState } from 'react';
import { Store, MessageCircle, Instagram, Globe, MapPin, PlusCircle, ExternalLink, X, Tag } from 'lucide-react';

export default function FeriaSection({ directorio, onOpenInscripcion }) {
  const [selectedFeriante, setSelectedFeriante] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('TODOS');

  const categories = Object.keys(directorio || {});

  // Icon mapping per category
  const getCategoryIcon = (cat) => {
    const l = cat.toLowerCase();
    if (l.includes('huert') || l.includes('viver')) return '🌱';
    if (l.includes('gastro') || l.includes('comida')) return '🍯';
    if (l.includes('artesan')) return '🎨';
    if (l.includes('holist') || l.includes('terapia')) return '✨';
    if (l.includes('americana') || l.includes('ropa')) return '👗';
    if (l.includes('natural')) return '🌿';
    return '⭐';
  };

  const formatWhatsAppUrl = (phone, name) => {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length >= 10 && !clean.startsWith('54')) clean = '549' + clean;
    const msg = encodeURIComponent(`¡Hola ${name}! Te contacto a través de la web del Encuentro Lunar de Loma Verde ♒`);
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const formatInstagramUrl = (ig) => {
    if (!ig) return '#';
    let clean = ig.replace('@', '').replace('https://instagram.com/', '').replace('www.instagram.com/', '').replace('instagram.com/', '').trim();
    return `https://instagram.com/${clean}`;
  };

  const formatWebUrl = (url) => {
    if (!url) return '#';
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Encabezado */}
      <div className="text-center mb-8">
        <span className="bg-loma-wood/20 text-loma-wood font-extrabold text-xs uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1 mb-2">
          <Store className="w-3.5 h-3.5" /> La Feria del Barrio
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-loma-green font-bold uppercase tracking-tight">
          Emprendimientos y Feriantes 🌿
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-2">
          Conoce a los productores locales, artesanos y creadores que le dan vida y sustentabilidad a nuestra plaza.
        </p>

        {/* Botón para sumarse a la feria */}
        <div className="mt-4">
          <button
            onClick={onOpenInscripcion}
            className="inline-flex items-center gap-2 bg-loma-green hover:bg-loma-wood text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar / Inscribir mi Emprendimiento</span>
          </button>
        </div>
      </div>

      {/* Filtros por Categoría */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 pb-2">
          <button
            onClick={() => setActiveCategoryFilter('TODOS')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeCategoryFilter === 'TODOS'
                ? 'bg-loma-green text-white shadow-md'
                : 'bg-white text-loma-green border border-loma-wood/30 hover:bg-loma-bg'
            }`}
          >
            Todos los rubros
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === cat
                  ? 'bg-loma-accent text-white shadow-md'
                  : 'bg-white text-loma-green border border-loma-wood/30 hover:bg-loma-bg'
              }`}
            >
              <span>{getCategoryIcon(cat)}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Listado de Categorías y Carruseles de Feriantes */}
      <div className="space-y-12">
        {categories
          .filter((cat) => activeCategoryFilter === 'TODOS' || activeCategoryFilter === cat)
          .map((cat) => {
            const feriantes = directorio[cat] || [];
            if (feriantes.length === 0) return null;

            return (
              <div key={cat} className="relative">
                {/* Título de la Categoría */}
                <div className="flex items-center justify-between mb-4 border-b-2 border-loma-wood/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(cat)}</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-loma-green">
                      {cat}
                    </h3>
                    <span className="text-xs font-bold text-loma-wood bg-loma-wood/15 px-2.5 py-0.5 rounded-full">
                      {feriantes.length}
                    </span>
                  </div>
                </div>

                {/* Carrusel Horizontal */}
                <div className="flex overflow-x-auto gap-4 pb-4 pt-1 px-1 no-scrollbar scroll-smooth">
                  {feriantes.map((f, idx) => (
                    <div
                      key={f.id || idx}
                      onClick={() => setSelectedFeriante(f)}
                      className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl p-5 border-2 border-loma-wood/30 hover:border-loma-green hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {/* Puesto Asignado Badge si existe */}
                        {f.puestoAsignado && f.puestoAsignado !== 'Sin asignar' && (
                          <span className="text-[10px] font-extrabold uppercase bg-loma-accent/15 text-loma-accent px-2 py-0.5 rounded-md inline-block mb-2">
                            📍 {f.puestoAsignado}
                          </span>
                        )}

                        <div className="font-serif text-lg font-bold text-loma-green group-hover:text-loma-accent transition-colors flex items-center justify-between">
                          <span>{f.nombre}</span>
                          <span className="text-base">{getCategoryIcon(f.tipo || cat)}</span>
                        </div>

                        {f.nombrePersonal && (
                          <div className="text-xs font-semibold text-loma-wood mb-2">
                            👤 {f.nombrePersonal}
                          </div>
                        )}

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mt-2">
                          {f.descripcion || 'Propuesta comunitaria en la feria de Loma Verde.'}
                        </p>
                      </div>

                      {/* Footer de la tarjeta */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-loma-accent uppercase tracking-wider group-hover:underline">
                          Abrir Perfil +
                        </span>
                        
                        <div className="flex items-center gap-1 text-gray-400">
                          {f.contacto && <MessageCircle className="w-3.5 h-3.5 text-green-600" />}
                          {f.instagram && <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                          {f.tienda && <Globe className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Modal Detallado de Perfil */}
      {selectedFeriante && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFeriante(null)}
        >
          <div 
            className="bg-loma-bg border-3 border-loma-accent p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFeriante(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Rubro Badge */}
            <span className="bg-loma-wood text-white text-xs font-bold uppercase px-3 py-1 rounded-full inline-block mb-3">
              {selectedFeriante.tipo}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-loma-green">
              {selectedFeriante.nombre}
            </h3>

            {selectedFeriante.nombrePersonal && (
              <p className="text-sm font-bold text-loma-wood mt-0.5">
                Responsable: {selectedFeriante.nombrePersonal}
              </p>
            )}

            {selectedFeriante.puestoAsignado && selectedFeriante.puestoAsignado !== 'Sin asignar' && (
              <div className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-lg mt-2">
                📍 Ubicación en la plaza: {selectedFeriante.puestoAsignado}
              </div>
            )}

            {/* Descripción */}
            <div className="bg-white p-4 rounded-xl border border-loma-wood/20 my-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
              {selectedFeriante.descripcion || 'Sin descripción detallada.'}
            </div>

            {/* Botones de Acción / Contacto Directo */}
            <div className="space-y-2.5 mt-4">
              {selectedFeriante.contacto && (
                <a
                  href={formatWhatsAppUrl(selectedFeriante.contacto, selectedFeriante.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>
              )}

              {selectedFeriante.instagram && (
                <a
                  href={formatInstagramUrl(selectedFeriante.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow hover:opacity-95 transition-opacity"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Ver en Instagram ({selectedFeriante.instagram})</span>
                </a>
              )}

              {selectedFeriante.tienda && (
                <a
                  href={formatWebUrl(selectedFeriante.tienda)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-loma-wood hover:bg-loma-green text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visitar Tienda / Catálogo Web</span>
                </a>
              )}

              {selectedFeriante.mapa && (
                <a
                  href={formatWebUrl(selectedFeriante.mapa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-loma-accent" />
                  <span>Ver Ubicación en Maps</span>
                </a>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedFeriante(null)}
                className="text-xs font-bold text-loma-wood hover:text-loma-green uppercase tracking-wider"
              >
                [ Cerrar Perfil ]
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
