import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Moon, Sun, ArrowRight, Newspaper, HeartHandshake, Download, Eye, X, Compass, Feather } from 'lucide-react';
import { getLunarPhase } from '../utils/lunarCalc';

export default function HeroSection({ config, noticias, setActiveTab, openTroquelModal }) {
  const moon = getLunarPhase();
  const [showFlyerModal, setShowFlyerModal] = useState(false);

  const signoSimbolo = config?.signo === 'Piscis' ? '♓' : (config?.signo === 'Acuario' ? '♒' : '🌙');
  const nombreLuna = config?.subtitulo || 'Luna Llena en Piscis ♓';

  return (
    <div className="relative overflow-hidden pb-16">
      
      {/* ========================================================================= */}
      {/* FONDO DECORATIVO INSPIRADO EN EL FLYER (Atmósfera de Parque, Sol y Guirnaldas) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Luz solar cálida superior derecha */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/40 via-yellow-100/30 to-transparent blur-3xl" />
        {/* Brillo lunar sutil superior izquierdo */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-100/40 via-teal-50/20 to-transparent blur-2xl" />
        
        {/* Banderines / Guirnalda festiva decorativa (SVG) */}
        <div className="w-full flex justify-center opacity-80 pt-1">
          <svg className="w-full max-w-5xl h-12 text-loma-green" viewBox="0 0 1000 60" fill="none" preserveAspectRatio="none">
            <path d="M0,5 Q250,30 500,10 Q750,30 1000,5" stroke="#2b5329" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            {/* Banderines 1 */}
            <polygon points="50,9 70,36 90,12" fill="#c48c26" />
            <polygon points="130,15 150,42 170,18" fill="#2b5329" />
            <polygon points="210,21 230,48 250,24" fill="#65773e" />
            <polygon points="290,24 310,50 330,23" fill="#d97706" />
            <polygon points="370,20 390,46 410,17" fill="#2b5329" />
            <polygon points="450,13 470,39 490,11" fill="#c48c26" />
            {/* Banderines 2 */}
            <polygon points="530,11 550,38 570,14" fill="#65773e" />
            <polygon points="610,18 630,45 650,21" fill="#c48c26" />
            <polygon points="690,23 710,49 730,24" fill="#2b5329" />
            <polygon points="770,22 790,48 810,19" fill="#d97706" />
            <polygon points="850,16 870,42 890,13" fill="#65773e" />
            <polygon points="930,8 950,34 970,5" fill="#c48c26" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. LUNA GRANDE Y HEADER CENTRAL VINTAGE DEL FLYER */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 text-center">
        
        {/* LUNA DORADA RADIANTE CON LAURELES BOTÁNICOS */}
        <div className="relative inline-flex flex-col items-center mb-4 group cursor-pointer" onClick={() => setShowFlyerModal(true)}>
          <div className="relative">
            {/* Resplandor áureo */}
            <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-xl scale-125 animate-pulse" />
            
            {/* Disco Lunar */}
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-amber-200/90 shadow-[0_10px_35px_rgba(196,140,38,0.45)] bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-500 relative z-10 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
              {/* Textura de cráteres lunares estilizada */}
              <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[radial-gradient(circle_at_30%_35%,rgba(168,111,20,0.6)_8%,transparent_25%),radial-gradient(circle_at_70%_60%,rgba(168,111,20,0.5)_14%,transparent_35%),radial-gradient(circle_at_45%_75%,rgba(168,111,20,0.4)_10%,transparent_30%)]" />
              <span className="text-5xl sm:text-7xl drop-shadow-md select-none transform hover:rotate-6 transition-transform">
                {signoSimbolo}
              </span>
            </div>

            {/* Guirnalda / Laureles botánicos alrededor */}
            <div className="absolute -inset-4 sm:-inset-6 z-20 pointer-events-none flex items-center justify-between">
              <span className="text-2xl sm:text-4xl transform -rotate-45 drop-shadow">🌿</span>
              <span className="text-2xl sm:text-4xl transform rotate-45 drop-shadow">🌿</span>
            </div>
          </div>

          {/* Badge informativo de fase en vivo */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/95 text-loma-green border border-loma-wood/40 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            <span>{moon.emoji}</span>
            <span>Fase actual: {moon.name} ({moon.illumination}%)</span>
          </div>
        </div>

        {/* CINTA / BANNER SUPERIOR: ENCUENTRO VECINAL */}
        <div className="mt-2 mb-3">
          <span className="inline-block bg-loma-green text-amber-100 font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-lg shadow-md border border-amber-300/40 relative">
            ✦ ENCUENTRO VECINAL ✦
          </span>
        </div>

        {/* TÍTULO PRINCIPAL: LUNA LLENA EN PISCIS */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-loma-green tracking-tight drop-shadow-sm uppercase">
          LUNA LLENA
        </h1>
        <p className="font-serif italic text-2xl sm:text-4xl text-loma-wood font-normal -mt-1 sm:-mt-2 mb-6 flex items-center justify-center gap-2">
          <span>en {config?.signo || 'Piscis'}</span>
          <span className="text-3xl text-loma-accent font-bold not-italic">{signoSimbolo}</span>
        </p>

        {/* PLACA ORNAMENTADA DE FECHA Y HORARIO (Idéntica al Flyer) */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-amber-50/95 to-white/95 border-2 border-loma-accent/60 p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_rgba(43,83,41,0.12)] relative backdrop-blur-xs">
          
          {/* SÁBADO */}
          <div className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-loma-accent flex items-center justify-center gap-2 mb-1">
            <span>🌾</span>
            <span>SÁBADO</span>
            <span>🌾</span>
          </div>

          {/* 5 DE SEPTIEMBRE */}
          <div className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-loma-green tracking-tight my-1">
            5 DE SEPTIEMBRE
          </div>

          {/* DE 12 A 18 HS */}
          <div className="font-serif text-lg sm:text-2xl font-bold text-loma-wood tracking-wide mt-1 mb-4 flex items-center justify-center gap-2">
            <span>✦</span>
            <span>DE 12 A 18 HS</span>
            <span>✦</span>
          </div>

          {/* PLACA VERDE DE UBICACIÓN */}
          <div className="bg-loma-green text-white p-3 sm:p-4 rounded-2xl shadow-inner border border-emerald-900/40 max-w-lg mx-auto">
            <div className="font-serif font-bold text-sm sm:text-base tracking-wider uppercase">
              LOMA VERDE • ESCOBAR
            </div>
            <div className="text-xs sm:text-sm text-emerald-100 flex items-center justify-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Plaza La Misión y Nigromante</span>
            </div>
          </div>

          {/* LEMA INSPIRADOR */}
          <p className="font-serif italic text-sm sm:text-base text-gray-700 mt-5 max-w-md mx-auto leading-relaxed">
            "{config?.motto || 'Un encuentro para compartir, conectar y fortalecer nuestra comunidad.'} ♡"
          </p>

          {/* BOTONES DE ACCIÓN RÁPIDA */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 pt-5 border-t border-loma-accent/20">
            <button
              onClick={() => setActiveTab('feria')}
              className="bg-loma-green hover:bg-loma-wood text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>🌿 Inscribir Emprendimiento</span>
            </button>
            <button
              onClick={() => setActiveTab('virtudes')}
              className="bg-loma-accent hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>🍯 Mercado de Virtudes</span>
            </button>
            <button
              onClick={() => setShowFlyerModal(true)}
              className="bg-white hover:bg-amber-50 text-loma-green border-2 border-loma-green px-4 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:-translate-y-0.5 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4 text-loma-accent" />
              <span>Ver Flyer Oficial</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SECCIÓN DESTACADA: MÍSTICA DE LA LUNA LLENA EN PISCIS ♓ */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-emerald-900 via-loma-green to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-300/40 relative overflow-hidden">
          
          {/* Decoración astronómica de fondo */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 text-9xl opacity-10 select-none pointer-events-none font-serif">
            ♓
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Texto de Mística (2 Columnas) */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mística del Ciclo Sincrónico</span>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mb-3">
                La Magia de la Luna Llena en Piscis ♓🌊
              </h2>
              
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-4">
                {config?.mistica || 'La Luna Llena en Piscis nos invita a sumergirnos en la sensibilidad, la empatía profunda y la creatividad colectiva. Piscis es el signo del agua que todo lo abraza, recordándonos que somos parte de un mismo tejido vivo. En este encuentro, unimos el arte, la música del corazón, la economía fraterna y el cuidado mutuo para fortalecer los lazos de nuestra comunidad en Loma Verde.'}
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-amber-200/90 pt-2 border-t border-emerald-700/50">
                <span className="flex items-center gap-1">✨ Frecuencia 13:20</span>
                <span className="flex items-center gap-1">🌱 Economía Fraterna</span>
                <span className="flex items-center gap-1">🎶 Música y Arte en Vivo</span>
                <span className="flex items-center gap-1">🍯 Trueque & Troqueles</span>
              </div>
            </div>

            {/* Pizarra de Convocatoria (Estilo Caballete del Flyer) */}
            <div className="bg-stone-900 border-4 border-amber-800/80 p-5 rounded-2xl shadow-2xl text-center transform lg:rotate-1 hover:rotate-0 transition-transform">
              <div className="border border-dashed border-stone-600 p-4 rounded-xl">
                <span className="text-xs font-extrabold uppercase text-amber-400 tracking-widest block mb-1">
                  ✦ CONVOCATORIA ✦
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 leading-tight">
                  Abierta para Feriantes y Artistas
                </h3>
                <div className="text-2xl my-2 text-rose-300">♡</div>
                <p className="text-stone-300 text-xs leading-relaxed mb-3">
                  ¿Tienes una propuesta artesanal, gastronómica, artística u holística? ¡Súmate a la red!
                </p>
                <button
                  onClick={() => setActiveTab('registro')}
                  className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-lg shadow transition-all"
                >
                  Inscribirme Ahora
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ECONOMÍA FRATERNA & TROQUELES */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Billetera de Troqueles */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 p-6 sm:p-8 rounded-3xl border-2 border-loma-accent/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="bg-loma-accent text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider inline-block mb-3">
              Economía Comunitaria
            </span>
            <h3 className="font-serif text-2xl font-bold text-loma-green mb-2">
              Troqueles Digitales QR 🎫
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
              Genera tu troquel digital para apoyar el fondo común vecinal y canjearlo en los puestos de la plaza por ricas comidas, plantines y artesanías.
            </p>
          </div>

          <button
            onClick={openTroquelModal}
            className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow transition-all text-center flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Generar / Consultar mi Troquel</span>
          </button>
        </div>

        {/* Presupuesto Participativo */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-loma-green shadow-sm flex flex-col justify-between">
          <div>
            <span className="bg-loma-green text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider inline-block mb-3">
              Votación Vecinal
            </span>
            <h3 className="font-serif text-2xl font-bold text-loma-green mb-2">
              Presupuesto Participativo 🗳️
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
              Conoce los proyectos en evaluación para mejorar la Plaza La Misión y los espacios públicos de Loma Verde. Tu voto decide la prioridad.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('presupuesto')}
            className="w-full bg-loma-green hover:bg-loma-wood text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Ver Proyectos y Votar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. CARTELERA DE NOTICIAS */}
      {/* ========================================================================= */}
      {noticias && noticias.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-12">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Newspaper className="w-6 h-6 text-loma-accent" />
            <h2 className="font-serif text-2xl sm:text-3xl text-loma-green font-bold text-center">
              Cartelera del Encuentro 📝
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {noticias.map((n) => (
              <div 
                key={n.id} 
                className="bg-white rounded-3xl border border-loma-wood overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
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
                    <span>{n.fecha || 'Ciclo Piscis'}</span>
                    <span className="text-loma-accent uppercase tracking-wider">Loma Verde Lunar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE PREVISUALIZACIÓN DEL FLYER OFICIAL */}
      {/* ========================================================================= */}
      {showFlyerModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFlyerModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border-2 border-loma-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif font-bold text-lg text-loma-green">
                Flyer Oficial • Luna Llena en Piscis ♓
              </h3>
              <button 
                onClick={() => setShowFlyerModal(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <img 
                src="/flyer-piscis.jpg" 
                alt="Flyer Oficial Luna Llena en Piscis" 
                className="w-full h-auto object-contain max-h-[70vh] mx-auto"
              />
            </div>

            <div className="mt-4 flex justify-between items-center gap-2">
              <span className="text-xs text-gray-500">
                Sábado 5 de Septiembre • 12 a 18 hs
              </span>
              <a 
                href="/flyer-piscis.jpg" 
                download="Flyer_Loma_Verde_Luna_Piscis.jpg"
                className="bg-loma-green hover:bg-loma-wood text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Descargar HD</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
