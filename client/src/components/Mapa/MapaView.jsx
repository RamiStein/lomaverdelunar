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
  RefreshCw 
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

export default function MapaView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('mapa'); // 'mapa' o 'lista'
  
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

    // Capa de mapa cálida y estética (CartoDB Voyager / OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

  // Renderizar Marcadores / Pines Personalizados
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    const filtrados = puntos
      .filter(p => selectedCategoria === 'todos' || p.categoria === selectedCategoria)
      .filter(p => !searchQuery || p.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) || p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) || p.calles?.toLowerCase().includes(searchQuery.toLowerCase()));

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
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
  }, [puntos, selectedCategoria, searchQuery]);

  // Centrar en Loma Verde
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(LOMA_VERDE_COORDS, 14, { animate: true });
    }
  };

  // Geolocalizar usuario
  const handleGeolocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = [pos.coords.latitude, pos.coords.longitude];
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(userCoords, 16, { animate: true });
            L.circleMarker(userCoords, {
              radius: 8,
              fillColor: '#3b82f6',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            }).addTo(mapInstanceRef.current).bindPopup('📍 Tu ubicación actual').openPopup();
          }
        },
        (err) => {
          alert('No pudimos acceder a tu ubicación GPS. Puedes tocar directamente en el mapa.');
        }
      );
    }
  };

  const filtrados = puntos
    .filter(p => selectedCategoria === 'todos' || p.categoria === selectedCategoria)
    .filter(p => !searchQuery || p.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) || p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) || p.calles?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      
      {/* Barra Superior de Control y Filtros */}
      <div className="bg-white/95 backdrop-blur-md border-b border-loma-green/30 p-3 sm:p-4 shadow-sm z-30 sticky top-16">
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
                  {filtrados.length} reportes activos en la comunidad
                </span>
              </div>
            </div>

            {/* Toggle Mapa / Lista */}
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
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por calle, aviso, mascota..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-300 text-xs bg-[#faf9f5] focus:outline-none focus:border-loma-accent"
              />
            </div>

            <button
              onClick={() => {
                setClickToReportMode(true);
                setViewMode('mapa');
              }}
              className="bg-loma-green hover:bg-loma-wood text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Reportar Situación</span>
              <span className="sm:hidden">Reportar</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Categorías */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-2.5 no-scrollbar">
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
        <div className="bg-amber-500 text-white text-xs font-bold p-2.5 text-center shadow-md animate-bounce z-20 flex items-center justify-center gap-2">
          <span>📍 Haz clic en cualquier calle o punto del mapa para ubicar tu reporte</span>
          <button
            onClick={() => setClickToReportMode(false)}
            className="bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded text-[10px] uppercase ml-2"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Contenedor Principal: Mapa vs Vista Lista */}
      <div className="flex-1 relative">
        
        {/* VISTA MAPA */}
        <div 
          ref={mapContainerRef} 
          className={`w-full h-[calc(100vh-10rem)] ${viewMode === 'lista' ? 'hidden sm:block' : 'block'}`}
          style={{ minHeight: '500px' }}
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
            <MapPin className="w-5 h-5 text-loma-accent" />
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
            setPuntos([nuevo, ...puntos]);
            setSelectedPunto(nuevo);
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
