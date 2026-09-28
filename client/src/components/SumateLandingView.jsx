import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Share2, 
  Check, 
  Copy, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  AlertCircle,
  Wrench,
  Store,
  Compass
} from 'lucide-react';

// Temas y paletas artísticas para los 12 signos zodiacales
const ZODIAC_THEMES = {
  Aries: {
    signo: 'Aries',
    simbolo: '♈',
    elemento: 'Fuego',
    elementoTexto: 'Fuego Cardinal 🔥',
    gradientBg: 'from-[#170503] via-[#2f0c07] to-[#0d0202]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(225, 29, 72, 0.35) 0%, rgba(245, 158, 11, 0.2) 45%, transparent 75%)',
    primaryColor: '#e11d48',
    accentColor: '#f59e0b',
    borderGlow: 'border-red-500/50 shadow-[0_0_60px_rgba(225,29,72,0.25)]',
    cardBorder: 'border-amber-500/40',
    badgeBg: 'bg-red-500/20 text-red-200 border-red-500/40',
    buttonGrad: 'from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 shadow-red-600/30',
    cornerColor: '#f59e0b',
    tagline: 'Chispa creadora, impulso pionero y nuevos comienzos bajo el sol de primavera.',
    ringColor: 'rgba(245, 158, 11, 0.25)',
    symbolColor: 'rgba(239, 68, 68, 0.08)'
  },
  Tauro: {
    signo: 'Tauro',
    simbolo: '♉',
    elemento: 'Tierra',
    elementoTexto: 'Tierra Fija 🌸',
    gradientBg: 'from-[#04140b] via-[#0d2816] to-[#030e07]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(22, 163, 74, 0.35) 0%, rgba(217, 119, 6, 0.2) 45%, transparent 75%)',
    primaryColor: '#16a34a',
    accentColor: '#d97706',
    borderGlow: 'border-emerald-500/50 shadow-[0_0_60px_rgba(22,163,74,0.25)]',
    cardBorder: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    buttonGrad: 'from-emerald-700 via-amber-600 to-emerald-700 hover:from-emerald-600 hover:to-amber-500 shadow-emerald-700/30',
    cornerColor: '#10b981',
    tagline: 'Abundancia fértil, raíces profundas y el valor genuino de las creaciones hechas con amor.',
    ringColor: 'rgba(52, 211, 153, 0.25)',
    symbolColor: 'rgba(34, 197, 94, 0.08)'
  },
  Géminis: {
    signo: 'Géminis',
    simbolo: '♊',
    elemento: 'Aire',
    elementoTexto: 'Aire Mutable 🍃',
    gradientBg: 'from-[#051421] via-[#0a2338] to-[#030c14]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.35) 0%, rgba(245, 158, 11, 0.2) 45%, transparent 75%)',
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
    borderGlow: 'border-sky-500/50 shadow-[0_0_60px_rgba(2,132,199,0.25)]',
    cardBorder: 'border-sky-500/40',
    badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
    buttonGrad: 'from-sky-600 via-teal-600 to-sky-600 hover:from-sky-500 hover:to-teal-500 shadow-sky-600/30',
    cornerColor: '#38bdf8',
    tagline: 'Palabras que unen, curiosidad compartida y puentes fraternos en toda la comunidad.',
    ringColor: 'rgba(56, 189, 248, 0.25)',
    symbolColor: 'rgba(14, 165, 233, 0.08)'
  },
  Cáncer: {
    signo: 'Cáncer',
    simbolo: '♋',
    elemento: 'Agua',
    elementoTexto: 'Agua Cardinal 🌊',
    gradientBg: 'from-[#04101e] via-[#081e35] to-[#020b14]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.35) 0%, rgba(147, 197, 253, 0.2) 45%, transparent 75%)',
    primaryColor: '#0891b2',
    accentColor: '#93c5fd',
    borderGlow: 'border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.25)]',
    cardBorder: 'border-cyan-500/40',
    badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
    buttonGrad: 'from-cyan-700 via-blue-600 to-cyan-700 hover:from-cyan-600 hover:to-blue-500 shadow-cyan-700/30',
    cornerColor: '#67e8f9',
    tagline: 'El calor del hogar barrial, memoria afectiva y cuidado mutuo como una gran familia.',
    ringColor: 'rgba(103, 232, 249, 0.25)',
    symbolColor: 'rgba(6, 182, 212, 0.08)'
  },
  Leo: {
    signo: 'Leo',
    simbolo: '♌',
    elemento: 'Fuego',
    elementoTexto: 'Fuego Fijo ☀️',
    gradientBg: 'from-[#1c0d02] via-[#351803] to-[#120801]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.4) 0%, rgba(234, 88, 12, 0.25) 45%, transparent 75%)',
    primaryColor: '#d97706',
    accentColor: '#fbbf24',
    borderGlow: 'border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.25)]',
    cardBorder: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
    buttonGrad: 'from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30',
    cornerColor: '#fbbf24',
    tagline: 'Brillo radiante, expresión del corazón y celebración artística a cielo abierto.',
    ringColor: 'rgba(251, 191, 36, 0.25)',
    symbolColor: 'rgba(245, 158, 11, 0.08)'
  },
  Virgo: {
    signo: 'Virgo',
    simbolo: '♍',
    elemento: 'Tierra',
    elementoTexto: 'Tierra Mutable 🌾',
    gradientBg: 'from-[#0b1608] via-[#142610] to-[#070e05]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(132, 204, 22, 0.35) 0%, rgba(217, 119, 6, 0.2) 45%, transparent 75%)',
    primaryColor: '#65a30d',
    accentColor: '#eab308',
    borderGlow: 'border-lime-500/50 shadow-[0_0_60px_rgba(101,163,13,0.25)]',
    cardBorder: 'border-lime-500/40',
    badgeBg: 'bg-lime-500/20 text-lime-200 border-lime-500/40',
    buttonGrad: 'from-emerald-700 via-lime-600 to-emerald-700 hover:from-emerald-600 hover:to-lime-500 shadow-emerald-700/30',
    cornerColor: '#a3e635',
    tagline: 'Medicina de la tierra, servicio desinteresado y amor en cada detalle que florece.',
    ringColor: 'rgba(163, 230, 53, 0.25)',
    symbolColor: 'rgba(101, 163, 13, 0.08)'
  },
  Libra: {
    signo: 'Libra',
    simbolo: '♎',
    elemento: 'Aire',
    elementoTexto: 'Aire Cardinal 🕊️',
    gradientBg: 'from-[#17091a] via-[#2c1033] to-[#100612]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(217, 70, 239, 0.35) 0%, rgba(251, 146, 60, 0.2) 45%, transparent 75%)',
    primaryColor: '#c026d3',
    accentColor: '#f472b6',
    borderGlow: 'border-fuchsia-500/50 shadow-[0_0_60px_rgba(192,38,211,0.25)]',
    cardBorder: 'border-fuchsia-500/40',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/40',
    buttonGrad: 'from-fuchsia-700 via-pink-600 to-fuchsia-700 hover:from-fuchsia-600 hover:to-pink-500 shadow-fuchsia-700/30',
    cornerColor: '#f472b6',
    tagline: 'Equilibrio sagrado, belleza compartida, acuerdos justos y reciprocidad comunitaria.',
    ringColor: 'rgba(244, 114, 182, 0.25)',
    symbolColor: 'rgba(192, 38, 211, 0.08)'
  },
  Escorpio: {
    signo: 'Escorpio',
    simbolo: '♏',
    elemento: 'Agua',
    elementoTexto: 'Agua Fija 🌊',
    gradientBg: 'from-[#140217] via-[#27052e] to-[#0d0110]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(147, 51, 234, 0.35) 0%, rgba(225, 29, 72, 0.2) 45%, transparent 75%)',
    primaryColor: '#9333ea',
    accentColor: '#e11d48',
    borderGlow: 'border-purple-500/50 shadow-[0_0_60px_rgba(147,51,234,0.25)]',
    cardBorder: 'border-purple-500/40',
    badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
    buttonGrad: 'from-purple-800 via-pink-700 to-purple-800 hover:from-purple-700 hover:to-pink-600 shadow-purple-800/30',
    cornerColor: '#c084fc',
    tagline: 'Alquimia colectiva, transmutación y regeneración de la fuerza viva del barrio.',
    ringColor: 'rgba(192, 132, 252, 0.25)',
    symbolColor: 'rgba(147, 51, 234, 0.08)'
  },
  Sagitario: {
    signo: 'Sagitario',
    simbolo: '♐',
    elemento: 'Fuego',
    elementoTexto: 'Fuego Mutable 🔥',
    gradientBg: 'from-[#1c0903] via-[#361305] to-[#120602]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(234, 88, 12, 0.4) 0%, rgba(99, 102, 241, 0.2) 45%, transparent 75%)',
    primaryColor: '#ea580c',
    accentColor: '#818cf8',
    borderGlow: 'border-orange-500/50 shadow-[0_0_60px_rgba(234,88,12,0.25)]',
    cardBorder: 'border-orange-500/40',
    badgeBg: 'bg-orange-500/20 text-orange-200 border-orange-500/40',
    buttonGrad: 'from-orange-600 via-amber-600 to-indigo-700 hover:from-orange-500 hover:to-amber-500 shadow-orange-600/30',
    cornerColor: '#fb923c',
    tagline: 'Expansión de horizontes, saberes ancestrales y la flecha del propósito común.',
    ringColor: 'rgba(251, 146, 60, 0.25)',
    symbolColor: 'rgba(234, 88, 12, 0.08)'
  },
  Capricornio: {
    signo: 'Capricornio',
    simbolo: '♑',
    elemento: 'Tierra',
    elementoTexto: 'Tierra Cardinal ⛰️',
    gradientBg: 'from-[#0a1410] via-[#12241d] to-[#060d0a]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(20, 184, 166, 0.35) 0%, rgba(217, 119, 6, 0.2) 45%, transparent 75%)',
    primaryColor: '#0f766e',
    accentColor: '#2dd4bf',
    borderGlow: 'border-teal-500/50 shadow-[0_0_60px_rgba(15,118,110,0.25)]',
    cardBorder: 'border-teal-500/40',
    badgeBg: 'bg-teal-500/20 text-teal-200 border-teal-500/40',
    buttonGrad: 'from-teal-800 via-emerald-700 to-amber-700 hover:from-teal-700 hover:to-emerald-600 shadow-teal-800/30',
    cornerColor: '#2dd4bf',
    tagline: 'Estructuras soberanas, perseverancia y sueños colectivos que se materializan.',
    ringColor: 'rgba(45, 212, 191, 0.25)',
    symbolColor: 'rgba(20, 184, 166, 0.08)'
  },
  Acuario: {
    signo: 'Acuario',
    simbolo: '♒',
    elemento: 'Aire',
    elementoTexto: 'Aire Fijo 🌬️',
    gradientBg: 'from-[#031322] via-[#062440] to-[#020d18]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.35) 0%, rgba(129, 140, 248, 0.2) 45%, transparent 75%)',
    primaryColor: '#0891b2',
    accentColor: '#38bdf8',
    borderGlow: 'border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.25)]',
    cardBorder: 'border-cyan-500/40',
    badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
    buttonGrad: 'from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30',
    cornerColor: '#38bdf8',
    tagline: 'Redes horizontales, frecuencia 13:20, vanguardia comunitaria y economías del bien común.',
    ringColor: 'rgba(56, 189, 248, 0.25)',
    symbolColor: 'rgba(8, 145, 178, 0.08)'
  },
  Piscis: {
    signo: 'Piscis',
    simbolo: '♓',
    elemento: 'Agua',
    elementoTexto: 'Agua Mutable 🌊',
    gradientBg: 'from-[#090b21] via-[#131742] to-[#060716]',
    radialAura: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.2) 45%, transparent 75%)',
    primaryColor: '#4f46e5',
    accentColor: '#a855f7',
    borderGlow: 'border-indigo-500/50 shadow-[0_0_60px_rgba(79,70,229,0.25)]',
    cardBorder: 'border-indigo-500/40',
    badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
    buttonGrad: 'from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30',
    cornerColor: '#a855f7',
    tagline: 'Sensibilidad cósmica, empatía profunda, música del corazón y cuidado mutuo.',
    ringColor: 'rgba(168, 85, 247, 0.25)',
    symbolColor: 'rgba(79, 70, 229, 0.08)'
  }
};

