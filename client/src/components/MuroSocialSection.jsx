import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Share2, 
  Heart, 
  Flame, 
  Moon, 
  Compass, 
  Feather, 
  Send, 
  MessageCircle, 
  Camera, 
  Globe, 
  Video, 
  Pin, 
  Check, 
  Copy, 
  ExternalLink, 
  Search, 
  Plus, 
  X, 
  Eye, 
  Tag, 
  Filter, 
  Palette, 
  Clock, 
  HelpCircle,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

// Posts por defecto en caso de no conexión o fallback
const DEFAULT_POSTS = [
  {
    id: "post-1",
    titulo: "El Susurro de las Cañas en Plenilunio",
    contenido: "Hay una hora en la tarde de Loma Verde donde el viento del este acaricia las cañas tacuara y el cielo se tiñe de violeta y oro. En esa pausa sagrada, el barrio recuerda su pacto con la tierra: no somos espectadores del paisaje, somos el paisaje haciéndose palabra, silencio y raíz viva.",
    autor: "Loma Verde Lunar",
    redOrigen: "mi_arte",
    redEtiqueta: "Mi Arte & Cosmovisión 🎨",
    urlOriginal: "",
    imagenUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    tags: ["#Poesia", "#Fotografia", "#LomaVerde", "#Frecuencia1320"],
    fijado: true,
    reacciones: { amor: 24, magia: 31, fuego: 12, tierra: 19, luz: 28 },
    createdAt: "2026-10-15T12:00:00.000Z",
    fechaTexto: "15 de Octubre • Plenilunio"
  },
  {
    id: "post-2",
    titulo: "Sembrando con la Luna: Sabiduría de Huerta Vecinal",
    contenido: "Compartido desde el grupo de WhatsApp de huerteros de Loma Verde:\n\n«Vecis, con la Luna en fase ascendente y el calorcito de esta semana, es el momento justo para trasplantar tomates y albahacas. Cubran la tierra con pasto seco para retener la humedad viva y no rieguen con el sol arriba. El agua es medicina si se da a tiempo.»",
    autor: "Comunidad de Huerta Loma Verde",
    redOrigen: "whatsapp",
    redEtiqueta: "Rescatado de WhatsApp 💬",
    urlOriginal: "",
    imagenUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    tags: ["#HuertaOrganica", "#Biodinamica", "#VecinosEnRed", "#SoberaniaAlimentaria"],
    fijado: false,
    reacciones: { amor: 18, magia: 9, fuego: 14, tierra: 35, luz: 15 },
    createdAt: "2026-10-14T18:30:00.000Z",
    fechaTexto: "14 de Octubre"
  },
  {
    id: "post-3",
    titulo: "Geometría Sagrada y Bioconstrucción Ancestral",
    contenido: "Resonancia desde el arte del mundo: cuando miramos un panal de abejas, una flor de girasol o las cúpulas de adobe que levantaban nuestros ancestros, comprendemos que la belleza no es un adorno: es la estructura misma de la vida en armonía. Que nuestras casas y plazas en Loma Verde sigan honrando esa proporción áurea.",
    autor: "Red Global de Arte & Biocultura",
    redOrigen: "mundo",
    redEtiqueta: "El Arte del Mundo 🌍",
    urlOriginal: "https://instagram.com",
    imagenUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    tags: ["#ArteDelMundo", "#GeometriaSagrada", "#Bioconstruccion", "#Armonia"],
    fijado: false,
    reacciones: { amor: 15, magia: 27, fuego: 8, tierra: 22, luz: 33 },
    createdAt: "2026-10-13T10:15:00.000Z",
    fechaTexto: "13 de Octubre"
  },
  {
    id: "post-4",
    titulo: "Alquimia en Barro: El Toque de Manos Feriantes",
    contenido: "Visto en Instagram: El proceso de tornear un cuenco de cerámica gres, paso a paso, hasta que el fuego sella la memoria del artesano. En la feria de Loma Verde celebramos los oficios que conservan el alma humana frente a la producción en masa.",
    autor: "@tallerpachamama.eco",
    redOrigen: "instagram",
    redEtiqueta: "Visto en Instagram 📸",
    urlOriginal: "https://instagram.com/tallerpachamama.eco",
    imagenUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    tags: ["#OficiosVivos", "#Ceramica", "#ManosHacedoras", "#FeriaLomaVerde"],
    fijado: false,
    reacciones: { amor: 22, magia: 16, fuego: 25, tierra: 18, luz: 14 },
    createdAt: "2026-10-12T16:45:00.000Z",
    fechaTexto: "12 de Octubre"
  },
  {
    id: "post-5",
    titulo: "Nuestra Tierra no se Negocia: El Cielo de Loma Verde",
    contenido: "Publicado en los grupos vecinales de Facebook:\n\n«Los vecinos estamos despiertos y alertas. Ninguna antena 5G ni emprendimiento invasivo puede avanzar sin el consentimiento libre e informado de quienes habitamos este suelo. La red real es la humana, mirándonos a los ojos.»",
    autor: "Asamblea Vecinal Loma Verde",
    redOrigen: "facebook",
    redEtiqueta: "Visto en Facebook 👥",
    urlOriginal: "https://facebook.com",
    imagenUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    tags: ["#DefensaDelBarrio", "#NoAlaAntena", "#SoberaniaVecinal", "#CieloLimpio"],
    fijado: false,
    reacciones: { amor: 42, magia: 11, fuego: 38, tierra: 29, luz: 20 },
    createdAt: "2026-10-11T09:20:00.000Z",
    fechaTexto: "11 de Octubre"
  }
];

