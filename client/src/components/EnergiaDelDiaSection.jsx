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
import { getEnergiaDelDia, generarMensajeWhatsAppEnergia } from '../utils/energiaCalc';

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

  const handleWhatsAppDirecto = () => {
    const textoWa = generarMensajeWhatsAppEnergia(energia);
    window.open(`https://wa.me/?text=${textoWa}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. CABECERA MÍSTICA VINTAGE LOMA VERDE                                    */}
      {/* ========================================================================= */}
      <header className="relative text-center max-w-3xl mx-auto space-y-4 pt-4">
        
        {/* Badge Sincronario */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 text-amber-900 border border-amber-400/60 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Frecuencia 13:20 • Sincronía Cotidiana</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-loma-green tracking-tight leading-tight">
          La Energía del Día
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-loma-wood">
          {energia.fechaTexto}
        </p>

        <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          El cosmos y la tierra laten en sincronía. Conectamos con el tránsito del <strong>Sol</strong>, la emoción de la <strong>Luna</strong> y el oráculo del <strong>Sincronario Maya Tzolkin</strong> para habitar Loma Verde en armonía comunitaria.
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
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-950 leading-tight">
                  Sol en {energia.sol.signo}
                </h3>
                <span className="text-xs font-semibold text-amber-800 block">
                  {energia.sol.elemento}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
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
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-blue-950 leading-tight">
                  Luna en {energia.luna.signo}
                </h3>
                <span className="text-xs font-semibold text-blue-800 block">
                  {energia.luna.elemento}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
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
                <h3 className="font-serif text-lg sm:text-xl font-bold text-emerald-950 leading-tight">
                  {energia.maya.kinNombre}
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 block">
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
      {/* 3. PERGAMINO ORACULAR DEL KIN (POEMA Y AFIRMACIÓN)                       */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-400/80">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl select-none pointer-events-none font-serif">
          {energia.maya.selloIcono || '✨'}
        </div>

        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Feather className="w-3.5 h-3.5" />
            <span>Afirmación Sagrada del Kin {energia.maya.kinNumero}</span>
          </div>

          <div className="font-serif italic text-lg sm:text-2xl text-amber-100 leading-relaxed whitespace-pre-line tracking-wide drop-shadow-sm">
            "{energia.maya.afirmacion}"
          </div>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            El tono <strong>{energia.maya.tonoNombre}</strong> nos pregunta: <em>"{energia.maya.tonoPregunta}"</em>. 
            El sello <strong>{energia.maya.selloNombre}</strong> nos recuerda que su poder sagrado es <strong>{energia.maya.selloPoder.toLowerCase()}</strong>.
          </p>

          <button
            onClick={() => setMostrarOraculoDetalle(!mostrarOraculoDetalle)}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-400/40 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>{mostrarOraculoDetalle ? 'Ocultar Oráculo de la Quinta Fuerza' : 'Ver Oráculo de la Quinta Fuerza (4 Puntos)'}</span>
            {mostrarOraculoDetalle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* ORÁCULO DE LA QUINTA FUERZA DESPLEGABLE */}
        {mostrarOraculoDetalle && (
          <div className="mt-8 pt-6 border-t border-stone-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left animate-in slide-in-from-top-3">
            
            {/* GUÍA */}
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-400/30 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                👑 PODER GUÍA
              </span>
              <h4 className="font-bold text-sm text-white">
                {energia.maya.oraculo.guia.nombre}
              </h4>
              <p className="text-xs text-stone-300 leading-normal">
                {energia.maya.oraculo.guia.descripcion}
              </p>
            </div>

            {/* ANÁLOGO */}
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-red-400/30 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-red-300 tracking-wider block">
                🤝 PODER ANÁLOGO
              </span>
              <h4 className="font-bold text-sm text-white">
                {energia.maya.oraculo.analogo.nombre}
              </h4>
              <p className="text-xs text-stone-300 leading-normal">
                {energia.maya.oraculo.analogo.descripcion}
              </p>
            </div>

            {/* ANTÍPODA */}
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-blue-400/30 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider block">
                ⚡ PODER ANTÍPODA
              </span>
              <h4 className="font-bold text-sm text-white">
                {energia.maya.oraculo.antipoda.nombre}
              </h4>
              <p className="text-xs text-stone-300 leading-normal">
                {energia.maya.oraculo.antipoda.descripcion}
              </p>
            </div>

            {/* OCULTO */}
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-yellow-400/30 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider block">
                ✨ PODER OCULTO
              </span>
              <h4 className="font-bold text-sm text-white">
                {energia.maya.oraculo.oculto.nombre}
              </h4>
              <p className="text-xs text-stone-300 leading-normal">
                {energia.maya.oraculo.oculto.descripcion}
              </p>
            </div>

          </div>
        )}
      </div>

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

          {/* Grid de Otros Tránsitos Planetarios Activos */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block">
                  Bóveda Celeste
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Aspectos Planetarios del Día
                </h3>
              </div>
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full self-start sm:self-auto">
                {energia.transitosPlanetarios.aspectos?.length || 6} tránsitos activos hoy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energia.transitosPlanetarios.aspectos?.map((aspecto) => (
                <div
                  key={aspecto.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{aspecto.icono}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200/60">
                        {aspecto.aspecto}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-snug">
                      {aspecto.titulo}
                    </h4>

                    <span className="text-[11px] font-semibold text-amber-800 block">
                      {aspecto.categoria}
                    </span>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {aspecto.descripcion}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                    <span>Tránsito:</span>
                    <span className="font-semibold text-stone-700">{aspecto.planetas}</span>
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
