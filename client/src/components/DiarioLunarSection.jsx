import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  Search,
  Calendar,
  Clock,
  Share2,
  ChevronRight,
  ArrowRight,
  Eye,
  Flame,
  MessageCircle,
  Check,
  Copy,
  Filter,
  Sparkles,
  Moon,
  Sun,
  Tag,
  X,
  ExternalLink,
  User,
  TrendingUp,
  AlertCircle,
  Compass,
  ArrowUpRight,
  BookOpen,
  Send,
  Heart
} from 'lucide-react';
import { getEnergiaDelDia } from '../utils/energiaCalc';

export default function DiarioLunarSection({ config, onBackToHome, onGoToInscripcion, onGoToAntena, onGoToMuro, onGoToLunas, initialNotaId = null }) {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLunaId, setSelectedLunaId] = useState('todas');
  const [selectedSeccion, setSelectedSeccion] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [notaActiva, setNotaActiva] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentDate] = useState(() => new Date());

  // Energía cósmica para el barómetro superior del diario
  const energiaHoy = useMemo(() => getEnergiaDelDia(config, currentDate), [config, currentDate]);

  // Cargar noticias desde el backend
  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/noticias');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNoticias(data);
        // Si hay una nota especificada en la URL, abrirla
        if (initialNotaId) {
          const match = data.find(n => n.id === initialNotaId);
          if (match) setNotaActiva(match);
        }
      }
    } catch (err) {
      console.error('Error cargando noticias del diario:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  // Incrementar vistas al abrir una nota
  const handleOpenNota = async (nota) => {
    setNotaActiva(nota);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      fetch(`/api/noticias/${nota.id}/vista`, { method: 'POST' });
    } catch {
      // Ignorar errores menores de métricas
    }
  };

  // Compartir nota en WhatsApp
  const handleShareWhatsApp = (nota) => {
    const url = `${window.location.origin}/diario?nota=${nota.id}`;
    const texto = `📰 *EL DIARIO LUNAR DE LOMA VERDE*\n\n*${nota.titulo}*\n_${nota.volanta || nota.lunaNombre}_\n\n${nota.copete || nota.bajada || ''}\n\n👉 Leé la nota completa acá:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  // Copiar link de la nota
  const handleCopyLink = async (nota) => {
    const url = `${window.location.origin}/diario?nota=${nota.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback
    }
  };

  // Lista única de Lunas presentes en las noticias para el selector de ediciones
  const lunasDisponibles = useMemo(() => {
    const map = new Map();
    // Añadir lunas predeterminadas del calendario
    map.set('luna-tauro-2026', { id: 'luna-tauro-2026', nombre: 'Luna en Tauro ♉', emoji: '♉', activa: true, lema: 'Tierra fértil, oficios vivos y abundancia comunitaria' });
    map.set('luna-aries-2026', { id: 'luna-aries-2026', nombre: 'Luna en Aries ♈', emoji: '♈', activa: false, lema: 'Fuego pionero, primavera y nuevos comienzos' });
    map.set('luna-piscis-2026', { id: 'luna-piscis-2026', nombre: 'Luna en Piscis ♓', emoji: '♓', activa: false, lema: 'Sensibilidad profunda, medicina natural y poesía' });
    map.set('luna-acuario-2026', { id: 'luna-acuario-2026', nombre: 'Luna en Acuario ♒', emoji: '♒', activa: false, lema: 'Redes libres, soberanía 13:20 y vanguardia' });

    noticias.forEach(n => {
      if (n.lunaId && !map.has(n.lunaId)) {
        map.set(n.lunaId, {
          id: n.lunaId,
          nombre: n.lunaNombre || n.lunaId,
          emoji: '🌕',
          activa: false,
          lema: 'Crónicas y memorias comunitarias'
        });
      }
    });
    return Array.from(map.values());
  }, [noticias]);

  // Secciones temáticas del diario
  const secciones = [
    { id: 'todas', label: 'Portada' },
    { id: 'comunidad', label: 'Comunidad & Vecinal' },
    { id: 'tierra', label: 'Soberanía & Tierra' },
    { id: 'cultura', label: 'Cultura & Música' },
    { id: 'economia', label: 'Economía Fraterna' },
    { id: 'astrologia', label: 'Astros & Cosmos' },
    { id: 'opinion', label: 'Opinión & Crónica' },
  ];

  // Filtrado de noticias
  const filteredNoticias = useMemo(() => {
    return noticias.filter(n => {
      // Filtro por Luna
      if (selectedLunaId !== 'todas' && n.lunaId !== selectedLunaId) {
        return false;
      }
      // Filtro por Sección
      if (selectedSeccion !== 'todas' && (n.seccion || '').toLowerCase() !== selectedSeccion.toLowerCase()) {
        return false;
      }
      // Filtro por Búsqueda
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitulo = (n.titulo || '').toLowerCase().includes(q);
        const matchCopete = (n.copete || n.bajada || '').toLowerCase().includes(q);
        const matchTexto = (n.texto || n.contenido || '').toLowerCase().includes(q);
        const matchAutor = (n.autor || '').toLowerCase().includes(q);
        const matchTags = Array.isArray(n.etiquetas) && n.etiquetas.some(t => t.toLowerCase().includes(q));
        if (!matchTitulo && !matchCopete && !matchTexto && !matchAutor && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [noticias, selectedLunaId, selectedSeccion, searchTerm]);

  // Nota de tapa destacada (la primera destacada o la primera de la lista filtrada)
  const notaPrincipal = useMemo(() => {
    if (filteredNoticias.length === 0) return null;
    const dest = filteredNoticias.find(n => n.destacada);
    return dest || filteredNoticias[0];
  }, [filteredNoticias]);

  // Notas secundarias (excluyendo la principal de tapa)
  const notasSecundarias = useMemo(() => {
    if (!notaPrincipal) return [];
    return filteredNoticias.filter(n => n.id !== notaPrincipal.id);
  }, [filteredNoticias, notaPrincipal]);

  // Ranking de lo más leído
  const loMasLeido = useMemo(() => {
    return [...noticias]
      .sort((a, b) => (b.vistas || 0) - (a.vistas || 0))
      .slice(0, 5);
  }, [noticias]);

  // Notas de Opinión destacadas
  const notasOpinion = useMemo(() => {
    return noticias.filter(n => (n.seccion || '').toLowerCase() === 'opinion').slice(0, 3);
  }, [noticias]);

  // Formato de fecha en español tipo periódico
  const fechaHoyTexto = useMemo(() => {
    try {
      const f = new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(currentDate);
      return f.charAt(0).toUpperCase() + f.slice(1);
    } catch {
      return 'Lunes 19 de Octubre de 2026';
    }
  }, [currentDate]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. BARÓMETRO SUPERIOR & METADATOS DEL DÍA (ESTILO DIARIO NACIONAL)        */}
      {/* ========================================================================= */}
      <div className="bg-stone-900 text-stone-200 border-b border-stone-800 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-300 font-serif flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {fechaHoyTexto}
            </span>
            <span className="text-stone-500 hidden md:inline">•</span>
            <span className="text-stone-300 hidden md:inline">
              Loma Verde, Buenos Aires: <strong className="text-white">22°C</strong> • Brisa Pampeana
            </span>
            <span className="text-stone-500 hidden lg:inline">•</span>
            <span className="text-stone-300 hidden lg:inline">
              Troquel Comunitario: <strong className="text-amber-300">1 TL = 1 Hora de Saber</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-amber-200/90 font-mono text-[10px] sm:text-xs bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
              Sincronario: {energiaHoy.maya.kinNombre}
            </span>
            <button
              onClick={onBackToHome}
              className="text-stone-400 hover:text-white transition-colors text-[11px] underline underline-offset-2 flex items-center gap-1"
            >
              <span>Inicio del Sistema</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CABEZAL EMBLEMÁTICO (MASTHEAD) "EL DIARIO LUNAR"                       */}
      {/* ========================================================================= */}
      <header className="border-b-4 border-double border-stone-900 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          
          <div className="text-center space-y-2 relative">
            
            {/* Lema y Edición */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[10px] sm:text-xs uppercase tracking-widest text-stone-500 font-serif">
              <span className="hidden sm:inline">Fundado en el Tiempo Natural 13:20</span>
              <span className="font-bold text-stone-900 bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                🌕 Edición Activa: {config.lunaActiva || 'Luna Tauro ♉'}
              </span>
              <span className="hidden sm:inline">Voz Vecinal • Agroecología • Cultura Libre</span>
            </div>

            {/* Gran Cabezal Tipográfico */}
            <h1 
              onClick={() => { setSelectedLunaId('todas'); setSelectedSeccion('todas'); setSearchTerm(''); setNotaActiva(null); }}
              className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-stone-950 hover:text-amber-900 transition-colors cursor-pointer select-none py-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              EL DIARIO LUNAR
            </h1>

            {/* Bajada del Periódico */}
            <p className="font-serif italic text-xs sm:text-sm text-stone-700 max-w-2xl mx-auto">
              El periódico comunitario, agroecológico y soberano de Loma Verde • Crónicas, asambleas y memorias de cada Luna Llena.
            </p>

          </div>

          {/* CINTA DE ÚLTIMO MOMENTO / ALERTA COMUNITARIA (ESTILO CLARÍN/INFOBAE) */}
          <div className="mt-4 bg-red-700 text-white rounded-xl px-3 py-2 flex items-center gap-2 sm:gap-3 text-xs shadow-xs overflow-hidden">
            <span className="bg-white text-red-700 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 flex-shrink-0 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              ÚLTIMO MOMENTO
            </span>
            <div className="truncate flex-1 font-medium text-stone-100">
              <span className="cursor-pointer hover:underline" onClick={() => onGoToAntena && onGoToAntena()}>
                🚨 <strong>Asamblea de Los Aromos:</strong> Vecinos ratifican la vigilia pacífica y el rechazo a la antena 5G ilegal en Loma Verde.
              </span>
            </div>
            <button 
              onClick={() => onGoToAntena && onGoToAntena()}
              className="hidden md:inline-flex items-center gap-1 font-bold text-[11px] underline hover:text-amber-200 flex-shrink-0"
            >
              <span>Ver Causa</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* BARRA DE NAVEGACIÓN DE SECCIONES & BUSCADOR */}
          <div className="mt-4 pt-3 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Secciones */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {secciones.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => { setSelectedSeccion(sec.id); setNotaActiva(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedSeccion === sec.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Buscador de Noticias */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <input
                type="text"
                placeholder="Buscar en el diario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-100 border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:bg-white focus:border-stone-500 transition-all font-medium"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. SELECTOR DE EDICIONES POR LUNA ("LAS NOTAS DE CADA LUNA")              */}
      {/* ========================================================================= */}
      <section className="bg-amber-50/70 border-b border-amber-200/80 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          
          <div className="flex items-center justify-between text-xs font-bold text-amber-950 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-amber-800" />
              <span>Edición por Ciclo Lunar:</span>
            </span>
            {selectedLunaId !== 'todas' && (
              <button
                onClick={() => setSelectedLunaId('todas')}
                className="text-amber-800 hover:text-amber-950 underline lowercase font-semibold text-[11px]"
              >
                (ver todas las lunas)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            
            <button
              onClick={() => setSelectedLunaId('todas')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedLunaId === 'todas'
                  ? 'bg-amber-900 text-amber-50 border-amber-950 shadow-xs ring-2 ring-amber-400/50'
                  : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/60'
              }`}
            >
              🌕 Todas las Ediciones ({noticias.length})
            </button>

            {lunasDisponibles.map(luna => {
              const count = noticias.filter(n => n.lunaId === luna.id).length;
              const esSeleccionada = selectedLunaId === luna.id;
              return (
                <button
                  key={luna.id}
                  onClick={() => setSelectedLunaId(luna.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    esSeleccionada
                      ? 'bg-amber-900 text-amber-50 border-amber-950 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-white text-stone-800 border-amber-200 hover:bg-amber-100/80'
                  }`}
                >
                  <span>{luna.emoji}</span>
                  <span>{luna.nombre}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    esSeleccionada ? 'bg-amber-800 text-amber-200' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

          </div>

          {/* Banner contextual de la Luna seleccionada */}
          {selectedLunaId !== 'todas' && (
            <div className="mt-2 bg-white/90 border border-amber-300/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {lunasDisponibles.find(l => l.id === selectedLunaId)?.emoji || '🌙'}
                </span>
                <div>
                  <strong>Estás leyendo la Edición de {lunasDisponibles.find(l => l.id === selectedLunaId)?.nombre}:</strong>{' '}
                  <span className="text-stone-700 font-serif italic">
                    {lunasDisponibles.find(l => l.id === selectedLunaId)?.lema || ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLunaId('todas')}
                className="text-stone-500 hover:text-stone-900 p-1"
                title="Quitar filtro de luna"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CONTENIDO PRINCIPAL: PORTADA PERIODÍSTICA ESTILO INFOBAE / CLARÍN      */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <Newspaper className="w-10 h-10 text-stone-400 animate-pulse mx-auto" />
            <p className="font-serif italic text-stone-600">Imprimiendo la edición del día...</p>
          </div>
        ) : filteredNoticias.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif font-black text-xl text-stone-900">
              No se encontraron notas en esta sección
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No hay notas publicadas para los filtros seleccionados o el término de búsqueda <em className="font-bold">"{searchTerm}"</em>.
            </p>
            <button
              onClick={() => { setSelectedLunaId('todas'); setSelectedSeccion('todas'); setSearchTerm(''); }}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              Ver todas las notas del diario
            </button>
          </div>
        ) : (
          <>
            {/* 4.1 GRAN TAPA PRINCIPAL (LEAD STORY) + COLUMNA LATERAL (LO MÁS LEÍDO) */}
            {notaPrincipal && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b-2 border-stone-200 pb-10">
                
                {/* NOTICIA DE PORTADA (COLUMNA IZQUIERDA 8/12) */}
                <article 
                  className="lg:col-span-8 space-y-4 cursor-pointer group"
                  onClick={() => handleOpenNota(notaPrincipal)}
                >
                  
                  {/* Volanta */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                      {notaPrincipal.volanta || notaPrincipal.seccionEtiqueta || 'NOTICIA DE TAPA'}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500">
                      • {notaPrincipal.lunaNombre}
                    </span>
                  </div>

                  {/* Gran Titular */}
                  <h2 
                    className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-stone-950 leading-[1.12] tracking-tight group-hover:text-amber-900 transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {notaPrincipal.titulo}
                  </h2>

                  {/* Copete / Bajada */}
                  <p className="font-serif text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                    {notaPrincipal.copete || notaPrincipal.bajada}
                  </p>

                  {/* Imagen de Gran Impacto */}
                  {notaPrincipal.img && (
                    <div className="relative overflow-hidden rounded-2xl border border-stone-200 shadow-md aspect-video sm:aspect-16/9 bg-stone-100">
                      <img
                        src={notaPrincipal.img}
                        alt={notaPrincipal.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      {notaPrincipal.epigrafe && (
                        <div className="absolute bottom-0 inset-x-0 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 italic font-serif">
                          📷 {notaPrincipal.epigrafe}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadatos y Acciones */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        {notaPrincipal.autor}
                      </span>
                      <span>•</span>
                      <span>{notaPrincipal.fechaTexto || notaPrincipal.fecha}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {notaPrincipal.tiempoLectura}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShareWhatsApp(notaPrincipal); }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs"
                        title="Compartir en WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Compartir</span>
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyLink(notaPrincipal); }}
                        className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold px-2.5 py-1.5 rounded-lg text-xs"
                        title="Copiar enlace"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-amber-900 font-bold font-serif flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Leer completa</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </article>

                {/* COLUMNA LATERAL (4/12): LO MÁS LEÍDO DE LA EDICIÓN & FOTONOTICIA */}
                <aside className="lg:col-span-4 space-y-6">
                  
                  {/* Ranking Lo Más Leído */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2">
                      <h3 className="font-serif font-black text-lg text-stone-950 flex items-center gap-2 uppercase tracking-tight">
                        <TrendingUp className="w-4 h-4 text-red-700" />
                        <span>Lo Más Leído</span>
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-stone-500">Ranking Lunar</span>
                    </div>

                    <div className="divide-y divide-stone-100 space-y-3">
                      {loMasLeido.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenNota(item)}
                          className="pt-3 first:pt-0 flex items-start gap-3 cursor-pointer group"
                        >
                          <span className="font-serif font-black text-3xl sm:text-4xl text-amber-400 group-hover:text-red-700 transition-colors leading-none flex-shrink-0 w-8">
                            0{idx + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                              {item.lunaNombre}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-stone-950 leading-snug group-hover:text-amber-900 transition-colors">
                              {item.titulo}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-stone-400">
                              <span>{item.autor}</span>
                              <span>•</span>
                              <span>{item.tiempoLectura}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fotonoticia del Barrio */}
                  <div className="bg-stone-900 text-white rounded-3xl overflow-hidden shadow-md border border-stone-800 space-y-3 p-5">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                      <span>📸 En Foco • Loma Verde</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>

                    <div className="rounded-2xl overflow-hidden aspect-video border border-stone-700">
                      <img
                        src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
                        alt="En foco Loma Verde"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-serif font-bold text-base text-amber-100">
                      La luz de la tarde filtrándose en el monte nativo
                    </h4>
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      Loma Verde conserva más de 40 especies de árboles nativos y exóticos que nutren a las abejas de los productores locales. El patrimonio verde que la comunidad defiende día a día.
                    </p>
                  </div>

                </aside>

              </div>
            )}

            {/* 4.2 MOSAICO DE NOTICIAS SECUNDARIAS (GRILLA EDITORIAL CLARÍN/INFOBAE) */}
            {notasSecundarias.length > 0 && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2">
                  <h3 className="font-serif font-black text-2xl text-stone-950 tracking-tight uppercase flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-amber-800" />
                    <span>Otras Crónicas de la Edición</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-stone-500">
                    {notasSecundarias.length} notas disponibles
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notasSecundarias.map(nota => (
                    <article
                      key={nota.id}
                      onClick={() => handleOpenNota(nota)}
                      className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                    >
                      <div>
                        {/* Imagen con badge */}
                        {nota.img && (
                          <div className="relative overflow-hidden aspect-video bg-stone-100">
                            <img
                              src={nota.img}
                              alt={nota.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs">
                              {nota.seccionEtiqueta || 'Actualidad'}
                            </span>
                          </div>
                        )}

                        <div className="p-5 space-y-2.5">
                          
                          {/* Volanta y Luna */}
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                            <span className="uppercase tracking-wider">{nota.volanta || nota.seccionEtiqueta}</span>
                            <span className="text-stone-500 font-mono text-[10px]">{nota.lunaNombre}</span>
                          </div>

                          {/* Titular */}
                          <h4 className="font-serif font-black text-lg text-stone-950 leading-snug group-hover:text-amber-900 transition-colors">
                            {nota.titulo}
                          </h4>

                          {/* Copete corto */}
                          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-normal">
                            {nota.copete || nota.bajada || nota.texto}
                          </p>

                        </div>
                      </div>

                      {/* Footer de la tarjeta */}
                      <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-bold text-stone-800">{nota.autor}</span>
                        <span className="text-amber-800 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Leer</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                    </article>
                  ))}
                </div>

              </div>
            )}

            {/* 4.3 SECCIÓN DE OPINIÓN & VOCES DEL BARRIO (ESTILO COLUMNISTAS CLARÍN) */}
            {notasOpinion.length > 0 && (
              <section className="bg-gradient-to-r from-amber-50 via-stone-50 to-yellow-50 rounded-3xl p-6 sm:p-10 border-2 border-amber-300/80 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300/60 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full">
                      Tribuna Libre
                    </span>
                    <h3 className="font-serif font-black text-2xl sm:text-3xl text-stone-950 mt-1">
                      Voces & Columnistas de Loma Verde
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 max-w-sm">
                    Espacio de reflexión, ensayos y cartas de vecinos, artesanos y huerteros locales.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {notasOpinion.map(op => (
                    <div
                      key={op.id}
                      onClick={() => handleOpenNota(op)}
                      className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-amber-900 font-serif font-bold text-lg flex-shrink-0">
                            {op.autor?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-stone-900 leading-tight">
                              {op.autor}
                            </h5>
                            <span className="text-[10px] text-stone-500 block">
                              Vecino / Columnista
                            </span>
                          </div>
                        </div>

                        <h4 className="font-serif font-black text-base text-stone-950 leading-snug group-hover:text-amber-900 transition-colors">
                          "{op.titulo}"
                        </h4>

                        <p className="text-xs text-stone-600 italic line-clamp-3 font-serif">
                          "{op.copete || op.bajada}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                        <span>{op.fechaTexto}</span>
                        <span className="text-amber-800 font-bold group-hover:underline">Leer columna →</span>
                      </div>
                    </div>
                  ))}
                </div>

              </section>
            )}

            {/* 4.4 ACCESO A OTRAS SECCIONES COMUNITARIAS */}
            <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                  🌱 Participación Abierta
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-100">
                  ¿Tenés una noticia, crónica o comunicado para el barrio?
                </h3>
                <p className="text-xs text-stone-400 max-w-xl font-light">
                  El Diario Lunar es una plataforma abierta y horizontal. Podés enviar tu propuesta, poema o noticia de la huerta para ser publicada en la próxima edición.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <button
                  onClick={onGoToInscripcion}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-xs transition-colors"
                >
                  Sumate al Encuentro
                </button>
                <button
                  onClick={onGoToMuro}
                  className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider border border-stone-700 transition-colors"
                >
                  Ver Muro Cósmico 🎨
                </button>
              </div>
            </section>
          </>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 5. MODAL DE LECTURA DE NOTA COMPLETA (READER VIEW EDITORIAL)              */}
      {/* ========================================================================= */}
      {notaActiva && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border-2 border-stone-200 flex flex-col max-h-[92vh]">
            
            {/* Barra superior de control */}
            <div className="p-4 sm:px-6 bg-stone-100 border-b border-stone-200 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                onClick={() => setNotaActiva(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-200/80 px-3 py-1.5 rounded-xl border border-stone-300 transition-colors"
              >
                <span>← Volver al Diario</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWhatsApp(notaActiva)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleCopyLink(notaActiva)}
                  className="bg-white hover:bg-stone-200 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Link'}</span>
                </button>

                <button
                  onClick={() => setNotaActiva(null)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido Editorial Completo (Scrollable) */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
              
              {/* Volanta & Luna */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded">
                  {notaActiva.volanta || notaActiva.seccionEtiqueta || 'NOTICIA'}
                </span>
                <span className="text-xs font-bold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                  🌕 {notaActiva.lunaNombre}
                </span>
              </div>

              {/* Gran Titular */}
              <h1 
                className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-stone-950 leading-tight tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {notaActiva.titulo}
              </h1>

              {/* Copete / Bajada en negrita serif */}
              <p className="font-serif italic text-base sm:text-xl text-stone-800 leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
                {notaActiva.copete || notaActiva.bajada}
              </p>

              {/* Metadatos Periodísticos */}
              <div className="py-3 border-y border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">{notaActiva.autor}</span>
                    <span className="text-[10px] text-stone-500">Corresponsalía Comunitaria</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
                  <span>{notaActiva.fechaTexto || notaActiva.fecha}</span>
                  <span>•</span>
                  <span>{notaActiva.tiempoLectura} de lectura</span>
                  <span>•</span>
                  <span>{notaActiva.vistas || 1} lecturas</span>
                </div>
              </div>

              {/* Imagen Principal */}
              {notaActiva.img && (
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm aspect-video bg-stone-100">
                    <img
                      src={notaActiva.img}
                      alt={notaActiva.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {notaActiva.epigrafe && (
                    <p className="text-xs text-stone-500 italic font-serif">
                      📷 {notaActiva.epigrafe}
                    </p>
                  )}
                </div>
              )}

              {/* Cuerpo del Artículo (Con interlineado y tipografía de lectura clara) */}
              <div className="font-serif text-stone-900 text-base sm:text-lg leading-relaxed space-y-4 pt-2">
                {(notaActiva.texto || notaActiva.contenido || '').split('\n\n').map((parrafo, i) => (
                  <p key={i} className="leading-relaxed">
                    {parrafo}
                  </p>
                ))}
              </div>

              {/* Cita destacada (Pull-Quote) */}
              <div className="my-6 bg-amber-50/80 p-5 rounded-2xl border-l-4 border-amber-600 text-stone-900 font-serif italic text-base sm:text-lg">
                «En Loma Verde la red viva es la humana. Ningún algoritmo reemplaza la calidez de mirarnos a los ojos y construir juntos.»
              </div>

              {/* Etiquetas / Tags */}
              {Array.isArray(notaActiva.etiquetas) && notaActiva.etiquetas.length > 0 && (
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Etiquetas de la Nota:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {notaActiva.etiquetas.map(tag => (
                      <span
                        key={tag}
                        onClick={() => { setSearchTerm(tag.replace('#', '')); setNotaActiva(null); }}
                        className="bg-stone-100 hover:bg-amber-100 text-stone-800 text-xs px-3 py-1 rounded-full border border-stone-300 cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para compartir al final de la nota */}
              <div className="bg-stone-100 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-stone-800">
                  ¿Te gustó esta crónica? Compartila con tus vecinos:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareWhatsApp(notaActiva)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(notaActiva)}
                    className="bg-white hover:bg-stone-200 text-stone-800 font-bold px-3 py-1.5 rounded-lg border border-stone-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado' : 'Copiar Link'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