export default function MuroSocialSection({ config, isAdmin, adminKey, onBackToHome }) {
  const [posts, setPosts] = useState(DEFAULT_POSTS);
  const [loading, setLoading] = useState(false);
  const [filtroRed, setFiltroRed] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [tagActivo, setTagActivo] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [modalNuevoPost, setModalNuevoPost] = useState(false);

  // Reacciones guardadas por el usuario en localStorage
  const [misReacciones, setMisReacciones] = useState(() => {
    try {
      const saved = localStorage.getItem('misReaccionesMuro');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Formulario nuevo post
  const [formNuevo, setFormNuevo] = useState({
    titulo: '',
    contenido: '',
    autor: 'Loma Verde Lunar',
    redOrigen: 'mi_arte',
    urlOriginal: '',
    imagenUrl: '',
    videoUrl: '',
    tags: '#Arte, #LomaVerde',
    fijado: false
  });

  // Cargar publicaciones del servidor
  const cargarPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/muro');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      }
    } catch (e) {
      console.warn("Usando posts por defecto de respaldo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPosts();
  }, []);

  // Manejar reacción
  const handleReaccionar = async (postId, tipo) => {
    const key = `${postId}_${tipo}`;
    const yaReacciono = misReacciones[key];

    // Actualización optimista local
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const recs = { ...(p.reacciones || { amor: 0, magia: 0, fuego: 0, tierra: 0, luz: 0 }) };
      recs[tipo] = Math.max(0, (recs[tipo] || 0) + (yaReacciono ? -1 : 1));
      return { ...p, reacciones: recs };
    }));

    const nuevasReacciones = { ...misReacciones, [key]: !yaReacciono };
    setMisReacciones(nuevasReacciones);
    try {
      localStorage.setItem('misReaccionesMuro', JSON.stringify(nuevasReacciones));
    } catch (e) {}

    // Enviar al servidor si se está agregando la reacción
    if (!yaReacciono) {
      try {
        await fetch(`/api/muro/${postId}/reaccionar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo })
        });
      } catch (err) {
        // Silencioso
      }
    }
  };

  // Compartir en WhatsApp
  const handleShareWhatsApp = (post) => {
    const urlPost = `https://lomaverdelunar.online/muro?post=${post.id}`;
    const texto = `✨ *${post.titulo.toUpperCase()}* ✨%0A` +
      `📌 _${post.redEtiqueta || 'Muro Comunitario Loma Verde'}_%0A` +
      `👤 *Por:* ${post.autor}%0A%0A` +
      `«${post.contenido.slice(0, 240)}${post.contenido.length > 240 ? '...' : ''}»%0A%0A` +
      `🌿 *Leelo completo y sumate a la conversación en:* ${urlPost}`;
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  };

  // Copiar link al portapapeles
  const handleCopyLink = async (post) => {
    const urlPost = `https://lomaverdelunar.online/muro?post=${post.id}`;
    try {
      await navigator.clipboard.writeText(urlPost);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {}
  };

  // Crear nuevo post (Admin)
  const handleCrearPost = async (e) => {
    e.preventDefault();
    if (!formNuevo.titulo || !formNuevo.contenido) {
      alert("Por favor completá al menos el título y el contenido.");
      return;
    }

    try {
      const res = await fetch('/api/admin/muro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'lomaverde'
        },
        body: JSON.stringify(formNuevo)
      });

      if (res.ok) {
        alert("¡Publicación compartida con éxito en el Muro!");
        setModalNuevoPost(false);
        setFormNuevo({
          titulo: '',
          contenido: '',
          autor: 'Loma Verde Lunar',
          redOrigen: 'mi_arte',
          urlOriginal: '',
          imagenUrl: '',
          videoUrl: '',
          tags: '#Arte, #LomaVerde',
          fijado: false
        });
        cargarPosts();
      } else {
        alert("Hubo un error al guardar la publicación.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Eliminar post (Admin)
  const handleEliminarPost = async (id) => {
    if (!confirm("¿Eliminar esta publicación del muro?")) return;
    try {
      const res = await fetch(`/api/admin/muro/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey || 'lomaverde' }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  // Filtrado de publicaciones
  const postsFiltrados = posts.filter(post => {
    const coincideRed = filtroRed === 'todas' || post.redOrigen === filtroRed;
    const coincideTag = !tagActivo || (post.tags || []).some(t => t.toLowerCase() === tagActivo.toLowerCase());
    const coincideBusqueda = !busqueda || 
      post.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      post.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
      post.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      (post.tags || []).some(t => t.toLowerCase().includes(busqueda.toLowerCase()));
    
    return coincideRed && coincideTag && coincideBusqueda;
  });

  // Metadatos visuales de las redes de origen
  const getRedMeta = (red) => {
    switch (red) {
      case 'whatsapp':
        return {
          label: 'Desde WhatsApp',
          icon: MessageCircle,
          colorBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          avatarBg: 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white',
          simbolo: '💬'
        };
      case 'instagram':
        return {
          label: 'Visto en Instagram',
          icon: Camera,
          colorBadge: 'bg-pink-100 text-pink-900 border-pink-300',
          avatarBg: 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white',
          simbolo: '📸'
        };
      case 'facebook':
        return {
          label: 'Visto en Facebook',
          icon: Globe,
          colorBadge: 'bg-blue-100 text-blue-900 border-blue-300',
          avatarBg: 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white',
          simbolo: '👥'
        };
      case 'mundo':
        return {
          label: 'El Arte del Mundo',
          icon: Globe,
          colorBadge: 'bg-purple-100 text-purple-900 border-purple-300',
          avatarBg: 'bg-gradient-to-tr from-indigo-700 via-purple-700 to-amber-500 text-white',
          simbolo: '🌍'
        };
      case 'video':
        return {
          label: 'Cápsula de Video',
          icon: Video,
          colorBadge: 'bg-red-100 text-red-900 border-red-300',
          avatarBg: 'bg-gradient-to-tr from-red-600 to-rose-700 text-white',
          simbolo: '🎥'
        };
      default:
        return {
          label: 'Mi Arte & Cosmovisión',
          icon: Palette,
          colorBadge: 'bg-amber-100 text-amber-950 border-amber-300',
          avatarBg: 'bg-gradient-to-tr from-amber-500 via-yellow-600 to-emerald-700 text-white',
          simbolo: '🎨'
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. CABECERA POÉTICA DEL MURO CÓSMICO                                      */}
      {/* ========================================================================= */}
      <header className="relative text-center max-w-3xl mx-auto space-y-4 pt-2">
        
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 text-amber-900 border border-amber-400/60 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Frecuencia 13:20 • Convergencia Comunitaria</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-loma-green tracking-tight leading-tight">
          Muro Cósmico & Red Social
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-loma-wood font-medium">
          «El espacio donde converge mi arte y el arte del mundo»
        </p>

        <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Un puente vivo que reúne lo que florece en nuestra tierra y las resonancias que llegan desde <strong>WhatsApp</strong>, <strong>Instagram</strong>, <strong>Facebook</strong> y maestros del planeta. Fotografías, poesía, reflexiones, oficios de feriantes y saberes compartidos para toda la comunidad.
        </p>

        {/* Acciones principales */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          
          <button
            onClick={() => {
              const url = `https://wa.me/?text=${encodeURIComponent('✨ Te invito a recorrer el Muro Cósmico de Loma Verde Lunar: donde converge el arte del barrio y la inspiración del mundo: https://lomaverdelunar.online/muro')}`;
              window.open(url, '_blank');
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Compartir Muro en WhatsApp</span>
          </button>

          <button
            onClick={() => {
              const url = `https://wa.me/5491144332211?text=${encodeURIComponent('¡Hola Loma Verde Lunar! 🌿 Me gustaría sugerir un contenido / compartir mi arte para que lo sumen al Muro Cósmico.')}`;
              window.open(url, '_blank');
            }}
            className="bg-white hover:bg-amber-50 text-loma-green border border-loma-wood/40 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Feather className="w-3.5 h-3.5 text-loma-accent" />
            <span>Enviar Aporte o Arte 🌿</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setModalNuevoPost(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar en el Muro</span>
            </button>
          )}

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FILTROS POR RED DE ORIGEN & BÚSQUEDA                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
        
        {/* Pestañas de Redes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'todas', label: '🌟 Todo el Muro', icon: Sparkles },
            { id: 'mi_arte', label: '🎨 Mi Arte & Poesía', icon: Palette },
            { id: 'whatsapp', label: '💬 Desde WhatsApp', icon: MessageCircle },
            { id: 'instagram', label: '📸 Instagram & Reels', icon: Camera },
            { id: 'facebook', label: '👥 Facebook & Debates', icon: Globe },
            { id: 'mundo', label: '🌍 El Arte del Mundo', icon: Globe }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFiltroRed(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                filtroRed === tab.id
                  ? 'bg-loma-green text-white shadow-sm ring-2 ring-loma-green/30'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Barra de Búsqueda y Hashtags Populares */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por palabra clave, poema, autor o rubro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-loma-green/40 transition-all"
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Hashtags sugeridos */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['#Poesia', '#Fotografia', '#HuertaOrganica', '#GeometriaSagrada', '#OficiosVivos', '#NoAlaAntena'].map(tag => (
              <button
                key={tag}
                onClick={() => setTagActivo(tagActivo === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                  tagActivo === tag
                    ? 'bg-amber-400 text-amber-950 font-bold'
                    : 'bg-stone-100 hover:bg-amber-100 text-stone-600'
                }`}
              >
                {tag}
              </button>
            ))}
            {tagActivo && (
              <button
                onClick={() => setTagActivo(null)}
                className="text-xs text-red-600 hover:underline font-bold px-1"
                title="Quitar filtro de etiqueta"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. LISTADO DE PUBLICACIONES EN EL FEED                                    */}
      {/* ========================================================================= */}
      {postsFiltrados.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <Palette className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-800">
            No se encontraron publicaciones con ese criterio
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Probá seleccionando "Todo el Muro" o limpiando el filtro de búsqueda.
          </p>
          <button
            onClick={() => { setFiltroRed('todas'); setBusqueda(''); setTagActivo(null); }}
            className="bg-loma-green text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Ver todas las publicaciones
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {postsFiltrados.map((post) => {
            const meta = getRedMeta(post.redOrigen);
            const MetaIcon = meta.icon;
            const isCopied = copiedId === post.id;

            return (
              <article
                key={post.id}
                className={`relative overflow-hidden bg-white rounded-3xl border transition-all duration-300 shadow-xs hover:shadow-md ${
                  post.fijado ? 'border-amber-400/80 ring-2 ring-amber-300/40 bg-gradient-to-b from-amber-50/20 to-white' : 'border-stone-200/90'
                }`}
              >
                
                {/* Badge Fijado */}
                {post.fijado && (
                  <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-amber-950 font-black text-[10px] uppercase tracking-wider px-4 py-1 flex items-center justify-between shadow-2xs">
                    <span className="flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-950" />
                      Publicación Destacada en la Portada del Muro
                    </span>
                    <span>13:20</span>
                  </div>
                )}

                <div className="p-5 sm:p-7 space-y-4">
                  
                  {/* Encabezado del Post */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${meta.avatarBg} flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0`}>
                        {meta.simbolo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                            {post.autor}
                          </h4>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.colorBadge}`}>
                            {post.redEtiqueta || meta.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 block mt-0.5 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {post.fechaTexto || 'Reciente'}
                        </span>
                      </div>
                    </div>

                    {/* Acciones admin sobre el post */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEliminarPost(post.id)}
                          className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 text-xs transition-colors"
                          title="Eliminar publicación"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Título y Cuerpo del Post */}
                  <div className="space-y-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                      {post.titulo}
                    </h2>

                    <div className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-light">
                      {post.contenido}
                    </div>
                  </div>

                  {/* Imagen del Post */}
                  {post.imagenUrl && (
                    <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 max-h-[480px] group cursor-pointer">
                      <img
                        src={post.imagenUrl}
                        alt={post.titulo}
                        onClick={() => setLightboxImg(post.imagenUrl)}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div 
                        onClick={() => setLightboxImg(post.imagenUrl)}
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-2xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver en Pantalla Completa</span>
                      </div>
                    </div>
                  )}

                  {/* Video Embed si existe */}
                  {post.videoUrl && (
                    <div className="rounded-2xl overflow-hidden bg-stone-950 aspect-video border border-stone-300">
                      <iframe
                        src={post.videoUrl}
                        title={post.titulo}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Enlace externo opcional */}
                  {post.urlOriginal && (
                    <div className="pt-1">
                      <a
                        href={post.urlOriginal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-loma-green hover:text-loma-wood hover:underline"
                      >
                        <span>Ver publicación original completa</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTagActivo(tagActivo === tag ? null : tag)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                            tagActivo === tag
                              ? 'bg-amber-400 text-amber-950 font-bold'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* BARRA DE REACCIONES CÓSMICAS & COMPARTIR                 */}
                  {/* ========================================================= */}
                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Reacciones */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      
                      {/* Amor */}
                      <button
                        onClick={() => handleReaccionar(post.id, 'amor')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                          misReacciones[`${post.id}_amor`]
                            ? 'bg-rose-100 text-rose-700 border border-rose-300 shadow-2xs'
                            : 'bg-stone-50 hover:bg-rose-50 text-stone-600'
                        }`}
                        title="Amor / Me resuena"
                      >
                        <Heart className={`w-3.5 h-3.5 ${misReacciones[`${post.id}_amor`] ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
                        <span>{post.reacciones?.amor || 0}</span>
                      </button>

                      {/* Magia Lunar */}
                      <button
                        onClick={() => handleReaccionar(post.id, 'magia')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                          misReacciones[`${post.id}_magia`]
                            ? 'bg-purple-100 text-purple-800 border border-purple-300 shadow-2xs'
                            : 'bg-stone-50 hover:bg-purple-50 text-stone-600'
                        }`}
                        title="Magia Lunar"
                      >
                        <Moon className={`w-3.5 h-3.5 ${misReacciones[`${post.id}_magia`] ? 'fill-purple-600 text-purple-600' : 'text-stone-400'}`} />
                        <span>{post.reacciones?.magia || 0}</span>
                      </button>

                      {/* Fuego Creativo */}
                      <button
                        onClick={() => handleReaccionar(post.id, 'fuego')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                          misReacciones[`${post.id}_fuego`]
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                            : 'bg-stone-50 hover:bg-amber-50 text-stone-600'
                        }`}
                        title="Fuego Creativo"
                      >
                        <Flame className={`w-3.5 h-3.5 ${misReacciones[`${post.id}_fuego`] ? 'fill-amber-600 text-amber-600' : 'text-stone-400'}`} />
                        <span>{post.reacciones?.fuego || 0}</span>
                      </button>

                      {/* Conexión Tierra */}
                      <button
                        onClick={() => handleReaccionar(post.id, 'tierra')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                          misReacciones[`${post.id}_tierra`]
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                            : 'bg-stone-50 hover:bg-emerald-50 text-stone-600'
                        }`}
                        title="Conexión Tierra & Raíz"
                      >
                        <span className="text-xs">🌿</span>
                        <span>{post.reacciones?.tierra || 0}</span>
                      </button>

                      {/* Inspiración / Luz */}
                      <button
                        onClick={() => handleReaccionar(post.id, 'luz')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                          misReacciones[`${post.id}_luz`]
                            ? 'bg-yellow-100 text-yellow-900 border border-yellow-400 shadow-2xs'
                            : 'bg-stone-50 hover:bg-yellow-50 text-stone-600'
                        }`}
                        title="Inspiración & Luz"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${misReacciones[`${post.id}_luz`] ? 'text-yellow-600' : 'text-stone-400'}`} />
                        <span>{post.reacciones?.luz || 0}</span>
                      </button>

                    </div>

                    {/* Botones de Compartir */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleShareWhatsApp(post)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Compartir publicación en grupos de WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Compartir</span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(post)}
                        className="bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Copiar enlace directo"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                        <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL LIGHTBOX DE IMAGEN EN PANTALLA COMPLETA                          */}
      {/* ========================================================================= */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={lightboxImg} 
              alt="Detalle artístico" 
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain mx-auto"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-4 -right-4 bg-white text-stone-900 rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-lg hover:bg-amber-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL DE PUBLICACIÓN RÁPIDA (ADMIN)                                    */}
      {/* ========================================================================= */}
      {modalNuevoPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-loma-green">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-loma-green" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Nueva Publicación en el Muro
                </h3>
              </div>
              <button 
                onClick={() => setModalNuevoPost(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearPost} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Título de la Publicación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: El Fuego de la Creatividad Comunitaria"
                  value={formNuevo.titulo}
                  onChange={(e) => setFormNuevo({ ...formNuevo, titulo: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Red de Origen *
                  </label>
                  <select
                    value={formNuevo.redOrigen}
                    onChange={(e) => setFormNuevo({ ...formNuevo, redOrigen: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="mi_arte">🎨 Mi Arte & Cosmovisión</option>
                    <option value="whatsapp">💬 Desde WhatsApp</option>
                    <option value="instagram">📸 Visto en Instagram</option>
                    <option value="facebook">👥 Visto en Facebook</option>
                    <option value="mundo">🌍 El Arte del Mundo</option>
                    <option value="video">🎥 Cápsula de Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Autor / Fuente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Loma Verde Lunar o @usuario"
                    value={formNuevo.autor}
                    onChange={(e) => setFormNuevo({ ...formNuevo, autor: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Texto / Poesía / Reflexión *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribí aquí el texto, la poesía o la información rescatada..."
                  value={formNuevo.contenido}
                  onChange={(e) => setFormNuevo({ ...formNuevo, contenido: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    URL de Imagen (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formNuevo.imagenUrl}
                    onChange={(e) => setFormNuevo({ ...formNuevo, imagenUrl: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    URL de Video / Embed (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/embed/..."
                    value={formNuevo.videoUrl}
                    onChange={(e) => setFormNuevo({ ...formNuevo, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Enlace Original (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="Link a Instagram, Facebook o nota"
                    value={formNuevo.urlOriginal}
                    onChange={(e) => setFormNuevo({ ...formNuevo, urlOriginal: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Tags (Separados por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="#Arte, #Poesia, #Huerta"
                    value={formNuevo.tags}
                    onChange={(e) => setFormNuevo({ ...formNuevo, tags: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-fijado"
                  checked={formNuevo.fijado}
                  onChange={(e) => setFormNuevo({ ...formNuevo, fijado: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="chk-fijado" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Fijar esta publicación en la cabecera del muro
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalNuevoPost(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-loma-green hover:bg-loma-wood text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  Publicar en el Muro
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BANNER DE CIERRE COMUNITARIO                                           */}
      {/* ========================================================================= */}
      <footer className="bg-gradient-to-r from-loma-bg via-amber-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-loma-wood/30 text-center space-y-4">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-loma-green">
          ¿Querés que tu arte o propuesta forme parte del próximo Encuentro?
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto">
          En cada plenilunio nos encontramos en la plaza para compartir ferias, talleres, escenario libre y el mercado de virtudes bajo la frecuencia natural 13:20.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              const url = `https://wa.me/5491144332211?text=${encodeURIComponent('¡Hola! Me gustaría sumarme con mi arte o taller al próximo Encuentro Lunar de Loma Verde 🌕')}`;
              window.open(url, '_blank');
            }}
            className="bg-loma-green hover:bg-loma-wood text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            Sumate con tu Arte o Música 🎨
          </button>

          <button
            onClick={onBackToHome}
            className="text-stone-500 hover:text-stone-800 font-semibold px-3 py-2 text-xs transition-colors"
          >
            Volver a la Portada
          </button>
        </div>
      </footer>

    </div>
  );
}