// Resolver de signo a tema
function resolveZodiacTheme(signoOrLuna) {
  const str = String(signoOrLuna || '').toLowerCase();
  if (str.includes('arie')) return ZODIAC_THEMES.Aries;
  if (str.includes('taur')) return ZODIAC_THEMES.Tauro;
  if (str.includes('gémi') || str.includes('gemi')) return ZODIAC_THEMES.Géminis;
  if (str.includes('cánc') || str.includes('canc')) return ZODIAC_THEMES.Cáncer;
  if (str.includes('leo')) return ZODIAC_THEMES.Leo;
  if (str.includes('virg')) return ZODIAC_THEMES.Virgo;
  if (str.includes('libr')) return ZODIAC_THEMES.Libra;
  if (str.includes('escor')) return ZODIAC_THEMES.Escorpio;
  if (str.includes('sagit')) return ZODIAC_THEMES.Sagitario;
  if (str.includes('capri')) return ZODIAC_THEMES.Capricornio;
  if (str.includes('acua')) return ZODIAC_THEMES.Acuario;
  if (str.includes('pisc')) return ZODIAC_THEMES.Piscis;
  return ZODIAC_THEMES.Aries;
}

export default function SumateLandingView({ config, onSuccess, onGoToFlyerStudio, onBackToHome }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    nombrePersonal: '',
    contacto: '',
    tipo: 'Oficio / Servicio',
    descripcion: '',
    instagram: '',
    tienda: '',
    mapa: '',
    imagenBase64: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Signo y tema activo
  const activeSignName = config?.signo || config?.lunaActiva || 'Aries';
  const theme = resolveZodiacTheme(activeSignName);

  // Lista de categorías
  const defaultCategorias = [
    "Oficio / Servicio",
    "Artesanías",
    "Gastronomía",
    "Huerta / Vivero",
    "Música / Arte",
    "Terapias Holísticas",
    "Feria Americana",
    "Productos Naturales"
  ];
  const categorias = Array.isArray(config?.categorias) && config.categorias.includes("Oficio / Servicio")
    ? config.categorias
    : defaultCategorias;

  // Compresor de imagen en el navegador
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          try {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch (e) {
            resolve(readerEvent.target.result);
          }
        };
        img.onerror = () => resolve(readerEvent.target.result);
        img.src = readerEvent.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, imagenBase64: compressedBase64 }));
        setImagePreview(compressedBase64);
      } catch (err) {
        console.error('Error procesando imagen:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        lunaId: config?.lunaActiva || `Luna ${theme.signo}`,
        origen: config?.lunaActiva || `Luna ${theme.signo}`,
        nombre: (formData.nombre || '').trim(),
        nombrePersonal: (formData.nombrePersonal || '').trim(),
        contacto: (formData.contacto || '').trim(),
        tipo: formData.tipo || 'Oficio / Servicio',
        categoria: formData.tipo || 'Oficio / Servicio',
        descripcion: (formData.descripcion || '').trim(),
        instagram: (formData.instagram || '').trim(),
        tienda: (formData.tienda || '').trim(),
        mapa: (formData.mapa || '').trim(),
        imagenBase64: formData.imagenBase64 || ''
      };

      if (!payload.nombre) {
        throw new Error('Por favor ingresa el nombre de tu emprendimiento u oficio.');
      }
      if (!payload.contacto) {
        throw new Error('Por favor ingresa tu WhatsApp o teléfono de contacto.');
      }

      const res = await fetch('/api/feriantes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Respuesta del servidor (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar la inscripción.');
      }

      setSubmitted(true);
      setLastCreated(data.feriante || payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error enviando formulario:', err);
      setError(err.message || 'Ocurrió un error al procesar tu propuesta.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = 'https://lomaverdelunar.online/sumate_al_encuentro';
    const shareData = {
      title: `Sumate al Encuentro de Luna Llena en ${theme.signo} • Loma Verde`,
      text: `¡Inscribite para participar con tu emprendimiento, oficio o propuesta en la feria de Loma Verde! ${shareUrl}`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // Fallback a portapapeles
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      alert(`Enlace para compartir: ${shareUrl}`);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.gradientBg} text-stone-100 relative overflow-hidden py-6 px-4 selection:bg-amber-400 selection:text-stone-900`}>
      
      {/* 1. Fondo Artístico Celestial Integrado (Aura Radial + Glifo de Signo Gigante + Anillos del Astrolabio) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: theme.radialAura }}
      />

      {/* Marca de agua artística del símbolo zodiacal */}
      <div 
        className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none font-serif text-[280px] sm:text-[420px] select-none leading-none z-0 transition-all duration-1000"
        style={{ color: theme.symbolColor, filter: 'blur(1px)' }}
      >
        {theme.simbolo}
      </div>

      {/* SVG Anillos Sagrados y Astrolabio Celestial */}
      <svg 
        className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none w-[680px] h-[680px] sm:w-[920px] sm:h-[920px] z-0 opacity-40 animate-[spin_160s_linear_infinite]"
        viewBox="0 0 800 800"
        fill="none"
      >
        <circle cx="400" cy="400" r="380" stroke={theme.ringColor} strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="400" cy="400" r="340" stroke={theme.ringColor} strokeWidth="1.5" />
        <circle cx="400" cy="400" r="290" stroke={theme.ringColor} strokeWidth="0.8" strokeDasharray="2 8" />
        <circle cx="400" cy="400" r="230" stroke={theme.ringColor} strokeWidth="1" />
        <line x1="400" y1="10" x2="400" y2="790" stroke={theme.ringColor} strokeWidth="0.8" strokeDasharray="6 6" />
        <line x1="10" y1="400" x2="790" y2="400" stroke={theme.ringColor} strokeWidth="0.8" strokeDasharray="6 6" />
        <line x1="130" y1="130" x2="670" y2="670" stroke={theme.ringColor} strokeWidth="0.5" />
        <line x1="130" y1="670" x2="670" y2="130" stroke={theme.ringColor} strokeWidth="0.5" />
      </svg>

      {/* 2. Barra de Navegación Rápida Superior */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 relative z-20">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/70 hover:border-amber-400/50 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Encuentro</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider backdrop-blur-md transition-all active:scale-95"
          title="Compartir link de inscripción"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir'}</span>
        </button>
      </div>

      {/* 3. Cabecera Artística de la Luna Activa */}
      <div className="max-w-3xl mx-auto text-center relative z-10 mb-8">
        {/* Medallón Lunar con Símbolo Astrológico */}
        <div className="inline-flex items-center justify-center relative mb-3 group">
          <div 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center text-4xl sm:text-5xl backdrop-blur-md bg-stone-950/60 shadow-2xl transition-transform group-hover:scale-105"
            style={{ borderColor: theme.accentColor, boxShadow: `0 0 40px ${theme.primaryColor}55` }}
          >
            <span>{theme.simbolo}</span>
          </div>
          <span className="absolute -bottom-2 bg-stone-900 text-amber-300 border border-amber-400/50 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest shadow-md">
            13:20
          </span>
        </div>

        {/* Título y Subtítulo de Luna Activa */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${theme.badgeBg}`}>
              {config?.lunaActiva || `Luna en ${theme.signo}`} • {theme.elementoTexto}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-50 tracking-tight drop-shadow-md">
            Sumate al Encuentro Lunar 🌿
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto italic font-medium">
            "{config?.lema || theme.tagline}"
          </p>
        </div>

        {/* Chips de Fecha, Horario y Lugar */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
          <div className="bg-stone-900/80 border border-stone-700/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-stone-200 backdrop-blur-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{config?.fechaEventoTexto || 'SÁBADO 3 DE OCTUBRE'}</span>
          </div>
          <div className="bg-stone-900/80 border border-stone-700/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-stone-200 backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{config?.horarioTexto || 'DE 13 A 19 HS'}</span>
          </div>
          <div className="bg-stone-900/80 border border-stone-700/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-stone-200 backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Plaza La Misión y Nigromante • Loma Verde</span>
          </div>
        </div>
      </div>

      {/* 4. Tarjeta Altar del Formulario (Artísticamente Enmarcada) */}
      <div className="max-w-2xl mx-auto relative z-10 mb-16">
        
        {/* Decoraciones de Esquinas Sagradas (SVG Flourishes) */}
        <div className="absolute -top-3 -left-3 w-8 h-8 pointer-events-none z-20">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M2 18V2H18" stroke={theme.cornerColor} strokeWidth="3" strokeLinecap="round" />
            <circle cx="2" cy="2" r="2.5" fill={theme.cornerColor} />
          </svg>
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 pointer-events-none z-20">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M30 18V2H14" stroke={theme.cornerColor} strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="2" r="2.5" fill={theme.cornerColor} />
          </svg>
        </div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 pointer-events-none z-20">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M2 14V30H18" stroke={theme.cornerColor} strokeWidth="3" strokeLinecap="round" />
            <circle cx="2" cy="30" r="2.5" fill={theme.cornerColor} />
          </svg>
        </div>
        <div className="absolute -bottom-3 -right-3 w-8 h-8 pointer-events-none z-20">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M30 14V30H14" stroke={theme.cornerColor} strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="30" r="2.5" fill={theme.cornerColor} />
          </svg>
        </div>

        {/* Contenedor Principal Glassmorphism */}
        <div className={`bg-[#faf8f4]/95 text-stone-800 rounded-3xl border-2 ${theme.cardBorder} ${theme.borderGlow} p-6 sm:p-9 shadow-2xl backdrop-blur-xl transition-all`}>
          
          {submitted ? (
            /* Pantalla de Éxito */
            <div className="text-center py-6 animate-in fade-in zoom-in-95">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl border-2 shadow-lg"
                style={{ borderColor: theme.accentColor, backgroundColor: `${theme.primaryColor}15` }}
              >
                {theme.simbolo}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                ¡Propuesta Recibida con Éxito!
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
                Gracias <strong>{formData.nombrePersonal || formData.nombre}</strong>. Tu propuesta de <strong>{formData.tipo}</strong> ha quedado inscripta para la <strong>{config?.lunaActiva || `Luna ${theme.signo}`}</strong> en Loma Verde.
              </p>

              <div className="space-y-3 max-w-md mx-auto">
                <button
                  onClick={() => onGoToFlyerStudio && onGoToFlyerStudio(lastCreated)}
                  className={`w-full bg-gradient-to-r ${theme.buttonGrad} text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Personalizar y Descargar mi Flyer</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Invitar a otro feriante o vecino</span>
                </button>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      nombre: '',
                      nombrePersonal: '',
                      contacto: '',
                      tipo: 'Oficio / Servicio',
                      descripcion: '',
                      instagram: '',
                      tienda: '',
                      mapa: '',
                      imagenBase64: ''
                    });
                    setImagePreview('');
                  }}
                  className="w-full text-stone-500 hover:text-stone-700 text-xs font-bold uppercase tracking-wider py-2 transition-colors"
                >
                  Inscribir otra propuesta
                </button>
              </div>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="border-b border-stone-200 pb-3 mb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Formulario de Convocatoria</span>
                  <span className="text-base font-normal text-stone-400">({theme.signo})</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Artesanos, oficios vecinales, gastronomía, productores y artistas locales.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nombre de Emprendimiento u Oficio */}
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1 tracking-wider">
                  Nombre del Emprendimiento / Oficio / Proyecto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Bicicletería El Rayo / LM Deco y Jardín / Panadería Casera"
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                />
              </div>

              {/* Nombre Personal & Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-stone-700 mb-1 tracking-wider">
                    Tu Nombre Personal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombrePersonal}
                    onChange={(e) => setFormData({ ...formData, nombrePersonal: e.target.value })}
                    placeholder="Ej: Lorena"
                    className="w-full p-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-stone-700 mb-1 tracking-wider">
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    placeholder="Ej: 11 1234-5678"
                    className="w-full p-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Rubro / Categoría */}
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1 tracking-wider">
                  Rubro / Categoría *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1 tracking-wider">
                  ¿Qué ofrecés o qué servicio brindás? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Service y reparación de bicis, deco boho, plantas aromáticas, alimentos saludables, accesorios..."
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs leading-relaxed"
                />
              </div>

              {/* Redes Sociales Opcionales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Instagram (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@mi_proyecto"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Tienda / Catálogo Web (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.tienda}
                    onChange={(e) => setFormData({ ...formData, tienda: e.target.value })}
                    placeholder="www.mitienda.com"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Foto o Logo para Flyer */}
              <div className="bg-stone-100/80 p-3.5 rounded-2xl border border-stone-200/90">
                <label className="block text-xs font-black uppercase text-stone-700 mb-1 flex items-center justify-between">
                  <span>Foto o Logo para tu Flyer (Opcional)</span>
                  <span className="text-[10px] text-amber-700 font-bold lowercase tracking-normal">auto-optimizado</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="text-xs text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer w-full"
                  />
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-10 h-10 rounded-lg object-cover border border-amber-500 shadow-sm shrink-0" 
                    />
                  )}
                </div>
              </div>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${theme.buttonGrad} text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4 cursor-pointer`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {loading 
                    ? 'Inscribiendo propuesta...' 
                    : `SUMARME A LA LUNA EN ${theme.signo.toUpperCase()} ✨`}
                </span>
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-stone-500">
                  Tu propuesta se publicará automáticamente en la cartelera vecinal y directorio.
                </span>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* 5. Pie de Convocatoria Comunitario */}
      <div className="max-w-xl mx-auto text-center text-xs text-stone-400 space-y-2 relative z-10 pb-12">
        <p className="font-serif">
          Encuentro Lunar 13:20 • Loma Verde - Escobar
        </p>
        <p className="text-[11px] text-stone-500">
          Economía fraterna, soberanía vecinal e intercambio en armonía con los ciclos naturales.
        </p>
      </div>

    </div>
  );
}
