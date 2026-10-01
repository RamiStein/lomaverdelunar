import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  FileText, 
  Sparkles, 
  Share2, 
  Check, 
  Copy, 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  Layers, 
  Award, 
  Zap, 
  CheckCircle2, 
  Play, 
  Palette, 
  Instagram, 
  ExternalLink, 
  Clock, 
  Star, 
  Users, 
  PhoneCall,
  HelpCircle,
  Wrench,
  Store,
  Compass
} from 'lucide-react';

export default function MediaKitLandingView({ config, onBackToHome, onGoToInscripcion }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPack, setSelectedPack] = useState('pack-360');
  
  // Estado para el cotizador / simulador directo a WhatsApp
  const [bookingForm, setBookingForm] = useState({
    nombre: '',
    proyecto: '',
    rubro: 'Oficio / Servicio',
    pack: 'Relato Lunar 360°',
    extras: {
      taller: false,
      reelsExtra: false,
      catalogoFotos: false
    },
    mensaje: ''
  });

  const whatsappNumber = config?.whatsappCoordinacion || '5493484503056';

  const handleShare = async () => {
    const shareUrl = 'https://lomaverdelunar.online/mediakit';
    const shareData = {
      title: 'Media Kit 360° • Loma Verde Lunar Studios',
      text: 'Productora digital de contenido artístico: Fotografía, Video y Guion Creativo para feriantes, proyectos y oficios de Loma Verde.',
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      alert(`Enlace: ${shareUrl}`);
    }
  };

  const generateWhatsAppUrl = () => {
    const p = bookingForm.proyecto || 'Mi Proyecto';
    const n = bookingForm.nombre || 'Emprendedor/a';
    const extrasList = [];
    if (bookingForm.extras.taller) extrasList.push('Cobertura especial en taller');
    if (bookingForm.extras.reelsExtra) extrasList.push('Reels adicionales');
    if (bookingForm.extras.catalogoFotos) extrasList.push('Catálogo completo de fotos');

    let msg = `¡Hola Loma Verde Lunar Studios! 🎬🌙\n`;
    msg += `Mi nombre es *${n}* y mi proyecto/oficio es *${p}* (${bookingForm.rubro}).\n\n`;
    msg += `Me interesa contratar el servicio de la Productora 360:\n`;
    msg += `📦 *Pack seleccionado:* ${bookingForm.pack}\n`;
    if (extrasList.length > 0) {
      msg += `✨ *Adicionales:* ${extrasList.join(', ')}\n`;
    }
    if (bookingForm.mensaje) {
      msg += `💬 *Consulta:* ${bookingForm.mensaje}\n`;
    }
    msg += `\n¿Podrían pasarme disponibilidad para la próxima fecha del Encuentro Lunar? ¡Muchas gracias!`;

    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#0d140e] text-stone-100 relative selection:bg-amber-400 selection:text-stone-900 pb-20">
      
      {/* Fondo estético con sutil textura cósmica y radial verde bosque + oro */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(234, 179, 8, 0.18) 0%, rgba(43, 83, 41, 0.25) 40%, transparent 75%)'
        }}
      />

      {/* Sutil cuadrícula cinematográfica de fondo */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* 1. Barra de Navegación Superior */}
      <header className="sticky top-0 z-30 bg-[#0d140e]/90 backdrop-blur-md border-b border-emerald-900/60 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-300 text-xs sm:text-sm font-bold tracking-wide transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Loma Verde Lunar</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" /> Productora 360°
            </span>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir Media Kit'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section Cinematográfico */}
      <section className="relative z-10 pt-12 pb-16 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-amber-300 mb-6 shadow-sm">
          <span>🎬</span>
          <span>Loma Verde Lunar Studios • Media Kit Oficial</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-50 tracking-tight leading-[1.15] mb-6">
          Agencia Digital 360° & Productora de <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
            Contenido Artístico para Feriantes y Oficios
          </span>
        </h1>

        <p className="text-stone-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-light mb-8">
          Elevamos la identidad visual y la voz de tu emprendimiento u oficio vecinal. Combinamos <strong>fotografía de autor con luz natural</strong>, <strong>reels cinematográficos verticales</strong> y <strong>guiones de storytelling auténtico</strong> para que tu propuesta brille en redes y multiplique sus ventas.
        </p>

        {/* Botones de Acción Primaria */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <a
            href="#packs"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-7 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Ver Packs y Servicios</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-600/50 font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

        {/* Pilares Clave en Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl backdrop-blur-xs">
            <Camera className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="font-bold text-xs sm:text-sm text-stone-200">Fotografía de Autor</h4>
            <p className="text-[11px] text-stone-400 mt-1">Luz natural, encuadres rústicos y planos macro de producto.</p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl backdrop-blur-xs">
            <Video className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-xs sm:text-sm text-stone-200">Reels Cinematográficos</h4>
            <p className="text-[11px] text-stone-400 mt-1">Formato 9:16 en alta tasa de cuadros, edición dinámica y música 432Hz.</p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl backdrop-blur-xs">
            <FileText className="w-5 h-5 text-amber-300 mb-2" />
            <h4 className="font-bold text-xs sm:text-sm text-stone-200">Guion Creativo</h4>
            <p className="text-[11px] text-stone-400 mt-1">Storytelling genuino, estructura gancho-solución y copys listos.</p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-rose-300 mb-2" />
            <h4 className="font-bold text-xs sm:text-sm text-stone-200">Identidad 13:20</h4>
            <p className="text-[11px] text-stone-400 mt-1">Contenido que respeta la mística comunitaria y el espíritu verde.</p>
          </div>
        </div>
      </section>

      {/* 3. Sección Detallada de los 3 Servicios Esenciales */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 text-xs font-black uppercase tracking-widest block mb-2">
            Nuestros Pilares de Creación
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-50">
            ¿Qué incluye la Producción Artística 360°?
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Cada servicio está diseñado específicamente para artesanos, oficios vecinales, productores de alimentos y terapeutas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tarjeta 1: Fotografía */}
          <div className="bg-stone-900/70 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block mb-1">
                Servicio Audiovisual I
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-100 mb-3">
                Fotografía Profesional & Retrato de Oficio
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                Capturamos la verdad de tu trabajo: el grano de la madera, la textura de la cerámica, el vapor de la cocina o las herramientas en el banco del taller. No usamos fotos de banco genéricas: retratamos tus creaciones vivas.
              </p>

              <div className="space-y-2.5 border-t border-stone-800 pt-5 text-xs text-stone-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Fotos de Producto:</strong> Planos cerrados, iluminación natural y fondo armónico.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Retrato Editorial:</strong> Tu mirada y tus manos creando en la feria o tu taller.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Curaduría de Color:</strong> Revelado profesional en alta definición para feed y web.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <span>Entrega digital en Google Drive</span>
              <span className="font-bold text-amber-400">Formato 4:5 y 9:16</span>
            </div>
          </div>

          {/* Tarjeta 2: Video & Reels */}
          <div className="bg-stone-900/70 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-700 text-stone-950 font-black text-[9px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              Más Solicitado
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase block mb-1">
                Servicio Audiovisual II
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-100 mb-3">
                Reels Cinematográficos para Redes
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                El video vertical es el formato con mayor alcance orgánico en Instagram y TikTok. Grabamos con lentes cinematográficos, estabilizador y planos en movimiento para atrapar la mirada en los primeros tres segundos.
              </p>

              <div className="space-y-2.5 border-t border-stone-800 pt-5 text-xs text-stone-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Planos Proceso / ASMR:</strong> El sonido y la belleza hipnótica del proceso manual.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Micro-Docu (30-60s):</strong> La historia de tu emprendimiento contada con emoción.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Subtítulos Animados:</strong> Lectura fluida sin sonido + música de frecuencia armónica.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <span>Resolución 4K Ultra HD</span>
              <span className="font-bold text-emerald-400">Optimizado para Reels</span>
            </div>
          </div>

          {/* Tarjeta 3: Guion & Storytelling */}
          <div className="bg-stone-900/70 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase block mb-1">
                Servicio Creativo III
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-100 mb-3">
                Guion Creativo & Storytelling de Marca
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                Una imagen bella necesita una historia que conmueva. Diseñamos la narrativa que explica por qué tu trabajo tiene valor real: desde cómo elegís las materias primas hasta el impacto positivo en el barrio.
              </p>

              <div className="space-y-2.5 border-t border-stone-800 pt-5 text-xs text-stone-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Guion Estructurado:</strong> Gancho inicial, nudo artesanal y llamado a la acción.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Voz en Off o Diálogo:</strong> Adaptado a si querés hablar a cámara o preferís voz narrada.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Copywriting para Redes:</strong> Textos listos para postear con hashtags estratégicos.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <span>Guía lista para copiar y pegar</span>
              <span className="font-bold text-rose-400">Formato Notion / PDF</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Módulo Especial para Feriantes y Servicios de Oficios */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-950/60 via-stone-900/90 to-stone-950/90 border-2 border-emerald-700/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 font-black text-[10px] uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
              <Wrench className="w-3.5 h-3.5" />
              <span>Dedicado a Feriantes, Productores y Oficios Barriales</span>
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-50 mb-4">
              ¿Tenés un oficio como bicicletería, tapicería, carpintería o cocina artesanal?
            </h2>

            <p className="text-stone-300 text-xs sm:text-base leading-relaxed mb-6 font-light">
              Muchas veces los mejores oficios y creadores no tienen tiempo para sacar fotos o editar reels mientras trabajan con sus herramientas. En Loma Verde Lunar Studios <strong>nos acercamos a tu puesto en la plaza o a tu taller local</strong>, registramos tu técnica milimétrica y te entregamos el material listo para publicar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
                <span className="text-amber-400 font-bold text-xs block mb-1">🚲 Para Oficios y Reparadores</span>
                <p className="text-[11px] text-stone-400">Mostrá cómo reparás una rueda, restaurás un mueble o calibrás una máquina con planos detalle.</p>
              </div>

              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
                <span className="text-emerald-400 font-bold text-xs block mb-1">🍯 Para Gastronomía y Viveros</span>
                <p className="text-[11px] text-stone-400">Tomas suculentas de los platos, fermentos, plantines y la frescura de los ingredientes agroecológicos.</p>
              </div>

              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
                <span className="text-rose-400 font-bold text-xs block mb-1">🎨 Para Artesanías y Arte</span>
                <p className="text-[11px] text-stone-400">El alma del tallado, la costura, la arcilla y la magia de lo hecho a mano con dedicación.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Packs de Producción & Tarifas Transparentes */}
      <section id="packs" className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 text-xs font-black uppercase tracking-widest block mb-2">
            Propuestas Claras & Economía Fraterna
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-50">
            Elegí el Pack de Difusión para tu Proyecto
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Tarifas pensadas para la economía independiente. Posibilidad de canje parcial en Virtudes / Troqueles de Loma Verde.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* PACK 1: SEMILLA */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-stone-700 transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-black text-stone-400 uppercase tracking-wider block">Pack Básico</span>
                  <h3 className="font-serif text-2xl font-bold text-stone-100">Semilla & Presencia</h3>
                </div>
                <span className="text-2xl">🌱</span>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed mb-6">
                Ideal para quienes se suman por primera vez o quieren renovar su foto de perfil y publicar un reel de impacto.
              </p>

              <div className="space-y-3 text-xs text-stone-300 border-t border-stone-800 pt-5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>5 Fotos Profesionales</strong> (Producto + Retrato)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>1 Reel Cinematográfico</strong> (15 a 30s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>1 Guion / Copy Estratégico</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mención en historias oficiales @lomaverdelunar</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-stone-800">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('¡Hola! Me interesa consultar por el Pack Semilla & Presencia para mi emprendimiento en Loma Verde Lunar.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Consultar Pack Semilla</span>
              </a>
            </div>
          </div>

          {/* PACK 2: RELATO LUNAR 360° (DESTACADO) */}
          <div className="bg-gradient-to-b from-[#142318] via-stone-900 to-[#121c15] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative scale-102 lg:scale-105">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 font-black text-[10px] uppercase px-4 py-1 rounded-full tracking-widest shadow-md">
              ⭐ El más Elegido
            </div>

            <div>
              <div className="flex justify-between items-start mb-4 mt-1">
                <div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">Producción Completa</span>
                  <h3 className="font-serif text-2xl font-bold text-stone-100">Relato Lunar 360°</h3>
                </div>
                <span className="text-2xl">🌕</span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                El paquete integral para feriantes que quieren contar su historia con profundidad, ganar autoridad y vender más.
              </p>

              <div className="space-y-3 text-xs text-stone-200 border-t border-amber-500/20 pt-5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>12 Fotos Editoriales</strong> (Producto, proceso y stand)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>2 Reels Cinematográficos</strong> (Micro-docu + Producto estrella)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Guion de Storytelling Completo</strong> + 2 copys listos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Destacado especial en el Directorio Vecinal oficial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Publicación colaborativa en Instagram oficial</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-amber-500/20">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('¡Hola! Me gustaría reservar el Pack Relato Lunar 360° para mi proyecto en Loma Verde Lunar.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Reservar Pack 360°</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* PACK 3: PRODUCTORA FULL & OFICIOS */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-stone-700 transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Transformación Total</span>
                  <h3 className="font-serif text-2xl font-bold text-stone-100">Productora Full</h3>
                </div>
                <span className="text-2xl">⚡</span>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed mb-6">
                Para marcas consolidadas, gastronómicos y talleres de oficio que buscan material para todo un mes de contenido.
              </p>

              <div className="space-y-3 text-xs text-stone-300 border-t border-stone-800 pt-5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>25+ Fotos de Alta Gama</strong> (Catálogo y web completo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>4 Reels / Videos Cinematográficos</strong> (Contenido mensual)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Cobertura en Plaza + Sesión en tu taller local</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Flyer de autor personalizado en Flyer Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Publicación fijada y difusión continua</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-stone-800">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('¡Hola! Me interesa solicitar una propuesta personalizada del Pack Productora Full para mi proyecto en Loma Verde Lunar.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Solicitar Propuesta Full</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Cotizador & Simulador Interactivo a WhatsApp */}
      <section className="relative z-10 py-12 px-4 max-w-3xl mx-auto">
        <div className="bg-stone-900/90 border border-stone-700 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg">
              ✍️
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                Simulador de Reserva Inmediata
              </h3>
              <p className="text-xs text-stone-400">
                Completá los datos de tu proyecto y abrí el chat directo de WhatsApp con tu solicitud armada.
              </p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); window.open(generateWhatsAppUrl(), '_blank'); }} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Tu Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo"
                  value={bookingForm.nombre}
                  onChange={(e) => setBookingForm({ ...bookingForm, nombre: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nombre de tu Proyecto / Oficio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taller de Bicis / LM Deco"
                  value={bookingForm.proyecto}
                  onChange={(e) => setBookingForm({ ...bookingForm, proyecto: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Rubro Principal</label>
                <select
                  value={bookingForm.rubro}
                  onChange={(e) => setBookingForm({ ...bookingForm, rubro: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Oficio / Servicio">Oficio / Servicio (Bicicletería, arreglos, etc.)</option>
                  <option value="Artesanías">Artesanías & Creación Manual</option>
                  <option value="Gastronomía">Gastronomía & Cocina Consciente</option>
                  <option value="Huerta / Vivero">Huerta, Plantas & Vivero</option>
                  <option value="Terapias Holísticas">Terapias Holísticas & Bienestar</option>
                  <option value="Feria Americana">Feria Americana & Moda Circular</option>
                  <option value="Productos Naturales">Productos Naturales & Cosmética</option>
                  <option value="Música / Arte">Música & Arte en Vivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Pack de Producción</label>
                <select
                  value={bookingForm.pack}
                  onChange={(e) => setBookingForm({ ...bookingForm, pack: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Pack Semilla & Presencia">Pack Semilla & Presencia (5 fotos + 1 Reel)</option>
                  <option value="Relato Lunar 360°">Relato Lunar 360° (12 fotos + 2 Reels + Guion)</option>
                  <option value="Productora Full 360°">Productora Full 360° (25 fotos + 4 Reels + Taller)</option>
                  <option value="A Medida / Consulta Personalizada">A Medida / Consulta Personalizada</option>
                </select>
              </div>
            </div>

            {/* Checkboxes de extras */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block uppercase">Adicionales Opcionales:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingForm.extras.taller}
                    onChange={(e) => setBookingForm({
                      ...bookingForm,
                      extras: { ...bookingForm.extras, taller: e.target.checked }
                    })}
                    className="accent-amber-400"
                  />
                  <span>Sesión en mi taller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingForm.extras.reelsExtra}
                    onChange={(e) => setBookingForm({
                      ...bookingForm,
                      extras: { ...bookingForm.extras, reelsExtra: e.target.checked }
                    })}
                    className="accent-amber-400"
                  />
                  <span>Reel adicional</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingForm.extras.catalogoFotos}
                    onChange={(e) => setBookingForm({
                      ...bookingForm,
                      extras: { ...bookingForm.extras, catalogoFotos: e.target.checked }
                    })}
                    className="accent-amber-400"
                  />
                  <span>Catálogo de fotos extra</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Notas o Consulta Especial</label>
              <textarea
                rows={2}
                placeholder="Contanos brevemente qué te gustaría destacar de tu producto..."
                value={bookingForm.mensaje}
                onChange={(e) => setBookingForm({ ...bookingForm, mensaje: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-700 bg-stone-950 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar Consulta Armada a WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* 7. Preguntas Frecuentes (FAQ) */}
      <section className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-amber-400 text-xs font-black uppercase tracking-widest block mb-1">
            Respuestas Claras
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-50">
            Preguntas Frecuentes de Feriantes
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>¿Qué pasa si me da timidez o no me gusta hablar a cámara?</span>
            </h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              No hay problema en absoluto. Diseñamos guiones basados en planos de manos trabajando, texturas, herramientas y detalles visuales con música relajante o voz en off narrada por nuestro equipo. Tu comodidad es lo primero.
            </p>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>¿Cuándo y dónde se realiza la grabación y las fotos?</span>
            </h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              La cobertura principal se realiza durante el <strong>Encuentro Lunar</strong> en la Plaza La Misión (Loma Verde), aprovechando la luz natural y el flujo de vecinos. También podemos coordinar previamente una visita a tu taller o espacio productivo local si contratás el pack correspondiente.
            </p>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>¿En cuánto tiempo recibo el material terminado?</span>
            </h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              Entre 48 y 96 horas posteriores a la feria, recibirás un enlace privado de Google Drive con todas las fotos editadas en alta resolución y los videos exportados en formato vertical listos para publicar sin perder calidad.
            </p>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>¿Se puede pagar con Troqueles / Virtudes de Loma Verde?</span>
            </h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              ¡Sí! En Loma Verde Lunar creemos en la economía circular y fraterna. Aceptamos una parte del valor en canje por tus productos, servicios o troqueles comunitarios, apoyando a que todos los proyectos puedan acceder a contenido de primer nivel.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Footer Exclusivo de la Productora */}
      <footer className="relative z-10 border-t border-emerald-900/60 pt-10 text-center text-xs text-stone-400 space-y-3 px-4">
        <div className="w-10 h-10 rounded-full bg-stone-900 border border-amber-400/50 flex items-center justify-center text-lg mx-auto">
          🎬
        </div>
        <h4 className="font-serif text-lg font-bold text-stone-200">
          Loma Verde Lunar Studios • Agencia & Productora 360°
        </h4>
        <p className="text-[11px] text-stone-500 max-w-md mx-auto">
          Creando puentes entre la producción artesanal, el arte y la comunicación digital en el partido de Escobar.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <button onClick={onBackToHome} className="text-amber-400 hover:underline">
            Ir a la Portada
          </button>
          <span>•</span>
          <button onClick={onGoToInscripcion} className="text-emerald-400 hover:underline">
            Inscripción a la Feria
          </button>
          <span>•</span>
          <a href="https://lomaverdelunar.online/mapalomaverdelunar" className="text-stone-300 hover:underline">
            Mapa Vecinal
          </a>
        </div>
      </footer>

    </div>
  );
}
