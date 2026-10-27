import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Share2, 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  Download, 
  Sparkles, 
  Newspaper, 
  Calendar, 
  ExternalLink, 
  Pin, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  ShieldAlert, 
  Store, 
  Edit3,
  Flame,
  CheckCheck,
  Camera,
  Settings,
  Link as LinkIcon,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getEnergiaDelDia } from '../../utils/energiaCalc';

export default function PanelDifusionRedes({ adminKey, config, noticias = [], onRefreshData }) {
  // Preset seleccionado: 'energia', 'noticia', 'feria', 'antena', 'libre'
  const [tipoPreset, setTipoPreset] = useState('energia');
  const [noticiaSeleccionadaId, setNoticiaSeleccionadaId] = useState('');
  
  // Datos del post en edición
  const [formPost, setFormPost] = useState({
    titulo: '',
    contenido: '',
    urlDestino: 'https://lomaverdelunar.online/energia',
    imagenUrl: '/loma-verde-callecita-opt.jpg',
    tags: '#LomaVerdeLunar, #EnergiaDelDia',
    redOrigen: 'energia',
    fijarEnMuro: false
  });

  // Estados de feedback
  const [copiedKey, setCopiedKey] = useState(null); // 'wa', 'ig', 'todo'
  const [publicandoEnMuro, setPublicandoEnMuro] = useState(false);
  const [muroPublicadoExito, setMuroPublicadoExito] = useState(false);
  const [vistaPreviaTab, setVistaPreviaTab] = useState('wa'); // 'wa', 'ig', 'muro'

  // Estados de Integración Directa con Instagram
  const [igStatus, setIgStatus] = useState({
    connected: false,
    metodo: 'webhook',
    userName: '@lomaverdelunar',
    webhookUrl: '',
    instagramAccountId: '',
    lastPublishedAt: null
  });
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [publicandoEnInstagram, setPublicandoEnInstagram] = useState(false);
  const [instagramResultado, setInstagramResultado] = useState(null);
  const [guardandoIgConfig, setGuardandoIgConfig] = useState(false);
  const [igConfigForm, setIgConfigForm] = useState({
    metodo: 'webhook',
    webhookUrl: '',
    instagramAccountId: '',
    accessToken: '',
    userName: '@lomaverdelunar'
  });

  // Canvas ref para exportación de placas para redes
  const canvasRef = useRef(null);

  // Obtener estado de la conexión de Instagram
  const fetchInstagramStatus = async () => {
    try {
      const res = await fetch('/api/admin/instagram/status', {
        headers: { 'x-admin-key': adminKey || 'lomaverde' }
      });
      if (res.ok) {
        const data = await res.json();
        setIgStatus(data);
        setIgConfigForm(prev => ({
          ...prev,
          metodo: data.metodo || 'webhook',
          webhookUrl: data.webhookUrl || '',
          instagramAccountId: data.instagramAccountId || '',
          userName: data.userName || '@lomaverdelunar'
        }));
      }
    } catch (err) {
      console.error('Error obteniendo estado de Instagram:', err);
    }
  };

  useEffect(() => {
    fetchInstagramStatus();
  }, [adminKey]);

  // Fecha actual y cálculo de energía seguro
  const hoy = useMemo(() => new Date(), []);
  const energiaHoy = useMemo(() => {
    try {
      return getEnergiaDelDia(config || {}, hoy);
    } catch (err) {
      console.error('Error calculando energía del día en PanelDifusion:', err);
      return null;
    }
  }, [config, hoy]);

  // Si hay noticias, seleccionar la primera por defecto si no hay seleccionada
  useEffect(() => {
    if (noticias && noticias.length > 0 && !noticiaSeleccionadaId) {
      const destacada = noticias.find(n => n.destacada) || noticias[0];
      setNoticiaSeleccionadaId(destacada.id);
    }
  }, [noticias, noticiaSeleccionadaId]);

  // =========================================================================
  // GENERADORES DE CONTENIDO POR PRESET
  // =========================================================================

  const aplicarPreset = (tipo, noticiaIdParam) => {
    try {
      setTipoPreset(tipo);
      setMuroPublicadoExito(false);

      if (tipo === 'energia') {
        const e = energiaHoy || {};
        const maya = e.maya || {};
        const sol = e.sol || {};
        const luna = e.luna || {};
        const fase = luna.fase || {};
        const oraculo = maya.oraculo || {};

        const kinNom = maya.kinNombre || 'Tierra Entonado Rojo';
        const kinNum = maya.kinNumero || 57;
        const solSigno = `${sol.signo || 'Libra'} ${sol.simbolo || '♎'}`.trim();
        const lunaFase = `${fase.name || 'Gibosa Creciente'} en ${luna.signo || 'Piscis'} ${luna.simbolo || '♓'}`.trim();
        const luz = fase.illumination != null ? `(${fase.illumination}% luz)` : '';

        const titulo = `✨ Energía del Día: Kin ${kinNum} ${kinNom} • ${e.fechaTexto || 'Hoy'}`;
        const contenido = `✨ *ENERGÍA DEL DÍA • LOMA VERDE LUNAR* 🌙
📅 ${e.fechaTexto || 'Hoy'} • Sincronario 13:20

☀️ *Sol:* ${solSigno} (${sol.elemento || 'Aire Cardinal'})
🌙 *Luna:* ${lunaFase} ${luz}

🔮 *KIN MAYA:* Kin ${kinNum} • *${kinNom}*
🌊 *Onda Encantada:* ${maya.ondaEncantada || 'Onda del Ciclo'}
🏰 *Castillo:* ${maya.castillo?.nombre || 'Castillo Cósmico'}

💫 *Quinta Fuerza:*
• Guía: ${oraculo.guia?.nombre || 'Guía Superior'}
• Análogo: ${oraculo.analogo?.nombre || 'Aliado'}
• Antípoda: ${oraculo.antipoda?.nombre || 'Desafío'}
• Oculto: ${oraculo.oculto?.nombre || 'Poder Oculto'}

🌿 *Reflexión del Día:*
"${sol.lema || 'Sintonía armónica con la tierra y el cosmos.'}"

✨ Conocé el informe sincrónico y astronómico completo en:
🔗 https://lomaverdelunar.online/energia`;

        setFormPost({
          titulo,
          contenido,
          urlDestino: 'https://lomaverdelunar.online/energia',
          imagenUrl: '/fondo-loma-verde.jpg',
          tags: '#LomaVerdeLunar, #EnergiaDelDia, #KinMaya, #Astrologia, #LomaVerde',
          redOrigen: 'energia',
          fijarEnMuro: false
        });
      }

      else if (tipo === 'noticia') {
        const targetId = noticiaIdParam || noticiaSeleccionadaId;
        const lista = Array.isArray(noticias) ? noticias : [];
        const n = lista.length > 0
          ? (lista.find(x => x.id === targetId) || lista[0])
          : null;

        if (n) {
          const titulo = n.titulo || 'Noticia de El Diario Lunar';
          const contenido = `📰 *EL DIARIO LUNAR • LOMA VERDE*
${n.volanta ? `📌 *${n.volanta.toUpperCase()}*\n` : ''}
✨ *${n.titulo}*

${n.copete || n.bajada || (n.texto ? n.texto.slice(0, 200) + '...' : '')}

📖 Leé la crónica completa y las notas de cada luna en:
🔗 https://lomaverdelunar.online/diario?nota=${n.id}`;

          setFormPost({
            titulo,
            contenido,
            urlDestino: `https://lomaverdelunar.online/diario?nota=${n.id}`,
            imagenUrl: n.img || n.imagenUrl || '/loma-verde-callecita-opt.jpg',
            tags: Array.isArray(n.etiquetas) ? n.etiquetas.join(', ') : '#ElDiarioLunar, #LomaVerde, #Comunidad',
            redOrigen: 'noticia',
            fijarEnMuro: false
          });
        } else {
          setFormPost({
            titulo: '📰 El Diario Lunar: Crónicas y Voces de Nuestra Comunidad',
            contenido: `📰 *EL DIARIO LUNAR • LOMA VERDE*\n\nConocé las últimas crónicas, entrevistas, agroecología y notas de cada ciclo lunar en:\n🔗 https://lomaverdelunar.online/diario`,
            urlDestino: 'https://lomaverdelunar.online/diario',
            imagenUrl: '/loma-verde-callecita-opt.jpg',
            tags: '#ElDiarioLunar, #LomaVerde, #Comunidad',
            redOrigen: 'noticia',
            fijarEnMuro: false
          });
        }
      }

      else if (tipo === 'feria') {
        const lunaActiva = config?.lunaActiva || 'Luna Llena en Tauro';
        const fechaFeria = config?.fecha || 'Domingo 8 de Noviembre de 2026';
        const lugarFeria = config?.lugar || 'Plaza La Misión, Loma Verde';
        const horarioFeria = config?.horarioTexto || 'De 12:00 a 18:00 hs';
        const whatsApp = config?.whatsappCoordinacion || '11 4503-056';

        const titulo = `🎪 Convocatoria Abierta: Feria ${lunaActiva} en ${lugarFeria}`;
        const contenido = `🎪 *¡CONVOCATORIA ABIERTA: FERIA ${lunaActiva.toUpperCase()}!* 🌕
📍 *Lugar:* ${lugarFeria}
🗓️ *Fecha:* ${fechaFeria}
⏰ *Horario Feria:* ${horarioFeria}
🎪 *Armado de Feriantes:* De 11:00 a 12:00 hs

Invitamos a feriantes, artesanos, productores agroecológicos, huerteros, terapeutas y artistas a sumarse a este gran encuentro comunitario.

🌿 *Propuestas de la jornada:*
• Puestos de artesanías genuinas y alimentos conscientes
• Escenario acústico y música en vivo
• Intercambio de semillas nativas y saberes de la tierra
• Circuito fraterno con Troqueles Comunitarios

📝 *Anotate completando la ficha online (cupos limitados):*
👉 https://lomaverdelunar.online/sumate

💬 Dudas y consultas directas al WhatsApp de Coordinación: ${whatsApp}
¡Vení a compartir tu labor con todo el barrio!`;

        setFormPost({
          titulo,
          contenido,
          urlDestino: 'https://lomaverdelunar.online/sumate',
          imagenUrl: '/loma-verde-callecita-opt.jpg',
          tags: '#FeriaLunar, #LomaVerde, #Artesanos, #Agroecologia, #Comunidad',
          redOrigen: 'feria',
          fijarEnMuro: true
        });
      }

      else if (tipo === 'antena') {
        const titulo = '🛡️ Alerta Vecinal: No a la Antena de Telmex en Loma Verde';
        const contenido = `🚨 *ALERTA VECINAL EN LOMA VERDE: FRENEMOS LA ANTENA DE TELMEX*
Exigimos la aplicación urgente del Principio Precautorio (Ley 25.675) y la REUBICACIÓN INMEDIATA fuera de zonas residenciales (+300m a 500m de viviendas y escuelas).

❌ No a mega-torres de radiación continua 24/7 sobre las casas y dormitorios de nuestras familias.
✔️ La empresa debe ubicar su infraestructura en zonas industriales o predios no habitados.

✍️ *Sumá tu adhesión vecinal al petitorio formal para el Municipio de Escobar y ENACOM:*
👉 https://lomaverdelunar.online/noalaantena

¡Defendamos la salud, el aire puro y la tranquilidad de Loma Verde!`;

        setFormPost({
          titulo,
          contenido,
          urlDestino: 'https://lomaverdelunar.online/noalaantena',
          imagenUrl: '/loma-verde-callecita-opt.jpg',
          tags: '#NoAlaAntena, #LomaVerde, #PrincipioPrecautorio, #SaludAmbiental',
          redOrigen: 'antena',
          fijarEnMuro: false
        });
      }

      else if (tipo === 'libre') {
        setFormPost({
          titulo: '🌟 Comunicado Comunitario de Loma Verde Lunar',
          contenido: `🌿 *COMUNICADO COMUNITARIO • LOMA VERDE LUNAR* 🌙

Escribí aquí tu mensaje, poesía, convocatoria o anuncio para compartir con los vecinos y redes del proyecto...

✨ Seguinos y enterate de todas las novedades en:
🔗 https://lomaverdelunar.online`,
          urlDestino: 'https://lomaverdelunar.online',
          imagenUrl: '/loma-verde-callecita-opt.jpg',
          tags: '#LomaVerde, #Comunidad, #ArteLocal',
          redOrigen: 'comunidad',
          fijarEnMuro: false
        });
      }
    } catch (err) {
      console.error('Error aplicando preset en PanelDifusion:', err);
    }
  };

  // Cargar preset de energía al montar el componente de forma segura
  useEffect(() => {
    aplicarPreset('energia');
  }, [energiaHoy]);

  // =========================================================================
  // ACCIONES DE DIFUSIÓN
  // =========================================================================

  // 1. WhatsApp
  const handleCompartirWhatsApp = () => {
    const textoCompleto = `${formPost.contenido || ''}\n\n${formPost.tags || ''}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoCompleto.trim())}`;
    window.open(url, '_blank');
  };

  const handleCopiarWhatsApp = async () => {
    const textoCompleto = `${formPost.contenido || ''}\n\n${formPost.tags || ''}`;
    try {
      await navigator.clipboard.writeText(textoCompleto.trim());
      setCopiedKey('wa');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      alert('Seleccioná el texto para copiarlo manualmente.');
    }
  };

  // 2. Instagram Directo y Copia
  const handlePublicarDirectoInstagram = async () => {
    if (!igStatus.connected) {
      setShowInstagramModal(true);
      return;
    }

    if (!formPost.titulo?.trim() || !formPost.contenido?.trim()) {
      alert('Por favor completá un título y contenido antes de publicar.');
      return;
    }

    setPublicandoEnInstagram(true);
    setInstagramResultado(null);

    try {
      const res = await fetch('/api/admin/instagram/publicar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'lomaverde'
        },
        body: JSON.stringify({
          titulo: formPost.titulo,
          contenido: formPost.contenido,
          tags: formPost.tags,
          imagenUrl: formPost.imagenUrl,
          urlDestino: formPost.urlDestino
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al publicar en Instagram');
      }

      setInstagramResultado({
        success: true,
        mensaje: data.mensaje || '¡Publicación realizada con éxito en tu cuenta de Instagram!'
      });
      fetchInstagramStatus();
    } catch (err) {
      setInstagramResultado({
        success: false,
        mensaje: err.message || 'Ocurrió un error al intentar publicar en Instagram.'
      });
    } finally {
      setPublicandoEnInstagram(false);
    }
  };

  const handleGuardarInstagramConfig = async (e) => {
    e?.preventDefault();
    setGuardandoIgConfig(true);
    try {
      const res = await fetch('/api/admin/instagram/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'lomaverde'
        },
        body: JSON.stringify(igConfigForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar configuración');
      alert(data.mensaje || 'Conexión con Instagram actualizada exitosamente.');
      fetchInstagramStatus();
      setShowInstagramModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardandoIgConfig(false);
    }
  };

  const handleDesconectarInstagram = async () => {
    if (!confirm('¿Seguro que deseas desconectar la cuenta de Instagram del sistema?')) return;
    try {
      const res = await fetch('/api/admin/instagram/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'lomaverde'
        },
        body: JSON.stringify({ disconnect: true })
      });
      if (res.ok) {
        fetchInstagramStatus();
        setShowInstagramModal(false);
        alert('Cuenta de Instagram desconectada.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCopiarInstagram = async () => {
    const textoLimpio = (formPost.contenido || '')
      .replace(/\*/g, '')
      .trim();
    const copyIg = `${(formPost.titulo || '').toUpperCase()}\n\n${textoLimpio}\n\n.\n.\n.\n${formPost.tags || ''}`;
    try {
      await navigator.clipboard.writeText(copyIg);
      setCopiedKey('ig');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      alert('Seleccioná el texto para copiarlo manualmente.');
    }
  };

  // 3. Facebook & Telegram
  const handleCompartirFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formPost.urlDestino || 'https://lomaverdelunar.online')}&quote=${encodeURIComponent(formPost.titulo || '')}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCompartirTelegram = () => {
    const texto = `${formPost.titulo || ''}\n\n${formPost.contenido || ''}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(formPost.urlDestino || 'https://lomaverdelunar.online')}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // 4. Publicar en el Muro de la Web
  const handlePublicarEnMuro = async () => {
    if (!formPost.titulo?.trim() || !formPost.contenido?.trim()) {
      alert('Por favor completá un título y contenido para publicar.');
      return;
    }

    setPublicandoEnMuro(true);
    try {
      const payload = {
        titulo: formPost.titulo,
        contenido: formPost.contenido,
        autor: 'Loma Verde Lunar',
        redOrigen: formPost.redOrigen || 'comunidad',
        urlOriginal: formPost.urlDestino || '',
        imagenUrl: formPost.imagenUrl || '',
        tags: formPost.tags || '#LomaVerde',
        fijado: formPost.fijarEnMuro || false
      };

      const res = await fetch('/api/admin/muro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al publicar en el Muro.');
      setMuroPublicadoExito(true);
      if (onRefreshData) onRefreshData();
      setTimeout(() => setMuroPublicadoExito(false), 5000);
    } catch (err) {
      alert(err.message);
    } finally {
      setPublicandoEnMuro(false);
    }
  };

  // 5. Generar y Descargar Placa Cuadrada (1080x1080) para Instagram / WhatsApp
  const handleDescargarPlacaVisual = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1080;

    // Fondo degradé armónico
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#1c331b');
    grad.addColorStop(0.5, '#2b5329');
    grad.addColorStop(1, '#112111');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Marco dorado decorativo
    ctx.strokeStyle = '#c48c26';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1000, 1000);
    ctx.strokeStyle = 'rgba(196, 140, 38, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, 976, 976);

    // Cabezal superior
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e8d7b8';
    ctx.font = 'bold 26px serif';
    ctx.fillText('L O M A   V E R D E   L U N A R', 540, 120);

    // Filete dorado
    ctx.strokeStyle = '#c48c26';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 145);
    ctx.lineTo(740, 145);
    ctx.stroke();

    // Fecha
    ctx.fillStyle = '#a8bba0';
    ctx.font = '500 22px sans-serif';
    ctx.fillText(hoy.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(), 540, 185);

    // Título Principal (envuelto)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px serif';
    const words = (formPost.titulo || 'Loma Verde').split(' ');
    let line = '';
    let y = 280;
    const maxLineW = 880;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        ctx.fillText(line.trim(), 540, y);
        line = words[n] + ' ';
        y += 56;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 540, y);

    // Caja de contenido resumen
    y += 40;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(90, y, 900, 440);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(90, y, 900, 440);

    // Contenido formateado en líneas
    ctx.fillStyle = '#f3efe6';
    ctx.font = '400 24px sans-serif';
    ctx.textAlign = 'left';
    
    const lineas = (formPost.contenido || '')
      .split('\n')
      .map(l => l.replace(/\*/g, '').trim())
      .filter(l => l.length > 0)
      .slice(0, 9);

    let textY = y + 55;
    lineas.forEach((lin) => {
      const linTrunc = lin.length > 68 ? lin.slice(0, 65) + '...' : lin;
      ctx.fillText(linTrunc, 125, textY);
      textY += 42;
    });

    // Pie de placa con llamado a la acción
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c48c26';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('lomaverdelunar.online', 540, 970);
    ctx.fillStyle = '#a8bba0';
    ctx.font = '20px sans-serif';
    ctx.fillText('Comunidad • Soberanía • Tiempo Sincrónico', 540, 1010);

    // Descargar JPG
    const link = document.createElement('a');
    link.download = `Loma_Verde_${tipoPreset}_${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  };

  const insertarEmoji = (emoji) => {
    setFormPost(prev => ({
      ...prev,
      contenido: (prev.contenido || '') + ' ' + emoji
    }));
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6 animate-fadeIn">
      
      {/* 1. Encabezado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Centro de Difusión Multicanal</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-loma-green flex items-center gap-2">
            <span>Posteo & Difusión a Redes Sociales 📢</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 max-w-2xl">
            Generá publicaciones con un solo clic y compartilas al instante en WhatsApp, Instagram, Facebook, Telegram y el Muro Comunitario de la web.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <a
            href="/muro"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial text-center bg-stone-100 hover:bg-stone-200 text-stone-700 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver Muro Web</span>
          </a>
        </div>
      </div>

      {/* 2. Selector de Plantillas Rápidas (Presets) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          1. Elegí qué contenido querés difundir:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          
          <button
            type="button"
            onClick={() => aplicarPreset('energia')}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              tipoPreset === 'energia'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs ring-2 ring-emerald-500/30'
                : 'border-gray-200 hover:border-gray-300 bg-[#faf9f5] text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">✨</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                Hoy
              </span>
            </div>
            <div>
              <div className="font-bold text-xs">Energías del Día</div>
              <div className="text-[10px] text-gray-500 line-clamp-1">Kin Maya y Astros</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => aplicarPreset('noticia')}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              tipoPreset === 'noticia'
                ? 'border-amber-600 bg-amber-50/80 text-amber-950 shadow-xs ring-2 ring-amber-500/30'
                : 'border-gray-200 hover:border-gray-300 bg-[#faf9f5] text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">📰</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                Diario
              </span>
            </div>
            <div>
              <div className="font-bold text-xs">Noticia Editorial</div>
              <div className="text-[10px] text-gray-500 line-clamp-1">El Diario Lunar</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => aplicarPreset('feria')}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              tipoPreset === 'feria'
                ? 'border-purple-600 bg-purple-50/80 text-purple-950 shadow-xs ring-2 ring-purple-500/30'
                : 'border-gray-200 hover:border-gray-300 bg-[#faf9f5] text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🎪</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/60 px-1.5 py-0.5 rounded">
                Feria
              </span>
            </div>
            <div>
              <div className="font-bold text-xs">Inscripción Feria</div>
              <div className="text-[10px] text-gray-500 line-clamp-1">Feriantes & Artesanos</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => aplicarPreset('antena')}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              tipoPreset === 'antena'
                ? 'border-red-600 bg-red-50/80 text-red-950 shadow-xs ring-2 ring-red-500/30'
                : 'border-gray-200 hover:border-gray-300 bg-[#faf9f5] text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🛡️</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100/60 px-1.5 py-0.5 rounded">
                Alerta
              </span>
            </div>
            <div>
              <div className="font-bold text-xs">No a la Antena</div>
              <div className="text-[10px] text-gray-500 line-clamp-1">Campaña y Petitorio</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => aplicarPreset('libre')}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 col-span-2 sm:col-span-1 ${
              tipoPreset === 'libre'
                ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs ring-2 ring-blue-500/30'
                : 'border-gray-200 hover:border-gray-300 bg-[#faf9f5] text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">✍️</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                Libre
              </span>
            </div>
            <div>
              <div className="font-bold text-xs">Aviso Personalizado</div>
              <div className="text-[10px] text-gray-500 line-clamp-1">Redactar desde cero</div>
            </div>
          </button>

        </div>
      </div>

      {/* Si eligió noticia, selector dropdown de noticias */}
      {tipoPreset === 'noticia' && Array.isArray(noticias) && noticias.length > 0 && (
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-amber-900 uppercase">
            Seleccionar Noticia de El Diario Lunar:
          </label>
          <select
            value={noticiaSeleccionadaId}
            onChange={(e) => {
              setNoticiaSeleccionadaId(e.target.value);
              aplicarPreset('noticia', e.target.value);
            }}
            className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-serif font-bold text-gray-800"
          >
            {noticias.map((n) => (
              <option key={n.id} value={n.id}>
                {n.destacada ? '⭐ ' : ''}[{n.seccion || 'Nota'}] {n.titulo}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Panel Principal Dividido: Editor a la Izquierda, Preview a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* COLUMNA IZQUIERDA: Formulario de Edición (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              2. Personalizá el mensaje:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-400 mr-1">Emojis rápidos:</span>
              {['🌙', '☀️', '🌿', '📍', '🗓️', '✨', '🔗', '📢'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => insertarEmoji(em)}
                  className="hover:scale-125 transition-transform text-sm p-0.5"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Título del Post</label>
            <input
              type="text"
              value={formPost.titulo || ''}
              onChange={(e) => setFormPost({ ...formPost, titulo: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
              placeholder="Título atractivo..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
              Cuerpo del Mensaje (formato WhatsApp con *negritas*)
            </label>
            <textarea
              rows={8}
              value={formPost.contenido || ''}
              onChange={(e) => setFormPost({ ...formPost, contenido: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 text-xs font-mono leading-relaxed resize-y"
              placeholder="Escribí el texto completo..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Enlace de Destino (Link)</label>
              <input
                type="text"
                value={formPost.urlDestino || ''}
                onChange={(e) => setFormPost({ ...formPost, urlDestino: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                placeholder="https://lomaverdelunar.online/..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Hashtags (#)</label>
              <input
                type="text"
                value={formPost.tags || ''}
                onChange={(e) => setFormPost({ ...formPost, tags: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                placeholder="#LomaVerde, #Comunidad..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Imagen / Foto Asociada</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formPost.imagenUrl || ''}
                onChange={(e) => setFormPost({ ...formPost, imagenUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                placeholder="/loma-verde-callecita-opt.jpg o URL externa..."
              />
              <button
                type="button"
                onClick={() => setFormPost({ ...formPost, imagenUrl: '/loma-verde-callecita-opt.jpg' })}
                className="bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap"
                title="Usar foto real de Loma Verde"
              >
                Foto Loma Verde
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#faf9f5] border border-gray-200 rounded-xl flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formPost.fijarEnMuro || false}
                onChange={(e) => setFormPost({ ...formPost, fijarEnMuro: e.target.checked })}
                className="w-4 h-4 rounded text-loma-green focus:ring-loma-green"
              />
              <span>📌 Fijar en la parte superior si se publica en el Muro Web</span>
            </label>
          </div>
        </div>

        {/* COLUMNA DERECHA: Vista Previa y Botones de Envío (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. Vista Previa en Vivo:
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setVistaPreviaTab('wa')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    vistaPreviaTab === 'wa' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setVistaPreviaTab('ig')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    vistaPreviaTab === 'ig' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setVistaPreviaTab('muro')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    vistaPreviaTab === 'muro' ? 'bg-amber-700 text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Muro Web
                </button>
              </div>
            </div>

            {/* Pantalla de Previsualización según canal */}
            {vistaPreviaTab === 'wa' && (
              <div className="bg-[#e5ddd5] p-3.5 sm:p-4 rounded-2xl border border-gray-300 shadow-inner min-h-[300px] flex flex-col justify-end">
                <div className="bg-[#dcf8c6] p-3 rounded-xl shadow-xs text-xs text-stone-900 space-y-2 max-w-sm self-end rounded-tr-none">
                  <div className="font-bold text-[11px] text-emerald-800 flex items-center justify-between border-b border-emerald-200/50 pb-1">
                    <span>Loma Verde Lunar</span>
                    <span className="text-[9px] text-stone-400">Hoy</span>
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                    {formPost.contenido}
                  </div>
                  {formPost.tags && (
                    <div className="text-[10px] text-emerald-700 font-medium">
                      {formPost.tags}
                    </div>
                  )}
                  <div className="text-[9px] text-stone-400 text-right flex items-center justify-end gap-1">
                    <span>12:00</span>
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                  </div>
                </div>
              </div>
            )}

            {vistaPreviaTab === 'ig' && (
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 text-white min-h-[300px] space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center font-bold text-[10px]">
                      🌙
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-xs leading-none">lomaverdelunar</div>
                    <div className="text-[10px] text-stone-400">Loma Verde, Escobar</div>
                  </div>
                </div>

                {formPost.imagenUrl && (
                  <img
                    src={formPost.imagenUrl}
                    alt="Preview"
                    className="w-full h-44 object-cover rounded-xl border border-stone-800"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}

                <div className="text-xs space-y-1.5 leading-relaxed">
                  <div className="font-bold text-stone-200">{formPost.titulo}</div>
                  <p className="text-stone-300 line-clamp-4 text-[11px] whitespace-pre-wrap">
                    {(formPost.contenido || '').replace(/\*/g, '')}
                  </p>
                  <div className="text-[10px] text-blue-400 font-medium pt-1">
                    {formPost.tags}
                  </div>
                </div>
              </div>
            )}

            {vistaPreviaTab === 'muro' && (
              <div className="p-4 rounded-2xl border border-loma-wood/30 bg-[#faf9f5] shadow-xs space-y-3 min-h-[300px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {formPost.redOrigen}
                  </span>
                  <span className="text-[10px] text-gray-400">Muro Comunitario</span>
                </div>
                <h4 className="font-serif font-bold text-base text-loma-green">
                  {formPost.titulo}
                </h4>
                {formPost.imagenUrl && (
                  <img
                    src={formPost.imagenUrl}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-xl border border-gray-200"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {(formPost.contenido || '').replace(/\*/g, '')}
                </p>
                <div className="text-[10px] text-loma-wood font-bold">
                  {formPost.tags}
                </div>
              </div>
            )}
          </div>

          {/* 4. BOTONERA DE ACCIÓN MULTICANAL */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              4. Compartir con 1 clic:
            </span>

            {/* Fila 1: Botón Supremo: Muro Comunitario Web */}
            <button
              type="button"
              onClick={handlePublicarEnMuro}
              disabled={publicandoEnMuro}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 ${
                muroPublicadoExito
                  ? 'bg-emerald-700 text-white'
                  : 'bg-loma-green hover:bg-loma-wood text-white'
              }`}
            >
              {publicandoEnMuro ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publicando en el Muro Web...</span>
                </>
              ) : muroPublicadoExito ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Publicado con Éxito en el Muro de la Web!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publicar en el Muro Comunitario Web</span>
                </>
              )}
            </button>

            {/* TARJETA DE PUBLICACIÓN DIRECTA EN INSTAGRAM */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-pink-950/50 to-amber-950/50 border-2 border-pink-500/60 shadow-md space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-pink-400" />
                  <span>Instagram • Publicación Directa</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowInstagramModal(true)}
                  className="text-[11px] font-bold text-stone-200 hover:text-white flex items-center gap-1.5 bg-stone-900/90 hover:bg-stone-800 px-2.5 py-1 rounded-lg border border-pink-400/40 transition-colors shadow-2xs cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-pink-300" />
                  <span>{igStatus.connected ? `🟢 ${igStatus.userName || '@lomaverdelunar'}` : '⚙️ Conectar Cuenta'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePublicarDirectoInstagram}
                disabled={publicandoEnInstagram}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:via-pink-500 hover:to-amber-500 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {publicandoEnInstagram ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publicando en Instagram...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>{igStatus.connected ? 'Publicar Directo en Feed de Instagram 🚀' : 'Conectar Cuenta y Publicar en Instagram 🚀'}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-stone-300 leading-tight">
                {igStatus.connected 
                  ? `Postea automáticamente foto y epígrafe en el feed de ${igStatus.userName || '@lomaverdelunar'}.` 
                  : 'Hacé clic para conectar tu cuenta con Make.com/Zapier o Meta Graph API y postear en 1 clic.'}
              </p>

              {instagramResultado && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  instagramResultado.success 
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/70' 
                    : 'bg-rose-950/90 text-rose-200 border-rose-500/70'
                }`}>
                  {instagramResultado.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span className="flex-1 font-medium">{instagramResultado.mensaje}</span>
                  <button type="button" onClick={() => setInstagramResultado(null)} className="text-stone-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Fila 2: WhatsApp & Instagram */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCompartirWhatsApp}
                className="bg-[#25d366] hover:bg-[#1ebd58] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir en WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopiarWhatsApp}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedKey === 'wa' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡Copiado para WA!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-600" />
                    <span>Copiar texto WA</span>
                  </>
                )}
              </button>
            </div>

            {/* Fila 3: Instagram Copy & Placa Visual */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopiarInstagram}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                {copiedKey === 'ig' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>¡Copiado para IG!</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Copiar para Instagram</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDescargarPlacaVisual}
                className="bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                title="Genera una placa gráfica cuadrada 1080x1080 para subir como foto a Instagram o estado de WhatsApp"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Placa JPG</span>
              </button>
            </div>

            {/* Fila 4: Redes Secundarias (Facebook / Telegram) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCompartirFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={handleCompartirTelegram}
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Canvas Oculto para renderizado de placas gráficas (1080x1080) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

    </div>
  );
}
