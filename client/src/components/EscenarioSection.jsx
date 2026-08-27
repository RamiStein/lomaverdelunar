import React, { useState } from 'react';
import { Music, Sparkles, Instagram, MessageCircle, Mic2, Heart } from 'lucide-react';

export default function EscenarioSection({ directorio }) {
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Extract artists & musicians
  const musicCategories = ['Música / Arte', 'Cultura'];
  let artists = [];
  
  Object.keys(directorio || {}).forEach(cat => {
    if (cat.toLowerCase().includes('música') || cat.toLowerCase().includes('musica') || cat.toLowerCase().includes('arte') || cat.toLowerCase().includes('cultura')) {
      artists = [...artists, ...(directorio[cat] || [])];
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Cabecera */}
      <div className="text-center mb-10">
        <span className="bg-loma-accent/20 text-loma-accent font-extrabold text-xs uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1 mb-2">
          <Music className="w-3.5 h-3.5" /> Escenario y Cultura
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-loma-green font-bold uppercase tracking-tight">
          Pulso Cultural del Encuentro 🎸🎨
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-2">
          Músicos, poetas, talleristas y creadores que llenan la plaza de resonancia, cantos a la tierra y arte en vivo.
        </p>
      </div>

      {/* Grid de Artistas */}
      {artists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((art, idx) => (
            <div
              key={art.id || idx}
              onClick={() => setSelectedArtist(art)}
              className="bg-white rounded-2xl border-2 border-loma-green p-6 shadow-[5px_5px_0px_rgba(43,83,41,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#c48c26] hover:border-loma-accent transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-loma-wood text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    🎸 Música & Arte
                  </span>
                  {art.puestoAsignado && (
                    <span className="text-[11px] font-bold text-loma-accent">
                      {art.puestoAsignado}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-loma-green">
                  {art.nombre}
                </h3>
                {art.nombrePersonal && (
                  <p className="text-xs font-semibold text-loma-wood mb-3">
                    Integrantes: {art.nombrePersonal}
                  </p>
                )}

                <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                  {art.descripcion}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-loma-accent uppercase tracking-wider">
                  Conocer Artista +
                </span>
                <Mic2 className="w-4 h-4 text-loma-wood" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-loma-wood text-center text-gray-500 italic max-w-md mx-auto">
          Próximamente se anunciará la grilla artística del escenario.
        </div>
      )}

      {/* Modal Artista */}
      {selectedArtist && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedArtist(null)}
        >
          <div 
            className="bg-loma-bg border-3 border-loma-accent p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="bg-loma-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full inline-block mb-3">
              Escenario Comunitario
            </span>

            <h3 className="font-serif text-2xl font-bold text-loma-green">
              {selectedArtist.nombre}
            </h3>

            {selectedArtist.nombrePersonal && (
              <p className="text-xs font-bold text-loma-wood mt-1">
                {selectedArtist.nombrePersonal}
              </p>
            )}

            <div className="bg-white p-4 rounded-xl border border-loma-wood/20 my-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedArtist.descripcion}
            </div>

            <div className="space-y-2 mt-4">
              {selectedArtist.instagram && (
                <a
                  href={`https://instagram.com/${selectedArtist.instagram.replace('@','')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Escuchar / Ver en Instagram</span>
                </a>
              )}

              {selectedArtist.contacto && (
                <a
                  href={`https://wa.me/${selectedArtist.contacto.replace(/[^0-9]/g,'')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedArtist(null)}
                className="text-xs font-bold text-loma-wood hover:text-loma-green uppercase tracking-wider"
              >
                [ Volver al Escenario ]
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
