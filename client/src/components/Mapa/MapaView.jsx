import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Compass, 
  List, 
  Map as MapIcon, 
  MessageCircle, 
  AlertTriangle, 
  Sparkles, 
  Heart, 
  Bell, 
  Wrench, 
  Sprout, 
  RefreshCw,
  X,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import ReportModal from './ReportModal';
import PuntoDetalleDrawer from './PuntoDetalleDrawer';

const LOMA_VERDE_COORDS = [-34.3547, -58.8258];

const CATEGORIAS_CONFIG = [
  { id: 'todos', label: 'Todos', emoji: '🌕' },
  { id: 'aviso', label: 'Avisos', emoji: '📣', color: '#c48c26' },
  { id: 'alerta', label: 'Alertas', emoji: '🚨', color: '#dc2626' },
  { id: 'mascota', label: 'Mascotas', emoji: '🐾', color: '#d97706' },
  { id: 'huerta', label: 'Huerta', emoji: '🌿', color: '#2b5329' },
  { id: 'oficio', label: 'Oficios', emoji: '🛠️', color: '#0284c7' },
  { id: 'cultura', label: 'Cultura', emoji: '💫', color: '#7c3aed' },
];

// Base de datos local de calles, esquinas y lugares de Loma Verde y alrededores
const LOMA_VERDE_STREETS = [
  { name: 'Botafogo y Old Man', lat: -34.3512, lng: -58.8235, tipo: 'Esquina / Calle' },
  { name: 'Old Man y Timbó', lat: -34.3490, lng: -58.8210, tipo: 'Calle' },
  { name: 'Old Man y Camino del Sol', lat: -34.3555, lng: -58.8260, tipo: 'Calle' },
  { name: 'Plaza La Misión (Nigromante y La Misión)', lat: -34.3547, lng: -58.8258, tipo: 'Plaza Principal' },
  { name: 'Calle Los Fresnos y Las Rosas', lat: -34.3525, lng: -58.8290, tipo: 'Calle' },
  { name: 'Calle Los Cerros y Colectora Este', lat: -34.3570, lng: -58.8220, tipo: 'Calle / Colectora' },
  { name: 'Arturo Boote y Colectora Este (Acceso Loma Verde)', lat: -34.3590, lng: -58.8180, tipo: 'Acceso Principal' },
  { name: 'Calle Timbó y Málaga', lat: -34.3485, lng: -58.8195, tipo: 'Calle' },
  { name: 'Calle Yatasto y La Misión', lat: -34.3470, lng: -58.8160, tipo: 'Calle' },
  { name: 'Avenida de los Inmigrantes', lat: -34.3565, lng: -58.8140, tipo: 'Avenida' },
  { name: 'Calle Saavedra y Matheu', lat: -34.3580, lng: -58.8310, tipo: 'Calle' },
  { name: 'Calle Mineral y Timbó', lat: -34.3460, lng: -58.8220, tipo: 'Calle' },
  { name: 'Colectora Oeste y Ruta 9', lat: -34.3530, lng: -58.8160, tipo: 'Autopista / Colectora' },
  { name: 'Barrio Haras Santa María', lat: -34.3420, lng: -58.8280, tipo: 'Barrio' },
  { name: 'Barrio San Sebastián', lat: -34.3350, lng: -58.8450, tipo: 'Barrio' },
  { name: 'Matheu (Centro y Estación)', lat: -34.3800, lng: -58.8300, tipo: 'Localidad' },
  { name: 'Escobar Centro (Plaza San Martín)', lat: -34.3480, lng: -58.7980, tipo: 'Centro' },
];

