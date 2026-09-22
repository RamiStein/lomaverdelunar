import React, { useState } from 'react';
import { 
  Moon, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ChevronRight, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  CheckCircle2
} from 'lucide-react';
import { getLunarPhase } from '../utils/lunarCalc';

export default function CiclosLunaresSection({ config, onOpenInscripcion }) {
  const moon = getLunarPhase();
  const proximasLunas = config?.proximasLunas || [];
  const lunaActiva = proximasLunas[0] || {
    lunaActiva: config?.lunaActiva || 'Luna Aries',
    signo: config?.signo || 'Aries',
    simboloZodiacal: config?.simboloZodiacal || '♈',
    elemento: config?.elemento || 'Fuego Cardinal 🔥',
    fechaEventoTexto: config?.fechaEventoTexto || '3 DE OCTUBRE',
    diaSemanaTexto: config?.diaSemanaTexto || 'SÁBADO',
    horarioTexto: config?.horarioTexto || 'DE 13 A 19 HS',
    lugarTexto: config?.lugarTexto || 'Plaza La Misión y Nigromante • Loma Verde',
    lema: config?.lema || 'Impulso, vitalidad, coraje emprendedor y nuevos comienzos bajo el sol de primavera.',
    mistica: config?.mistica || 'La Luna Llena en Aries despierta el fuego creador y la chispa pionera. Es el momento de dar el primer paso, activar nuevos proyectos en el barrio y expresar la fuerza viva de nuestra comunidad.',
    diasFaltantes: 15,
    tags: config?.tags || ['Fuego Creador', 'Iniciativa', 'Primavera']
  };

  const [selectedLunaDetalle, setSelectedLunaDetalle] = useState(null);

  const getElementoIcon = (elemento = '') => {
    const el = elemento.toLowerCase();
    if (el.includes('fuego')) return <Flame className="w-4 h-4 text-amber-500" />;
    if (el.includes('agua')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (el.includes('aire')) return <Wind className="w-4 h-4 text-teal-500" />;
    return <Mountain className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      
      {/* CABECERA DE SECCIÓN */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300/60 shadow-xs">
          <Moon className="w-3.5 h-3.5 text-amber-600" />
          <span>Sincronía 13:20 • Plenilunios en Loma Verde</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-loma-green">
          ¿Dónde estamos ahora?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          La rueda del tiempo natural avanza. Conoce el ciclo que estamos transitando y el sendero de las próximas lunas llenas.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. TARJETA DESTACADA: EL CICLO ACTUAL Y PRÓXIMA LUNA LLENA                */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/40 to-emerald-50/40 rounded-3xl border-2 border-loma-green shadow-xl p-6 sm:p-10 mb-10 backdrop-blur-xs">
        {/* Decoración resplandor */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          
          {/* Lado Izquierdo: Simbología Lunar y Cuenta Regresiva */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left shrink-0">
            <div className="relative mb-3">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-200 via-amber-300 to-yellow-500 border-4 border-white shadow-2xl flex items-center justify-center text-5xl sm:text-6xl text-loma-green">
                <span className="drop-shadow-md">{lunaActiva.simboloZodiacal}</span>
              </div>
              <span className="absolute -bottom-2 right-0 text-2xl sm:text-3xl">🌿</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-800 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CICLO ACTIVO ACTUAL</span>
            </div>

            {lunaActiva.diasFaltantes !== undefined && (
              <div className="text-xs font-mono font-bold text-loma-wood">
                ⏳ {lunaActiva.diasFaltantes === 0 ? '¡Hoy es el Plenilunio!' : `Faltan ${lunaActiva.diasFaltantes} días para el encuentro`}
              </div>
            )}
          </div>

          {/* Lado Central: Textos, Fecha y Mística */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
              <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-extrabold flex items-center gap-1.5 border border-amber-300/40">
                {getElementoIcon(lunaActiva.elemento)}
                <span>{lunaActiva.elemento}</span>
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                Fase celeste hoy: {moon.name} ({moon.illumination}%)
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-loma-green leading-tight">
              Próximo Encuentro: {lunaActiva.lunaActiva} {lunaActiva.simboloZodiacal}
            </h3>

            {/* Fecha y Lugar destacados */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-bold text-gray-700 pt-1">
              <div className="flex items-center gap-1.5 text-loma-wood font-mono bg-white/90 px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
                <Calendar className="w-4 h-4 text-loma-accent" />
                <span>{lunaActiva.diaSemanaTexto} {lunaActiva.fechaEventoTexto} • {lunaActiva.horarioTexto}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
                <MapPin className="w-4 h-4 text-loma-green" />
                <span>{lunaActiva.lugarTexto || 'Plaza La Misión • Loma Verde'}</span>
              </div>
            </div>

            {/* Lema e intención */}
            <p className="font-serif italic text-sm sm:text-base text-loma-wood leading-relaxed pt-1">
              "{lunaActiva.lema}"
            </p>

            {/* Mística barrial */}
            <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
              {lunaActiva.mistica}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1 justify-center lg:justify-start">
              {(lunaActiva.tags || []).map((t, idx) => (
                <span key={idx} className="text-[11px] bg-white border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Lado Derecho: Acción Directa */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                if (onOpenInscripcion) onOpenInscripcion();
              }}
              className="w-full sm:w-auto bg-loma-green hover:bg-loma-wood text-white px-6 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Anotarme como Feriante</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-gray-500 text-center">
              Inscripción abierta para {lunaActiva.signo}
            </span>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SENDERO CONSECUTIVO DE LAS PRÓXIMAS LUNAS LLENAS (Rueda 13:20)         */}
      {/* ========================================================================= */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-loma-green flex items-center gap-2">
              <span>El Sendero Consecutivo de las Próximas Lunas</span>
              <span className="text-xs bg-loma-accent/20 text-loma-accent font-extrabold px-2.5 py-0.5 rounded-full">
                {proximasLunas.length} ciclos programados
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Así continúa el calendario natural plenilunio a plenilunio para que puedas agendar tus ferias y encuentros.
            </p>
          </div>
        </div>

        {/* Carrusel / Grilla de Próximas Lunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proximasLunas.map((luna, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={luna.id || idx}
                onClick={() => setSelectedLunaDetalle(luna)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isFirst
                    ? 'bg-gradient-to-br from-amber-50 to-emerald-50/50 border-loma-green shadow-md ring-2 ring-loma-green/20'
                    : 'bg-white hover:bg-amber-50/30 border-gray-200 hover:border-loma-wood/40 shadow-xs'
                }`}
              >
                {isFirst && (
                  <span className="absolute top-3 right-3 bg-loma-green text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    ¡La Próxima!
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                      {luna.simboloZodiacal}
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-loma-wood uppercase">
                        #{idx + 1} en el ciclo
                      </div>
                      <h4 className="font-serif font-bold text-base text-loma-green leading-tight">
                        {luna.lunaActiva}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs font-mono font-bold text-loma-accent mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{luna.diaSemanaTexto} {luna.fechaEventoTexto}</span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 italic mb-3">
                    "{luna.lema}"
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                  <span className="text-gray-500 flex items-center gap-1 font-semibold">
                    {getElementoIcon(luna.elemento)}
                    <span>{luna.elemento.split(' ')[0]}</span>
                  </span>
                  <span className="font-bold text-loma-green flex items-center gap-0.5 hover:underline">
                    <span>Ver mística</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Detalle Místico de Cualquier Luna */}
      {selectedLunaDetalle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-loma-green shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl">
                  {selectedLunaDetalle.simboloZodiacal}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-loma-green leading-tight">
                    {selectedLunaDetalle.lunaActiva}
                  </h3>
                  <span className="text-xs font-bold text-loma-wood">
                    {selectedLunaDetalle.elemento}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLunaDetalle(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/70 text-xs space-y-1 font-mono">
              <div className="font-bold text-loma-green flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-loma-accent" />
                <span>Fecha: {selectedLunaDetalle.diaSemanaTexto} {selectedLunaDetalle.fechaEventoTexto}</span>
              </div>
              <div className="text-gray-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Horario: {selectedLunaDetalle.horarioTexto}</span>
              </div>
              <div className="text-gray-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>Lugar: {selectedLunaDetalle.lugarTexto}</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif italic text-sm text-loma-wood font-bold mb-1">
                Lema e Intención Comunitaria:
              </h4>
              <p className="text-xs text-gray-700 italic bg-[#faf9f5] p-3 rounded-xl border border-gray-200">
                "{selectedLunaDetalle.lema}"
              </p>
            </div>

            <div>
              <h4 className="font-serif text-sm text-loma-green font-bold mb-1">
                Mística del Plenilunio:
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedLunaDetalle.mistica}
              </p>
            </div>

            <button
              onClick={() => setSelectedLunaDetalle(null)}
              className="w-full py-2.5 rounded-xl bg-loma-green text-white font-bold uppercase text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
