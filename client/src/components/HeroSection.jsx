import React from 'react';
import { Calendar, MapPin, Sparkles, Moon, Sun, ArrowRight, Newspaper, HeartHandshake } from 'lucide-react';
import { getLunarPhase } from '../utils/lunarCalc';

export default function HeroSection({ config, noticias, setActiveTab, openTroquelModal }) {
  const moon = getLunarPhase();

  return (
    <div className="relative overflow-hidden pb-12">
      
      {/* 1. Personaje de Bienvenida */}
      <div className="flex flex-col items-center mt-6 sm:mt-10 px-4">
        <div className="relative animate-float">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-loma-green shadow-xl bg-loma-wood flex items-center justify-center text-4xl sm:text-5xl text-white relative z-10 overflow-hidden bg-gradient-to-b from-loma-wood to-loma-green">
            <span>♒</span>
          </div>
          <div className="absolute -bottom-2 right-0 bg-loma-accent text-white p-1.5 rounded-full border-2 border-white text-xs shadow-md z-20">
            {moon.emoji}
          </div>
        </div>

        {/* Burbuja de Diálogo */}
        <div className="bg-white px-6 py-4 rounded-2xl border-2 border-loma-green shadow-[4px_4px_0px_rgba(43,83,41,0.15)] max-w-lg text-center -mt-4 z-0 relative">
          <p className="font-serif text-loma-green text-base sm:text-lg leading-relaxed">
            <strong className="text-loma-accent font-bold block mb-1">¡Te damos la bienvenida a la plaza! ♒🌬️</strong>
            La energía lunar nos convoca a tejer comunidad, compartir saberes y practicar la economía fraterna.
          </p>
        </div>
      </div>

      {/* 2. Cabecera Principal / Glass Card */}
      <div className="max-w-4xl mx-auto px-4 mt-8 text-center">
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border-2 border-loma-green shadow-[8px_8px_0px_rgba(43,83,41,0.1)]">
          
          {/* Badge Luna Activa + Fase Astronómica en vivo */}
          <div className="inline-flex items-center gap-2 bg-loma-wood/15 text-loma-wood border border-loma-wood/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <span className="text-base">{moon.emoji}</span>
            <span>{config?.subtitulo || 'Luna en Acuario'}</span>
            <span className="hidden sm:inline">• {moon.illumination}% Iluminación</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-loma-green font-bold uppercase tracking-tight mb-2">
            {config?.nombreEvento || 'Encuentro Vecinal'}
          </h1>
          
          <h2 className="font-serif text-xl sm:text-2xl text-loma-wood font-semibold mb-6">
            {config?.motto || 'Celebramos el Día de la Pachamama 🌿'}
          </h2>

          {/* Metadata de Fecha y Lugar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-loma-wood/20 text-sm sm:text-base text-loma-green font-semibold">
            <div className="flex items-center gap-2 bg-loma-bg px-4 py-2 rounded-xl border border-loma-wood/20">
              <Calendar className="w-5 h-5 text-loma-accent" />
              <span>{config?.fechaEvento || 'Sábado 1º de Agosto de 12 a 18hs'}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-loma-bg px-4 py-2 rounded-xl border border-loma-wood/20">
              <MapPin className="w-5 h-5 text-loma-accent" />
              <span>{config?.lugar || 'Plaza La Misión y Nigromante • Loma Verde'}</span>
            </div>
          </div>

          {/* Botones de Acción Rápida en el Hero */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab('virtudes')}
              className="bg-loma-green text-white px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md hover:bg-loma-wood hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>🍯 Entrar al Mercado de Virtudes</span>
            </button>
            <button
              onClick={() => setActiveTab('presupuesto')}
              className="bg-loma-accent text-white px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md hover:bg-amber-600 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>🗳️ Presupuesto Participativo</span>
            </button>
            <button
              onClick={() => setActiveTab('feria')}
              className="bg-white text-loma-green border-2 border-loma-green px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-loma-bg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>🌿 Sumar mi Emprendimiento</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mística del Ciclo + Novedades de la Cartelera */}
      <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mística del Ciclo (2 columnas en desktop) */}
        <div className="md:col-span-2 bg-white/95 p-6 sm:p-8 rounded-2xl border border-loma-wood shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-loma-accent font-serif font-bold text-lg mb-3">
              <Sparkles className="w-5 h-5" />
              <span>Mística del Ciclo Sincrónico</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line mb-4">
              {config?.mistica || 'Acuario nos invita a la innovación, al poder de la red y a pensar en el futuro de nuestra comunidad. En este encuentro unimos la visión comunitaria con nuestras raíces en la tierra.'}
            </p>
          </div>

          <div className="bg-loma-wood/10 p-4 rounded-xl border-l-4 border-loma-green flex items-center gap-3">
            <div className="text-2xl">{moon.emoji}</div>
            <div className="text-xs sm:text-sm text-loma-green">
              <strong>Fase actual: {moon.name} ({moon.illumination}%)</strong>
              <p className="text-gray-600 text-xs mt-0.5">{moon.desc}</p>
            </div>
          </div>
        </div>

        {/* Acceso Rápido Billetera Troquel */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-6 sm:p-8 rounded-2xl border-2 border-loma-accent shadow-sm flex flex-col justify-between">
          <div>
            <span className="bg-loma-accent text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider inline-block mb-3">
              Economía Fraterna
            </span>
            <h3 className="font-serif text-xl font-bold text-loma-green mb-2">
              Troqueles Comunitarios
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
              Aporta al fondo del encuentro y recibe tu número de troquel con código QR para canjear productos orgánicos y artesanías de los vecinos.
            </p>
          </div>

          <button
            onClick={openTroquelModal}
            className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow transition-all text-center flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Generar / Ver mi Troquel</span>
          </button>
        </div>
      </div>

      {/* 4. Cartelera de Noticias */}
      {noticias && noticias.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-12">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Newspaper className="w-6 h-6 text-loma-accent" />
            <h2 className="font-serif text-2xl sm:text-3xl text-loma-green font-bold text-center">
              Novedades de la Cartelera 📝
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {noticias.map((n) => (
              <div 
                key={n.id} 
                className="bg-white rounded-2xl border border-loma-wood overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {n.img && (
                  <img 
                    src={n.img} 
                    alt={n.titulo} 
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-loma-green mb-2">
                      {n.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {n.texto}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-loma-wood font-semibold">
                    <span>{n.fecha || 'Ciclo Activo'}</span>
                    <span className="text-loma-accent uppercase tracking-wider">Comunidad Loma Verde</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