export default function MapaView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const searchMarkerRef = useRef(null);

  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [viewMode, setViewMode] = useState('mapa'); // 'mapa' o 'lista'
  const [toastMessage, setToastMessage] = useState(null);
  
  // Modals & Drawers
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [newReportCoords, setNewReportCoords] = useState(null);
  const [clickToReportMode, setClickToReportMode] = useState(false);

  // Cargar puntos del servidor
  const fetchPuntos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mapa/puntos');
      const data = await res.json();
      setPuntos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando puntos del mapa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuntos();
  }, []);

  // Inicializar Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: LOMA_VERDE_COORDS,
      zoom: 14,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false
    });

    // Capa de mapa OpenStreetMap (100% libre, sin API key, con todas las calles de Loma Verde)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Controles de zoom abajo a la derecha
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Evento clic en el mapa para reportar
    map.on('click', (e) => {
      setNewReportCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      setClickToReportMode(false);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Motor de Búsqueda y Autocompletado Inteligente
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();

    // 1. Coincidencias en base local de calles de Loma Verde
    const localMatches = LOMA_VERDE_STREETS.filter(s => 
      s.name.toLowerCase().includes(q) || q.split(' ').every(part => s.name.toLowerCase().includes(part))
    ).map(s => ({
      id: 'local-' + s.name,
      titulo: s.name,
      subtitulo: s.tipo + ' • Loma Verde, Escobar',
      lat: s.lat,
      lng: s.lng,
      isAddress: true
    }));

    // 2. Coincidencias en reportes publicados
    const reportMatches = puntos.filter(p => 
      p.titulo?.toLowerCase().includes(q) || 
      p.descripcion?.toLowerCase().includes(q) || 
      p.calles?.toLowerCase().includes(q)
    ).map(p => ({
      id: 'rep-' + p.id,
      titulo: p.titulo,
      subtitulo: `${p.emoji} ${p.categoriaLabel || p.categoria} • ${p.calles || 'Loma Verde'}`,
      lat: p.lat,
      lng: p.lng,
      punto: p,
      isAddress: false
    }));

    setSearchResults([...localMatches, ...reportMatches]);

    // 3. Consulta Online a Nominatim Geocoder con debounce
    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const queryTerm = encodeURIComponent(`${searchQuery}, Loma Verde, Escobar, Buenos Aires`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${queryTerm}&limit=4&addressdetails=1`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const osmMatches = data.map(item => ({
            id: 'osm-' + item.place_id,
            titulo: item.display_name.split(',')[0],
            subtitulo: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            isAddress: true
          }));

          setSearchResults(prev => {
            const ids = new Set(prev.map(r => r.id));
            const fresh = osmMatches.filter(o => !ids.has(o.id));
            return [...prev, ...fresh];
          });
        }
      } catch (err) {
        console.error('Error en geocodificación online:', err);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, puntos]);

  // Renderizar Marcadores / Pines de Reportes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    const filtrados = puntos.filter(p => 
      selectedCategoria === 'todos' || p.categoria === selectedCategoria
    );

    filtrados.forEach((p) => {
      if (!p.lat || !p.lng) return;

      const emoji = p.emoji || '📍';
      const color = p.color || '#2b5329';
      const isResuelto = p.resuelto;

      const customIcon = L.divIcon({
        className: 'custom-loma-pin',
        html: `
          <div style="
            background: ${isResuelto ? '#10b981' : color};
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            border: 2px solid white;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 18px;
              line-height: 1;
              display: block;
            ">${emoji}</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([p.lat, p.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPunto(p);
      });

      // Tooltip informativo al pasar el mouse
      marker.bindTooltip(`<strong>${p.titulo}</strong><br><small>${p.calles || 'Loma Verde'}</small>`, {
        direction: 'top',
        offset: [0, -36]
      });

      markersGroup.addLayer(marker);
    });
  }, [puntos, selectedCategoria]);

  // Seleccionar resultado de búsqueda y navegar
  const handleSelectSearchResult = (res) => {
    if (!mapInstanceRef.current) return;

    // Si es un reporte existente, abrirlo
    if (res.punto) {
      setSelectedPunto(res.punto);
    }

    // Volar hacia la ubicación seleccionada
    mapInstanceRef.current.flyTo([res.lat, res.lng], 16, { duration: 1.2 });

    // Colocar pin temporal de destino si es una dirección/calle
    if (res.isAddress) {
      if (searchMarkerRef.current) {
        mapInstanceRef.current.removeLayer(searchMarkerRef.current);
      }

      const searchIcon = L.divIcon({
        className: 'search-target-pin',
        html: `
          <div style="
            background: #ef4444;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.3);
            border: 3px solid white;
            cursor: pointer;
            animation: pulse 1.5s infinite;
          ">
            <span style="font-size: 16px;">📍</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const targetMarker = L.marker([res.lat, res.lng], { icon: searchIcon }).addTo(mapInstanceRef.current);
      targetMarker.bindPopup(`
        <div style="font-family: sans-serif; text-align: center; padding: 4px;">
          <strong style="color: #2b5329; font-size: 13px;">${res.titulo}</strong><br>
          <span style="font-size: 11px; color: #666;">Ubicación en Loma Verde</span><br>
          <button id="btn-report-here" style="
            margin-top: 6px;
            background: #2b5329;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">📍 Reportar aquí</button>
        </div>
      `).openPopup();

      // Permitir reportar con un clic en el popup
      setTimeout(() => {
        const btn = document.getElementById('btn-report-here');
        if (btn) {
          btn.onclick = () => {
            setNewReportCoords({ lat: res.lat, lng: res.lng });
          };
        }
      }, 200);

      searchMarkerRef.current = targetMarker;
    }

    setSearchResults([]);
  };

  // Centrar en Loma Verde
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(LOMA_VERDE_COORDS, 14, { duration: 1 });
    }
  };

  // Geolocalizar usuario
  const handleGeolocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = [pos.coords.latitude, pos.coords.longitude];
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(userCoords, 16, { duration: 1.2 });
            L.circleMarker(userCoords, {
              radius: 9,
              fillColor: '#3b82f6',
              color: '#ffffff',
              weight: 3,
              opacity: 1,
              fillOpacity: 0.85
            }).addTo(mapInstanceRef.current).bindPopup('📍 Tu ubicación actual').openPopup();
          }
        },
        (err) => {
          alert('No pudimos acceder a tu ubicación GPS. Puedes tocar directamente en el mapa.');
        }
      );
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filtrados = puntos.filter(p => 
    selectedCategoria === 'todos' || p.categoria === selectedCategoria
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col bg-[#faf9f5]">
      
      {/* Toast de Confirmación */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-loma-green text-white px-5 py-2.5 rounded-2xl shadow-2xl z-[10000] text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. BARRA SUPERIOR DE CONTROL, BÚSQUEDA Y FILTROS          */}
      {/* ========================================================= */}
      <div className="relative z-30 bg-white border-b border-loma-wood/30 shadow-xs px-3 sm:px-6 py-3 space-y-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Título & Conteo */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-loma-green leading-none">
                  Mapa Vecinal de Loma Verde
                </h1>
                <span className="text-[11px] text-loma-wood font-semibold">
                  {puntos.length} reportes activos en la comunidad
                </span>
              </div>
            </div>

            {/* Toggle Mapa / Lista (Mobile) */}
            <div className="flex bg-gray-100 p-1 rounded-xl sm:hidden">
              <button
                onClick={() => setViewMode('mapa')}
                className={`p-1.5 rounded-lg text-xs font-bold ${viewMode === 'mapa' ? 'bg-white text-loma-green shadow-xs' : 'text-gray-500'}`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('lista')}
                className={`p-1.5 rounded-lg text-xs font-bold ${viewMode === 'lista' ? 'bg-white text-loma-green shadow-xs' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Buscador y Botón Reportar */}
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar calle (ej: Botafogo, Los Fresnos) o reporte..."
                className="w-full pl-8 pr-7 py-2.5 rounded-xl border border-gray-300 text-xs bg-[#faf9f5] focus:outline-none focus:border-loma-accent shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* DROPDOWN DE RESULTADOS / AUTOCOMPLETADO */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-gray-100 text-xs">
                  <div className="p-2 bg-gray-50 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex justify-between items-center">
                    <span>Sugerencias en Loma Verde ({searchResults.length})</span>
                    {isSearchingOnline && <span className="text-amber-600 animate-pulse">Buscando...</span>}
                  </div>
                  {searchResults.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectSearchResult(res)}
                      className="p-3 hover:bg-emerald-50/70 cursor-pointer transition-colors flex items-start gap-2.5 text-left"
                    >
                      <span className="text-base shrink-0 mt-0.5">
                        {res.isAddress ? '📍' : (res.punto?.emoji || '📌')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <strong className="text-loma-green block truncate">{res.titulo}</strong>
                        <span className="text-[11px] text-gray-500 block truncate">{res.subtitulo}</span>
                      </div>
                      <span className="text-[10px] font-bold text-loma-accent uppercase shrink-0 pt-0.5">
                        Ir al mapa →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setClickToReportMode(true);
                setViewMode('mapa');
              }}
              className="bg-loma-green hover:bg-loma-wood text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Reportar Situación</span>
              <span className="sm:hidden">Reportar</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Categorías con Contadores */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          {CATEGORIAS_CONFIG.map((cat) => {
            const isSelected = selectedCategoria === cat.id;
            const count = cat.id === 'todos' 
              ? puntos.length 
              : puntos.filter(p => p.categoria === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoria(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-loma-green text-white shadow-xs'
                    : 'bg-[#faf9f5] text-gray-700 border border-gray-200 hover:border-loma-wood/40'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner de Ayuda: Modo Clic para Reportar Activo */}
      {clickToReportMode && (
        <div className="bg-amber-500 text-white text-xs font-bold p-3 text-center shadow-md animate-bounce z-20 flex items-center justify-center gap-2">
          <span>📍 Haz clic en cualquier calle o punto del mapa para ubicar tu reporte</span>
          <button
            onClick={() => setClickToReportMode(false)}
            className="bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-lg text-[10px] uppercase ml-2 font-black"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CONTENEDOR PRINCIPAL: MAPA LEAFLET vs VISTA LISTA      */}
      {/* ========================================================= */}
      <div className="flex-1 relative z-10">
        
        {/* VISTA MAPA */}
        <div 
          ref={mapContainerRef} 
          className={`w-full h-[calc(100vh-12rem)] ${viewMode === 'lista' ? 'hidden sm:block' : 'block'}`}
          style={{ minHeight: '520px', zIndex: 1 }}
        />

        {/* Botones Flotantes sobre el Mapa */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={handleRecenter}
            className="p-2.5 bg-white text-loma-green rounded-xl shadow-lg border border-gray-200 hover:bg-loma-bg transition-all"
            title="Centrar en Plaza La Misión (Loma Verde)"
          >
            <Compass className="w-5 h-5 text-loma-green" />
          </button>

          <button
            onClick={handleGeolocate}
            className="p-2.5 bg-white text-loma-accent rounded-xl shadow-lg border border-gray-200 hover:bg-loma-bg transition-all"
            title="Mi ubicación actual GPS"
          >
            <Navigation className="w-5 h-5 text-loma-accent" />
          </button>

          <button
            onClick={fetchPuntos}
            className="p-2.5 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200 hover:bg-loma-bg transition-all"
            title="Recargar reportes"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* VISTA LISTA (Para móviles o lista rápida) */}
        {viewMode === 'lista' && (
          <div className="sm:hidden p-4 space-y-3 bg-loma-bg min-h-[500px]">
            {filtrados.length > 0 ? (
              filtrados.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPunto(p)}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs cursor-pointer active:scale-98 transition-transform"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-loma-wood uppercase flex items-center gap-1">
                      <span>{p.emoji}</span>
                      <span>{p.categoriaLabel || p.categoria}</span>
                    </span>
                    {p.resuelto ? (
                      <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        ✓ Resuelto
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        En curso
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-loma-green mb-1">{p.titulo}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{p.descripcion}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-loma-accent" />
                      <span>{p.calles || 'Loma Verde'}</span>
                    </span>
                    <span className="font-semibold text-loma-green">
                      💬 {(p.comentarios || []).length} comentarios
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-12">
                No hay reportes para los filtros seleccionados.
              </p>
            )}
          </div>
        )}

      </div>

      {/* Modal Nuevo Reporte */}
      {newReportCoords && (
        <ReportModal
          lat={newReportCoords.lat}
          lng={newReportCoords.lng}
          onClose={() => setNewReportCoords(null)}
          onSuccess={(nuevo) => {
            const freshPunto = {
              ...nuevo,
              lat: Number(nuevo.lat) || newReportCoords.lat,
              lng: Number(nuevo.lng) || newReportCoords.lng,
              createdAt: nuevo.createdAt || new Date().toISOString()
            };
            setPuntos(prev => [freshPunto, ...prev.filter(p => p.id !== freshPunto.id)]);
            setSelectedPunto(freshPunto);
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([freshPunto.lat, freshPunto.lng], 16, { duration: 1 });
            }
            showToast('¡Reporte publicado exitosamente en el mapa!');
            fetchPuntos();
          }}
        />
      )}

      {/* Drawer / Detalle del Punto con Hilo de Comentarios */}
      {selectedPunto && (
        <PuntoDetalleDrawer
          punto={selectedPunto}
          onClose={() => setSelectedPunto(null)}
          onUpdatePunto={(updated) => {
            setPuntos(puntos.map(p => p.id === updated.id ? updated : p));
            setSelectedPunto(updated);
          }}
        />
      )}

    </div>
  );
}
