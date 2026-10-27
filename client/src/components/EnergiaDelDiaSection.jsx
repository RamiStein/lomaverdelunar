import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Share2, 
  Check, 
  Copy, 
  ArrowRight, 
  Compass, 
  Feather, 
  Flame, 
  Wind, 
  Heart, 
  RefreshCw, 
  BookOpen, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Zap,
  Radio,
  Globe
} from 'lucide-react';
import { 
  getEnergiaDelDia, 
  generarMensajeWhatsAppEnergia, 
  getKinDataByNumber, 
  CASTILLOS 
} from '../utils/energiaCalc';

function MayaToneGlyph({ tono, className = "", dark = false }) {
  const num = parseInt(tono, 10) || 1;
  const bars = Math.floor(num / 5);
  const dots = num % 5;
  const dotColor = dark ? "bg-amber-300 border-amber-400" : "bg-stone-900 border-stone-800";
  const barColor = dark ? "bg-amber-300 border-amber-400" : "bg-stone-900 border-stone-800";

  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${className}`}>
      {/* Puntos (dots) */}
      {dots > 0 && (
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: dots }).map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full border shadow-2xs ${dotColor}`}
            />
          ))}
        </div>
      )}
      {/* Barras (bars) */}
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-8 h-1.5 rounded-full border shadow-2xs ${barColor}`}
        />
      ))}
    </div>
  );
}

function getSelloCardStyle(color) {
  const c = (color || '').toLowerCase();
  if (c.includes('rojo')) {
    return 'bg-gradient-to-b from-rose-50/90 to-white border-rose-300 text-rose-950';
  }
  if (c.includes('blanco')) {
    return 'bg-gradient-to-b from-slate-50/90 to-white border-slate-300 text-slate-900';
  }
  if (c.includes('azul')) {
    return 'bg-gradient-to-b from-blue-50/90 to-white border-blue-300 text-blue-950';
  }
  if (c.includes('amarillo')) {
    return 'bg-gradient-to-b from-amber-50/90 to-white border-amber-300 text-amber-950';
  }
  return 'bg-white border-stone-300 text-stone-900';
}

const getAspectoBadgeClass = (tipo) => {
  const t = (tipo || '').toUpperCase();
  if (t.includes('ARMÓNICO') || t.includes('FLUIDO') || t.includes('TRÍGONO') || t.includes('SEXTIL')) {
    return 'bg-emerald-100 text-emerald-950 border-emerald-300';
  }
  if (t.includes('REVISIÓN') || t.includes('TENSIÓN') || t.includes('CUADRATURA') || t.includes('OPOSICIÓN')) {
    return 'bg-amber-100 text-amber-950 border-amber-300';
  }
  if (t.includes('DIRECTO') || t.includes('EVOLUCIÓN') || t.includes('CONJUNCIÓN')) {
    return 'bg-blue-100 text-blue-950 border-blue-300';
  }
  return 'bg-stone-100 text-stone-900 border-stone-300';
};

export default function EnergiaDelDiaSection({ config, onGoToInscripcion, onGoToLunas, onBackToHome }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    };
    const interval = setInterval(checkDate, 60000);
    window.addEventListener('focus', checkDate);
    document.addEventListener('visibilitychange', checkDate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDate);
      document.removeEventListener('visibilitychange', checkDate);
    };
  }, [currentDate]);

  const energia = getEnergiaDelDia(config, currentDate);
  const [selectedKinNumero, setSelectedKinNumero] = useState(null);
  const baseKin = selectedKinNumero 
    ? getKinDataByNumber(selectedKinNumero, energia?.maya?.kinNumero || 50) 
    : (energia?.maya || getKinDataByNumber(50, 50));
  const kinActivo = (baseKin?.oraculo?.guia?.sello) 
    ? baseKin 
    : { ...getKinDataByNumber(baseKin?.kinNumero || 50, energia?.maya?.kinNumero || 50), ...baseKin };
  const [copiedLink, setCopiedLink] = useState(false);
  const [mostrarOraculoDetalle, setMostrarOraculoDetalle] = useState(false);
  const [activeTabDetalle, setActiveTabDetalle] = useState('todo'); // 'todo', 'astrologia', 'maya', 'barrio'
  const [mostrarReferencias, setMostrarReferencias] = useState(false);

  const handleShare = async () => {
    const textoWa = generarMensajeWhatsAppEnergia(energia);
    const urlCompartir = 'https://lomaverdelunar.online/energia';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Energía de Hoy • ${energia.sol.signo} - ${energia.luna.signo} • Kin ${energia.maya.kinNombre}`,
          text: `Sol en ${energia.sol.signo}, Luna en ${energia.luna.signo}. Kin Maya: ${energia.maya.kinNombre} (${energia.maya.ondaEncantada}). Sintonía comunitaria en Loma Verde:`,
          url: urlCompartir
        });
        return;
      } catch (err) {
        // Fallback al portapapeles o WhatsApp
      }
    }

    try {
      await navigator.clipboard.writeText(`https://lomaverdelunar.online/energia`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      // Ignorar
    }
  };

  const handleWhatsAppDirecto = async () => {
    const textoWa = generarMensajeWhatsAppEnergia(energia);
    try {
      await navigator.clipboard.writeText(textoWa);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // Ignorar
    }
    window.open(`https://api.whatsapp.com/send/?text=${encodeURIComponent(textoWa)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. CABECERA MÍSTICA VINTAGE LOMA VERDE                                    */}
      {/* ========================================================================= */}
      <header className="relative text-center max-w-3xl mx-auto space-y-4 pt-6 pb-6 px-6 sm:px-10 bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-md">
        
        {/* Badge Sincronario */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 text-amber-950 border border-amber-400/80 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Frecuencia 13:20 • Sincronía Cotidiana</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-loma-green tracking-tight leading-tight filter drop-shadow-2xs">
          La Energía del Día
        </h1>

        <p className="font-serif italic text-lg sm:text-2xl text-loma-wood font-extrabold">
          {energia.fechaTexto}
        </p>

        <p className="text-stone-700 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
          El cosmos y la tierra laten en sincronía. Conectamos con el tránsito del <strong className="text-stone-950">Sol</strong>, la emoción de la <strong className="text-stone-950">Luna</strong> y el oráculo del <strong className="text-stone-950">Sincronario Maya Tzolkin</strong> para habitar Loma Verde en armonía comunitaria.
        </p>

        {/* Botones rápidos de interacción */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            onClick={handleWhatsAppDirecto}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            title="Enviar la energía del día a tus grupos de WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Compartir en WhatsApp</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-white hover:bg-amber-50 text-loma-green border border-loma-wood/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-loma-accent" />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Link'}</span>
          </button>

          <button
            onClick={() => {
              setMostrarReferencias(true);
              const el = document.getElementById('referencias-fuentes');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300/80 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Conocer las fuentes científicas, astronómicas y mayas de este cálculo"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Fuentes & Referencias</span>
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. RESUMEN SINTÉTICO EN 3 PILARES (SOL • LUNA • KIN MAYA)                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PILAR 1: SOL EN LIBRA */}
        <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 to-white border-2 border-amber-300 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                ☀️ Tránsito Solar
              </span>
              <span className="text-2xl">{energia.sol.simbolo}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-serif text-3xl shadow-inner font-bold flex-shrink-0">
                {energia.sol.simbolo}
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-amber-950 leading-tight tracking-tight">
                  Sol en {energia.sol.signo}
                </h3>
                <span className="text-xs font-bold text-amber-900 block">
                  {energia.sol.elemento}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-normal">
              {energia.sol.descripcion}
            </p>

            <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                Regencia: {energia.sol.regente}
              </span>
              <p className="font-serif italic text-xs text-amber-950 font-medium">
                "{energia.sol.lema}"
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-200/60 mt-4 text-[11px] font-bold text-amber-900 flex items-center justify-between">
            <span>Arquetipo:</span>
            <span className="text-amber-800">{energia.sol.arquetipo}</span>
          </div>
        </div>

        {/* PILAR 2: LUNA EN SAGITARIO */}
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-white border-2 border-blue-300 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                🌙 Clima Emocional
              </span>
              <span className="text-2xl">{energia.luna.simbolo}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-800 text-white flex items-center justify-center font-serif text-3xl shadow-inner font-bold flex-shrink-0">
                {energia.luna.simbolo}
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-blue-950 leading-tight tracking-tight">
                  Luna en {energia.luna.signo}
                </h3>
                <span className="text-xs font-bold text-blue-900 block">
                  {energia.luna.elemento}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-normal">
              {energia.luna.descripcion}
            </p>

            <div className="bg-blue-100/60 p-3 rounded-xl border border-blue-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-0.5">
                Fase Actual: {energia.luna.fase?.emoji} {energia.luna.fase?.name} ({energia.luna.fase?.illumination}%)
              </span>
              <p className="font-serif italic text-xs text-blue-950 font-medium">
                "{energia.luna.lema}"
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200/60 mt-4 text-[11px] font-bold text-blue-900 flex items-center justify-between">
            <span>Arquetipo:</span>
            <span className="text-blue-800">{energia.luna.arquetipo}</span>
          </div>
        </div>

        {/* PILAR 3: KIN MAYA TZOLKIN (KIN 50 PERRO ESPECTRAL) */}
        <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/90 to-white border-2 border-emerald-400 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                🌀 Sincronario Maya 13:20
              </span>
              <span className="text-2xl">{energia.maya.selloIcono}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 via-loma-green to-teal-800 text-amber-300 flex items-center justify-center font-serif text-2xl shadow-inner font-black flex-shrink-0">
                {energia.maya.kinNumero}
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-emerald-950 leading-tight tracking-tight">
                  {energia.maya.kinNombre}
                </h3>
                <span className="text-xs font-bold text-emerald-800 block">
                  {energia.maya.ondaEncantada}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-700">
              <div className="flex items-center justify-between py-1 border-b border-emerald-100">
                <span className="text-stone-500 font-semibold">Sello Solar:</span>
                <span className="font-bold text-emerald-950">{energia.maya.selloNombre}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-emerald-100">
                <span className="text-stone-500 font-semibold">Tono Lunar:</span>
                <span className="font-bold text-emerald-950">{energia.maya.tonoNombre}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-emerald-100">
                <span className="text-stone-500 font-semibold">Poder:</span>
                <span className="font-bold text-emerald-900">{energia.maya.selloPoder}</span>
              </div>
            </div>

            <div className="bg-emerald-100/60 p-3 rounded-xl border border-emerald-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-0.5">
                Acción del Tono:
              </span>
              <p className="text-xs text-emerald-950 font-semibold">
                {energia.maya.tonoAccion}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-200/60 mt-4 text-[11px] font-bold text-emerald-900 flex items-center justify-between">
            <span>Onda #{energia.maya.ondaNumero}:</span>
            <span className="text-emerald-800">{energia.maya.posicionEnOnda}</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. SINCRONARIO MAYA 13:20 • CASTILLO, ONDA ENCANTADA Y QUINTA FUERZA       */}
      {/* ========================================================================= */}
      <section className="space-y-6">

        {/* 3.1 BANNER DEL CASTILLO ACTUAL (52 DÍAS) */}
        {kinActivo?.castillo && (
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-300/80 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏰</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                    Castillo Activo del Sincronario (52 Días)
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {kinActivo.castillo.nombre}
                  </h3>
                </div>
              </div>
              <span className="bg-white/10 text-white border border-white/20 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                {kinActivo.castillo.corte} • {kinActivo.castillo.direccion}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              {kinActivo.castillo.proposito}. Este castillo abarca 4 Ondas Encantadas (52 kines) orientadas a purificar y refinar la energía viva.
            </p>

            {/* Barra de progreso */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                <span>Día {kinActivo.castillo.diaEnCastillo} de 52</span>
                <span>{kinActivo.castillo.progresoPorcentaje}% del Castillo</span>
              </div>
              <div className="w-full h-2.5 bg-stone-700/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-slate-200 to-white rounded-full transition-all duration-500" 
                  style={{ width: `${kinActivo.castillo.progresoPorcentaje || 0}%` }} 
                />
              </div>
            </div>

            {/* 4 Ondas del Castillo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {kinActivo.castillo.ondas?.map((o) => {
                const esActiva = o.numero === kinActivo.ondaNumero;
                return (
                  <div
                    key={o.numero}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      esActiva 
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-sm font-bold ring-2 ring-amber-400/30' 
                        : 'bg-white/5 border-white/10 text-stone-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block font-black">
                      {esActiva ? '⭐ Onda Activa' : `Onda #${o.numero}`}
                    </span>
                    <span className="text-xs font-serif font-bold text-white block mt-0.5">
                      {o.nombre}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                      Kines {o.kinInicio} a {o.kinFin}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3.2 ONDA ENCANTADA ACTUAL (LAYOUT DE 13 TONOS IDÉNTICO A IMAGEN 2) */}
        {kinActivo?.kinesOnda && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs mb-2">
                  <span>🌀 Frecuencia 13:20</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                  {kinActivo.ondaEncantada}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                  Ciclo de 13 días del {kinActivo.castillo?.nombre || 'Castillo'}. Escalones de evolución y sintonía cósmica.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full shadow-2xs">
                  Día {kinActivo.diaDeOnda} de 13 • {kinActivo.tonoPalabraClave}
                </span>
              </div>
            </div>

            {/* Grid interactivo de los 13 pasos de la Onda Encantada */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {kinActivo.kinesOnda?.map((paso) => {
                const esHoy = paso.kinNumero === energia?.maya?.kinNumero;
                const esSeleccionado = paso.kinNumero === kinActivo?.kinNumero;
                return (
                  <button
                    key={paso.kinNumero}
                    onClick={() => setSelectedKinNumero(paso.kinNumero)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col justify-between items-center space-y-2 cursor-pointer relative group ${
                      esSeleccionado
                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/50'
                        : esHoy
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                        : 'bg-stone-50/70 hover:bg-white border-stone-200/80 hover:border-amber-300'
                    }`}
                  >
                    {esHoy && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                        ¡Hoy!
                      </span>
                    )}

                    <div className="space-y-1 w-full">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                        Tono {paso.tonoNumero}
                      </span>
                      <MayaToneGlyph tono={paso.tonoNumero} className="py-1" />
                    </div>

                    <div className="text-2xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                      {paso.sello?.icono || '✨'}
                    </div>

                    <div className="w-full">
                      <span className="font-serif font-black text-xs sm:text-sm text-stone-900 block leading-tight">
                        {paso.palabraClave}
                      </span>
                      <span className="text-[10px] font-bold text-stone-600 block truncate mt-0.5">
                        {paso.sello?.raiz} {paso.sello?.color}
                      </span>
                      <span className="text-[9px] font-mono text-stone-400 block">
                        Kin {paso.kinNumero}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <p className="text-[11px] text-stone-500 text-center font-medium">
              💡 Tocá cualquier escalón de la Onda para ver su Oráculo de la 5ta Fuerza correspondiente.
            </p>
          </div>
        )}

        {/* 3.3 BARRA DE CONTROL Y SELECTOR RÁPIDO DE LA 5TA FUERZA */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-stone-600 tracking-wider">
              Oráculo Activo:
            </span>
            <span className="text-xs font-bold font-serif text-stone-900 bg-amber-100/80 text-amber-950 px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">
              Kin {kinActivo.kinNumero}: {kinActivo.kinNombre}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedKinNumero !== null && (
              <button
                onClick={() => setSelectedKinNumero(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>📅 Volver al Kin de Hoy ({energia.maya.kinNumero})</span>
              </button>
            )}

            <button
              onClick={() => setSelectedKinNumero(176)}
              className={`text-xs font-black px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                kinActivo.kinNumero === 176
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                  : 'bg-stone-50 hover:bg-amber-100/70 text-amber-950 border-amber-300 shadow-2xs'
              }`}
              title="Ver el glifo de Guerrero Resonante (Kin 176) con su 5ta fuerza exactamente como en el gráfico adjunto"
            >
              <span>👑 Ver 5ta Fuerza: Guerrero Resonante (Kin 176)</span>
            </button>
          </div>
        </div>

        {/* 3.4 ORÁCULO DE LA QUINTA FUERZA (LA CRUZ MAYA SAGRADA - FORMATO IMAGEN 1) */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 text-amber-950 border border-amber-400/80 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs">
              <span>Cruz Sagrada 13:20</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              Oráculo de la Quinta Fuerza
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              La matriz sagrada de 5 energías cósmicas: Centro (Destino), Arriba (5ta Fuerza / Guía), Derecha (Análogo), Izquierda (Antípoda) y Abajo (Oculto).
            </p>
          </div>

          {/* Cruz Geométrica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto items-center pt-2">
            
            {/* COLUMNA 1: ANTÍPODA (OESTE / IZQUIERDA) */}
            <div className="space-y-4 order-2 md:order-1">
              <div className={`rounded-3xl p-6 border-2 shadow-sm text-center space-y-3.5 transition-all ${getSelloCardStyle(kinActivo?.oraculo?.antipoda?.sello?.color)}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 bg-purple-100 px-3 py-1 rounded-full border border-purple-300 block w-fit mx-auto shadow-2xs">
                  ⚡ Antípoda • El Desafío
                </span>
                <MayaToneGlyph tono={kinActivo?.oraculo?.antipoda?.tonoNumero || kinActivo?.tonoNumero || 1} />
                <div className="text-4xl filter drop-shadow-xs">{kinActivo?.oraculo?.antipoda?.sello?.icono || '⚡'}</div>
                <div>
                  <h4 className="font-serif font-black text-base text-stone-950">
                    {kinActivo?.oraculo?.antipoda?.nombre || 'Antípoda'}
                  </h4>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    Kin {kinActivo?.oraculo?.antipoda?.kinNumero || ''}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {kinActivo?.oraculo?.antipoda?.descripcion || ''}
                </p>
              </div>
            </div>

            {/* COLUMNA 2: GUÍA (ARRIBA) + DESTINO (CENTRO) + OCULTO (ABAJO) */}
            <div className="space-y-5 order-1 md:order-2">
              
              {/* 1. GUÍA • 5TA FUERZA (ARRIBA - ESTILO IDÉNTICO A IMAGEN 1) */}
              <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-white rounded-3xl p-6 border-3 border-amber-400 shadow-md text-center space-y-3 relative overflow-hidden ring-2 ring-amber-300/50">
                <div className="absolute top-2.5 right-2.5 text-[10px] font-mono font-black bg-amber-400/30 text-amber-950 px-2.5 py-0.5 rounded-full">
                  Norte
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-200/90 px-3.5 py-1 rounded-full border border-amber-400 block w-fit mx-auto shadow-2xs">
                  👑 5ta fuerza • Poder Guía
                </span>
                <MayaToneGlyph tono={kinActivo?.oraculo?.guia?.tonoNumero || kinActivo?.tonoNumero || 1} className="py-1" />
                <div className="text-5xl filter drop-shadow-xs">{kinActivo?.oraculo?.guia?.sello?.icono || '👑'}</div>
                <div>
                  <h4 className="font-serif font-black text-lg sm:text-xl text-amber-950">
                    {kinActivo?.oraculo?.guia?.nombre || 'Poder Guía'}
                  </h4>
                  <span className="text-xs font-mono font-black text-amber-900 block mt-0.5">
                    Kin {kinActivo?.oraculo?.guia?.kinNumero || ''} • {kinActivo?.oraculo?.guia?.sello?.maya || kinActivo?.oraculo?.guia?.nombre || ''}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {kinActivo?.oraculo?.guia?.descripcion || ''}
                </p>
              </div>

              {/* 2. KIN DESTINO (CENTRO) */}
              <div className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-7 border-3 border-amber-400 shadow-2xl text-center space-y-3.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3.5 py-1 rounded-full border border-amber-400/40 block w-fit mx-auto">
                  🌀 Frecuencia Central • Kin Destino
                </span>
                <MayaToneGlyph tono={kinActivo?.tonoNumero || 1} dark={true} className="py-1" />
                <div className="text-6xl filter drop-shadow-md">{kinActivo?.selloIcono || '🌀'}</div>
                <div>
                  <h4 className="font-serif font-black text-2xl text-amber-200 tracking-tight">
                    {kinActivo?.kinNombre}
                  </h4>
                  <span className="text-xs font-mono text-amber-300/80 block mt-0.5">
                    Kin {kinActivo?.kinNumero} • {kinActivo?.ondaEncantada}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-800 text-xs text-stone-300 italic font-serif">
                  "{kinActivo?.afirmacion ? kinActivo.afirmacion.split('\n')[0] : ''}"
                </div>
              </div>

              {/* 3. OCULTO (ABAJO / SUR) */}
              <div className={`rounded-3xl p-6 border-2 shadow-sm text-center space-y-3.5 transition-all ${getSelloCardStyle(kinActivo?.oraculo?.oculto?.sello?.color)}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-950 bg-teal-100 px-3 py-1 rounded-full border border-teal-300 block w-fit mx-auto shadow-2xs">
                  ✨ Poder Oculto • Tesoro Subconsciente
                </span>
                <MayaToneGlyph tono={kinActivo?.oraculo?.oculto?.tonoNumero || kinActivo?.tonoNumero || 1} />
                <div className="text-4xl filter drop-shadow-xs">{kinActivo?.oraculo?.oculto?.sello?.icono || '✨'}</div>
                <div>
                  <h4 className="font-serif font-black text-base text-stone-950">
                    {kinActivo?.oraculo?.oculto?.nombre || 'Poder Oculto'}
                  </h4>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    Kin {kinActivo?.oraculo?.oculto?.kinNumero || ''}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {kinActivo?.oraculo?.oculto?.descripcion || ''}
                </p>
              </div>

            </div>

            {/* COLUMNA 3: ANÁLOGO (ESTE / DERECHA) */}
            <div className="space-y-4 order-3">
              <div className={`rounded-3xl p-6 border-2 shadow-sm text-center space-y-3.5 transition-all ${getSelloCardStyle(kinActivo?.oraculo?.analogo?.sello?.color)}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-950 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 block w-fit mx-auto shadow-2xs">
                  🤝 Sostén Análogo • Fuerza Gemela
                </span>
                <MayaToneGlyph tono={kinActivo?.oraculo?.analogo?.tonoNumero || kinActivo?.tonoNumero || 1} />
                <div className="text-4xl filter drop-shadow-xs">{kinActivo?.oraculo?.analogo?.sello?.icono || '🤝'}</div>
                <div>
                  <h4 className="font-serif font-black text-base text-stone-950">
                    {kinActivo?.oraculo?.analogo?.nombre || 'Sostén Análogo'}
                  </h4>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    Kin {kinActivo?.oraculo?.analogo?.kinNumero || ''}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {kinActivo?.oraculo?.analogo?.descripcion || ''}
                </p>
              </div>
            </div>

          </div>

          {/* 3.5 PERGAMINO CON LA AFIRMACIÓN DEL KIN */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-400/50 text-center space-y-4 mt-6">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              <Feather className="w-3.5 h-3.5" />
              <span>Afirmación Sagrada • Kin {kinActivo?.kinNumero}</span>
            </div>

            <div className="font-serif italic text-lg sm:text-2xl text-amber-100 leading-relaxed whitespace-pre-line tracking-wide drop-shadow-sm max-w-2xl mx-auto">
              "{kinActivo?.afirmacion}"
            </div>

            <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
              El tono <strong>{kinActivo?.tonoNombre}</strong> nos pregunta: <em>"{kinActivo?.tonoPregunta}"</em>. 
              El sello <strong>{kinActivo?.selloNombre}</strong> nos recuerda que su poder sagrado es <strong>{kinActivo?.selloPoder?.toLowerCase()}</strong>.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. CLIMA CÓSMICO & TRÁNSITOS MAYORES: PLUTÓN DIRECTO EN ACUARIO ♒        */}
      {/* ========================================================================= */}
      {energia.transitosPlanetarios && (
        <section className="space-y-6">
          
          {/* Card del Hito Estelar: Plutón Directo en Acuario */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-purple-400/70">
            <div className="absolute -right-8 -bottom-8 opacity-15 text-9xl select-none pointer-events-none font-serif">
              ♒
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 bg-purple-500/30 text-purple-200 border border-purple-400/40 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                  Hito Cósmico del Día • Estación Directa
                </span>
                <span className="text-xs font-mono font-bold bg-white/10 text-purple-200 px-3 py-1 rounded-full border border-white/10">
                  {energia.transitosPlanetarios.eventoEstelar.posicion}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-purple-100 leading-tight">
                  {energia.transitosPlanetarios.eventoEstelar.titulo}
                </h3>
                <p className="text-purple-300 text-xs sm:text-sm mt-1 font-medium">
                  {energia.transitosPlanetarios.eventoEstelar.estado}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                {energia.transitosPlanetarios.eventoEstelar.resumen}
              </p>

              <div className="bg-purple-900/50 border border-purple-400/30 p-3.5 rounded-2xl flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🌿</span>
                <p className="text-xs text-purple-100 leading-relaxed">
                  <strong className="text-purple-200">Sintonía con Loma Verde:</strong> {energia.transitosPlanetarios.eventoEstelar.impacto}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Otros Tránsitos Planetarios Activos dentro de Card Contenedora de Alto Contraste */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-stone-900 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs mb-2">
                  <span>🌌 Bóveda Celeste</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                  Aspectos Planetarios del Día
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                  Tránsitos y ángulos armónicos activos que modulan el clima colectivo
                </p>
              </div>
              <span className="text-xs font-black text-stone-800 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-2xs">
                {energia.transitosPlanetarios.aspectos?.length || 6} tránsitos activos hoy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energia.transitosPlanetarios.aspectos?.map((aspecto) => (
                <div
                  key={aspecto.id}
                  className="bg-stone-50/80 hover:bg-white rounded-2xl p-5 border-2 border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl filter drop-shadow-xs">{aspecto.icono}</span>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${getAspectoBadgeClass(aspecto.aspecto)}`}>
                        {aspecto.aspecto}
                      </span>
                    </div>

                    <h4 className="font-serif font-black text-base sm:text-lg text-stone-950 leading-snug tracking-tight">
                      {aspecto.titulo}
                    </h4>

                    <span className="inline-block text-xs font-bold text-amber-950 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-300/60">
                      {aspecto.categoria}
                    </span>

                    <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-normal">
                      {aspecto.descripcion}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/70 bg-white/70 p-2.5 rounded-xl border border-stone-200/60 text-xs font-mono flex items-center justify-between">
                    <span className="font-bold text-stone-500">Tránsito:</span>
                    <span className="font-black text-stone-900">{aspecto.planetas}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. SINTONÍA Y CONSEJOS COTIDIANOS PARA LOMA VERDE                         */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-loma-green font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-loma-accent" />
              <span>Enraizamiento Comunitario</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {energia.sintoniaLomaVerde.titulo}
            </h2>
          </div>
          <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {energia.sintoniaLomaVerde.bajada}
          </span>
        </div>

        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light">
          {energia.sintoniaLomaVerde.reflexion}
        </p>

        {/* Lista de 4 Claves Prácticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {energia.sintoniaLomaVerde.claves.map((clave, idx) => (
            <div key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed hover:border-loma-green/50 transition-colors">
              {clave}
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. BASES METODOLÓGICAS, FUENTES Y REFERENCIAS OFICIALES                  */}
      {/* ========================================================================= */}
      <section id="referencias-fuentes" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Transparencia y Fundamentos</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              ¿De dónde surge la información de la Energía del Día?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Nuestro sistema integra algoritmos astronómicos de alta precisión, la cosmología sagrada del Sincronario Maya 13:20 y la psicología arquetípica para ofrecer una brújula diaria transparente y verificable.
            </p>
          </div>

          <button
            onClick={() => setMostrarReferencias(!mostrarReferencias)}
            className="inline-flex items-center gap-2 bg-stone-50 hover:bg-amber-50 text-stone-800 font-bold px-4 py-2.5 rounded-xl border border-stone-300 shadow-2xs text-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{mostrarReferencias ? 'Contraer Bibliografía' : 'Explorar Bibliografía y Fuentes'}</span>
            {mostrarReferencias ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
        </div>

        {/* Grid de 4 Pilares de Fuentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* 1. Sincronario Maya 13:20 */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl p-5 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🌀 Sincronario Maya 13:20
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold">Tzolkin 260 Kines</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-emerald-950">
                Fundación para la Ley del Tiempo & El Encanto del Sueño
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Basado en la investigación del <strong>Dr. José Argüelles (Valum Votan)</strong> y <strong>Lloydine Argüelles (Bolon Ik)</strong>. Utiliza la matriz armónica ininterrumpida de 260 kines (13 tonos galácticos de creación × 20 sellos solares), con cálculo del Kin diario, la Onda Encantada y el Oráculo de la Quinta Fuerza alineado al huso horario de Buenos Aires.
              </p>
              {mostrarReferencias && (
                <div className="pt-2 border-t border-emerald-100 text-[11px] text-stone-600 space-y-1.5 font-light">
                  <p><strong>• Obras canónicas:</strong> <em>El Factor Maya: Un camino más allá de la tecnología</em> (1987); <em>The Dreamspell / El Encanto del Sueño</em> (1991); <em>El Tiempo y la Tecnosfera</em> (2002).</p>
                  <p><strong>• Custodia:</strong> Foundation for the Law of Time (Ashland, Oregon, EE.UU.).</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-emerald-200/60 flex flex-wrap items-center gap-2">
              <a
                href="https://lawoftime.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-300 transition-colors"
              >
                <span>lawoftime.org</span>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </a>
              <a
                href="https://www.13lunas.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-300 transition-colors"
              >
                <span>13lunas.net (Sincronario)</span>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </a>
            </div>
          </div>

          {/* 2. Mecánica Celeste y Efemérides */}
          <div className="bg-gradient-to-br from-blue-50/60 to-white rounded-2xl p-5 border border-blue-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200">
                  🔭 Mecánica Celeste & Astrometría
                </span>
                <span className="text-xs font-mono text-blue-700 font-semibold">Jean Meeus / NASA</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-blue-950">
                Algoritmos Astronómicos y Fórmulas de Jean Meeus
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                El sistema calcula la posición solar y lunar en tiempo real convirtiendo la fecha a <strong>Día Juliano (Julian Date)</strong> referenciado a la época estándar <strong>J2000.0</strong>. Aplica ecuaciones de perturbación lunar (anomalía, elongación y latitud) y el ciclo sinódico de 29.53 días para obtener grado zodiacal exacto e iluminación de fase.
              </p>
              {mostrarReferencias && (
                <div className="pt-2 border-t border-blue-100 text-[11px] text-stone-600 space-y-1.5 font-light">
                  <p><strong>• Referencia matemática:</strong> Jean Meeus, <em>Astronomical Algorithms</em>, 2da edición (Willmann-Bell, Inc., Richmond, Virginia).</p>
                  <p><strong>• Verificación:</strong> Efemérides estándar del U.S. Naval Observatory (USNO) y el sistema NASA JPL Horizons.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-blue-200/60 flex flex-wrap items-center gap-2">
              <a
                href="https://ssd.jpl.nasa.gov/horizons/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 hover:text-blue-950 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-300 transition-colors"
              >
                <span>NASA JPL Horizons</span>
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
              <a
                href="https://aa.usno.navy.mil/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 hover:text-blue-950 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-300 transition-colors"
              >
                <span>US Naval Observatory</span>
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
            </div>
          </div>

          {/* 3. Astrología Humanística & Psicología Arquetípica */}
          <div className="bg-gradient-to-br from-amber-50/60 to-white rounded-2xl p-5 border border-amber-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                  🔮 Astrología Humanística & Arquetipos
                </span>
                <span className="text-xs font-mono text-amber-800 font-semibold">C.G. Jung / D. Rudhyar</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-950">
                Psicología Arquetípica y Sincronicidad
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Los tránsitos del Sol, la Luna y los planetas no se interpretan como determinismo predictivo o fatalista, sino como <strong>sincronicidad</strong> y arquetipos del inconsciente colectivo según <strong>Carl Gustav Jung</strong> y la astrología humanística y transpersonal formulada por <strong>Dane Rudhyar</strong>.
              </p>
              {mostrarReferencias && (
                <div className="pt-2 border-t border-amber-100 text-[11px] text-stone-600 space-y-1.5 font-light">
                  <p><strong>• C. G. Jung:</strong> <em>Sincronicidad como principio de conexiones acausales</em> (1952) y teoría de los arquetipos psicológicos.</p>
                  <p><strong>• Dane Rudhyar:</strong> <em>The Lunation Cycle: A Key to the Understanding of Personality</em> (1967) y <em>The Astrology of Personality</em> (1936).</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
              <a
                href="https://www.rudhyar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-white hover:bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-300 transition-colors"
              >
                <span>Archivos Dane Rudhyar</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
              <span className="text-[11px] text-stone-500 font-medium px-2">
                Enfoque evolutivo y no determinista
              </span>
            </div>
          </div>

          {/* 4. Filosofía Comunitaria y Biodinámica Loma Verde */}
          <div className="bg-gradient-to-br from-stone-50 to-white rounded-2xl p-5 border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-stone-800 bg-stone-200/80 px-2.5 py-0.5 rounded-full border border-stone-300">
                  🌿 Sintonía Comunitaria & Biodinámica
                </span>
                <span className="text-xs font-mono text-stone-600 font-semibold">Loma Verde / Steiner</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                Biodinámica, Carta de la Tierra y Soberanía Barrial
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Integra los principios de agricultura biodinámica de <strong>Rudolf Steiner</strong> (ritmos de siembra y labores según los ciclos celestes) y la <strong>Carta de la Tierra</strong>, orientando la energía cósmica hacia consejos prácticos de huerta, compostaje, arte comunitario y economía fraterna para el pueblo de Loma Verde.
              </p>
              {mostrarReferencias && (
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600 space-y-1.5 font-light">
                  <p><strong>• Rudolf Steiner:</strong> <em>Curso sobre agricultura biológico-dinámica</em> (Koberwitz, 1924).</p>
                  <p><strong>• Valores locales:</strong> Soberanía alimentaria, cooperación comunitaria, reciprocidad sin lucro abusivo y cuidado del arbolado de Loma Verde.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200/60 flex flex-wrap items-center gap-2">
              <a
                href="https://earthcharter.org/lea-la-carta-de-la-tierra/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-300 transition-colors"
              >
                <span>Carta de la Tierra</span>
                <ExternalLink className="w-3 h-3 text-stone-600" />
              </a>
              <span className="text-[11px] text-emerald-800 font-semibold px-2">
                🌱 Comunidad Loma Verde
              </span>
            </div>
          </div>

        </div>

        {/* Nota de pie sobre rigor e independencia */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-600 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-900">Transparencia y Verificabilidad:</strong> Los cálculos de posición planetaria y del Sincronario Maya se ejecutan localmente en tu navegador sin intermediarios opacos, utilizando fórmulas matemáticas estandarizadas internacionalmente. Cada día a las 00:00 hs el motor actualiza la bóveda celeste y el Kin correspondiente de forma automática y precisa.
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. NAVEGACIÓN Y ENLACE AL RESTO DE LA EXPERIENCIA LUNAR                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-loma-bg via-amber-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-loma-wood/30 text-center space-y-4">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-loma-green">
          ¿Querés sumarte al próximo Encuentro Lunar?
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto">
          En cada plenilunio nos reunimos en la plaza para celebrar la abundancia, la música, los talleres y el mercado de virtudes bajo la frecuencia natural 13:20.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoToInscripcion}
            className="bg-loma-green hover:bg-loma-wood text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            Sumate como Feriante o Artista 🌿
          </button>

          <button
            onClick={onGoToLunas}
            className="bg-white hover:bg-amber-50 text-loma-green border border-loma-green font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-2xs transition-all"
          >
            Ver Calendario de Plenilunios 🌕
          </button>

          <button
            onClick={onBackToHome}
            className="text-stone-500 hover:text-stone-800 font-semibold px-3 py-2 text-xs transition-colors"
          >
            Volver a la Portada
          </button>
        </div>
      </div>

    </div>
  );
}
