import React, { useState } from 'react';
import { Search, BookOpen, MessageCircle, Instagram, Globe, MapPin, Sparkles } from 'lucide-react';

export default function DirectorioView({ directorio }) {
  const [search, setSearch] = useState('');

  const rubros = Object.keys(directorio || {}).sort();

  const formatWhatsAppUrl = (phone, name) => {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length >= 10 && !clean.startsWith('54')) clean = '549' + clean;
    const msg = encodeURIComponent(`¡Hola ${name}! Te encuentro a través de las Páginas Amarillas de Loma Verde ♒`);
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

  // Filtered entries
  let totalMatches = 0;
  const filteredRubros = rubros.map((rubro) => {
    const emprendedores = directorio[rubro] || [];
    const query = search.toLowerCase();
    
    const filtrados = emprendedores.filter((emp) => {
      if (!search.trim()) return true;
      return (
        emp.nombre.toLowerCase().includes(query) ||
        (emp.nombrePersonal && emp.nombrePersonal.toLowerCase().includes(query)) ||
        rubro.toLowerCase().includes(query) ||
        (emp.descripcion && emp.descripcion.toLowerCase().includes(query))
      );
    });

    totalMatches += filtrados.length;
    return { rubro, filtrados };
  }).filter((item) => item.filtrados.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Cabecera Header Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <span className="bg-loma-accent/20 text-loma-accent font-extrabold text-xs uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1 mb-2">
          <BookOpen className="w-3.5 h-3.5" /> Directorio Abierto
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-loma-green uppercase tracking-tight">
          Páginas Amarillas de Loma Verde 📖
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-2">
          Directorio histórico de emprendedores, artesanos y terapeutas locales. ¡Apoyemos la economía de nuestro barrio!
        </p>

        {/* Buscador en Vivo */}
        <div className="mt-6 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-loma-wood" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por emprendimiento, producto, rubro o nombre..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full border-2 border-loma-accent bg-[#faf9f5] text-sm sm:text-base font-semibold text-loma-green placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-loma-accent shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {filteredRubros.length > 0 ? (
        <div className="space-y-12">
          {filteredRubros.map(({ rubro, filtrados }) => (
            <div key={rubro}>
              <div className="flex items-center gap-3 border-b-2 border-loma-accent pb-2 mb-6">
                <h2 className="font-serif text-2xl font-bold text-loma-wood">
                  {rubro}
                </h2>
                <span className="text-xs font-bold bg-loma-accent/20 text-loma-accent px-2.5 py-0.5 rounded-full">
                  {filtrados.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtrados.map((emp, idx) => (
                  <div
                    key={emp.id || idx}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-loma-wood transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-serif text-lg font-bold text-loma-green">
                        {emp.nombre}
                      </h4>
                      {emp.nombrePersonal && (
                        <p className="text-xs font-bold text-loma-wood mt-0.5 mb-2">
                          👤 {emp.nombrePersonal}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mt-2">
                        {emp.descripcion || emp.desc || 'Emprendedor de Loma Verde.'}
                      </p>
                    </div>

                    {/* Botones de Redes Sociales */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      {emp.contacto && (
                        <a
                          href={formatWhatsAppUrl(emp.contacto, emp.nombre)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {emp.instagram && (
                        <a
                          href={formatInstagramUrl(emp.instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Instagram className="w-3.5 h-3.5 text-pink-600" />
                          <span>Instagram</span>
                        </a>
                      )}

                      {emp.tienda && (
                        <a
                          href={formatWebUrl(emp.tienda)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tienda</span>
                        </a>
                      )}

                      {emp.mapa && (
                        <a
                          href={formatWebUrl(emp.mapa)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>Maps</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-loma-wood text-center text-gray-500 italic max-w-md mx-auto">
          No se encontraron emprendimientos que coincidan con <strong>"{search}"</strong>.
        </div>
      )}

    </div>
  );
}
