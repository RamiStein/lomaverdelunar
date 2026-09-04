import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  Coins, 
  Vote, 
  Receipt, 
  Settings, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  MessageCircle, 
  Search, 
  Edit2, 
  RefreshCw,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function CRMDashboard({ adminKey, onLogout, refreshGlobalData }) {
  const [crmTab, setCrmTab] = useState('resumen'); // 'resumen', 'feriantes', 'voluntarios', 'troqueles', 'votos', 'finanzas', 'config'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    dashboard: null,
    feriantes: [],
    voluntarios: [],
    vouchers: [],
    intercambios: [],
    votos: [],
    virtudes: [],
    contabilidad: { gastos: [], totalGastado: 0 },
    config: null,
    noticias: [],
    puntosMapa: []
  });

  // Filters & State
  const [selectedLuna, setSelectedLuna] = useState('todas');
  const [ferianteFilter, setFerianteFilter] = useState('todos');
  const [ferianteSearch, setFerianteSearch] = useState('');
  const [editingFeriante, setEditingFeriante] = useState(null);
  const [showAddFerianteModal, setShowAddFerianteModal] = useState(false);
  const [newFerianteForm, setNewFerianteForm] = useState({
    nombre: '',
    nombrePersonal: '',
    contacto: '',
    tipo: 'Artesanías',
    descripcion: '',
    instagram: '',
    lunaId: 'Luna Piscis',
    puestoAsignado: ''
  });

  // New Expense form
  const [newGasto, setNewGasto] = useState({ detalle: '', monto: '', categoria: 'General', comprobante: '' });
  
  // New Noticia form
  const [newNoticia, setNewNoticia] = useState({ titulo: '', texto: '', img: '' });

  // Config form
  const [configForm, setConfigForm] = useState(null);

  // Fetch all CRM data
  const fetchAllData = async () => {
    setLoading(true);
    const headers = { 'x-admin-key': adminKey };

    try {
      const [
        dashRes,
        ferRes,
        volRes,
        vouchRes,
        intRes,
        votoRes,
        virtRes,
        contRes,
        confRes,
        notRes,
        mapaRes,
        papeleraRes
      ] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }).then(r => r.json()),
        fetch('/api/admin/feriantes', { headers }).then(r => r.json()),
        fetch('/api/admin/voluntarios', { headers }).then(r => r.json()),
        fetch('/api/admin/vouchers', { headers }).then(r => r.json()),
        fetch('/api/admin/intercambios', { headers }).then(r => r.json()),
        fetch('/api/admin/votos', { headers }).then(r => r.json()),
        fetch('/api/virtudes').then(r => r.json()),
        fetch('/api/contabilidad').then(r => r.json()),
        fetch('/api/config').then(r => r.json()),
        fetch('/api/noticias').then(r => r.json()),
        fetch('/api/mapa/puntos').then(r => r.json()),
        fetch('/api/admin/feriantes/papelera', { headers }).then(r => r.json())
      ]);

      setData({
        dashboard: dashRes,
        feriantes: ferRes || [],
        voluntarios: volRes || [],
        vouchers: vouchRes || [],
        intercambios: intRes || [],
        votos: votoRes || [],
        virtudes: virtRes || [],
        contabilidad: contRes || { gastos: [], totalGastado: 0 },
        config: confRes || {},
        noticias: notRes || [],
        puntosMapa: Array.isArray(mapaRes) ? mapaRes : [],
        papeleraFeriantes: Array.isArray(papeleraRes) ? papeleraRes : []
      });

      if (!configForm && confRes) {
        setConfigForm(confRes);
      }
    } catch (err) {
      console.error('Error fetching CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [adminKey]);

  // Export Excel
  const handleExportExcel = () => {
    window.location.href = `/api/admin/export-excel?adminKey=${adminKey}`;
  };

  // --- ACTIONS: FERIANTES ---
  const handleUpdateFeriante = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/feriantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Error al actualizar feriante.');
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
      setEditingFeriante(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateFeriante = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/feriantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          ...newFerianteForm,
          lunaId: newFerianteForm.lunaId || data.config?.lunaActiva || 'Luna Piscis',
          origen: newFerianteForm.lunaId || data.config?.lunaActiva || 'Luna Piscis'
        })
      });
      if (!res.ok) throw new Error('Error al registrar feriante.');
      alert('¡Feriante registrado con éxito!');
      setShowAddFerianteModal(false);
      setNewFerianteForm({
        nombre: '',
        nombrePersonal: '',
        contacto: '',
        tipo: 'Artesanías',
        descripcion: '',
        instagram: '',
        lunaId: data.config?.lunaActiva || 'Luna Piscis',
        puestoAsignado: ''
      });
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFeriante = async (id) => {
    if (!confirm('¿Mover a la Papelera de Reciclaje? Podrás recuperarlo con un clic en cualquier momento.')) return;
    try {
      await fetch(`/api/admin/feriantes/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      alert('Feriante movido a la Papelera de Reciclaje.');
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestoreFeriante = async (id) => {
    try {
      const res = await fetch(`/api/admin/feriantes/${id}/restaurar`, {
        method: 'PUT',
        headers: { 'x-admin-key': adminKey }
      });
      if (!res.ok) throw new Error('Error al restaurar feriante');
      alert('¡Feriante restaurado exitosamente a la lista activa!');
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFerianteDefinitivo = async (id) => {
    if (!confirm('¿Eliminar DEFINITIVAMENTE este registro? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/admin/feriantes/${id}/definitivo`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      alert('Registro eliminado definitivamente.');
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const sendWhatsAppConfirmation = (f) => {
    if (!f.contacto) return;
    let clean = f.contacto.replace(/[^0-9]/g, '');
    if (clean.length >= 10 && !clean.startsWith('54')) clean = '549' + clean;
    const msg = encodeURIComponent(
      `¡Hola ${f.nombrePersonal || f.nombre}! 🌿 Te confirmamos desde la coordinación del Encuentro Lunar de Loma Verde ♒ que tu propuesta "${f.nombre}" ha sido APROBADA. Tu ubicación asignada en la plaza es: ${f.puestoAsignado || 'Sector General'}. ¡Nos vemos en la plaza!`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  // --- ACTIONS: VOLUNTARIOS ---
  const handleToggleContactado = async (vol) => {
    try {
      await fetch(`/api/admin/voluntarios/${vol.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ contactado: !vol.contactado })
      });
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- ACTIONS: FINANZAS ---
  const handleAddGasto = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(newGasto)
      });
      setNewGasto({ detalle: '', monto: '', categoria: 'General', comprobante: '' });
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGasto = async (id) => {
    if (!confirm('¿Eliminar comprobante?')) return;
    try {
      await fetch(`/api/admin/gastos/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- ACTIONS: CONFIGURACION ---
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(configForm)
      });
      alert('¡Configuración de Luna y Cartelera guardada con éxito!');
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNoticia = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(newNoticia)
      });
      setNewNoticia({ titulo: '', texto: '', img: '' });
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteNoticia = async (id) => {
    if (!confirm('¿Eliminar noticia?')) return;
    try {
      await fetch(`/api/admin/noticias/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      fetchAllData();
      if (refreshGlobalData) refreshGlobalData();
    } catch (err) {
      alert(err.message);
    }
  };

  const metricas = data.dashboard?.metricas || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Cabecera CRM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            🛡️
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
              Panel Administrativo
            </span>
            <h1 className="font-serif text-2xl font-bold text-loma-green">
              CRM Loma Verde Lunar 1320
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refrescar</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-all active:scale-95"
            title="Descargar toda la base en Excel"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Excel (.xlsx)</span>
          </button>

          <button
            onClick={onLogout}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
            title="Cerrar sesión Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Selector de Pestañas CRM */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">
        {[
          { id: 'resumen', label: '📊 Resumen & KPIs' },
          { id: 'mapa', label: `🗺️ Mapa Vecinal (${data.puntosMapa?.length || 0})` },
          { id: 'feriantes', label: `👥 Feriantes (${metricas.totalFeriantes || 0})` },
          { id: 'voluntarios', label: `🤝 Voluntarios (${metricas.totalVoluntarios || 0})` },
          { id: 'troqueles', label: `🎫 Troqueles & Mercado (${metricas.totalVouchers || 0})` },
          { id: 'votos', label: `🗳️ Votos (${metricas.totalVotosPresupuesto || 0})` },
          { id: 'finanzas', label: '💰 Finanzas & Gastos' },
          { id: 'config', label: '⚙️ Configuración Lunar' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCrmTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              crmTab === tab.id
                ? 'bg-loma-green text-white shadow-md'
                : 'bg-white text-loma-green border border-loma-wood/20 hover:bg-loma-bg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. PESTAÑA RESUMEN & KPIS */}
      {crmTab === 'resumen' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Tarjetas KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-loma-green/30 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Feriantes Inscriptos</span>
              <div className="font-serif text-3xl font-black text-loma-green">{metricas.totalFeriantes || 0}</div>
              <span className="text-[11px] text-loma-wood font-semibold">
                {metricas.feriantesAprobados || 0} aprobados • {metricas.feriantesPendientes || 0} pendientes
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-loma-accent/30 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Aportes por Troqueles</span>
              <div className="font-serif text-3xl font-black text-loma-accent">
                ${(metricas.totalAporteTroqueles || 0).toLocaleString('es-AR')}
              </div>
              <span className="text-[11px] text-amber-700 font-semibold">
                {metricas.totalVouchers || 0} troqueles emitidos
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-green-300 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Volumen Intercambiado</span>
              <div className="font-serif text-3xl font-black text-green-700">
                ${(metricas.totalIntercambiado || 0).toLocaleString('es-AR')}
              </div>
              <span className="text-[11px] text-gray-500">
                Circulante restante: ${(metricas.saldoTroquelesCirculante || 0).toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-red-300 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Gastos Comunitarios</span>
              <div className="font-serif text-3xl font-black text-red-600">
                ${(metricas.totalGastadoContabilidad || 0).toLocaleString('es-AR')}
              </div>
              <span className="text-[11px] text-gray-500">
                {data.contabilidad.gastos.length} comprobantes registrados
              </span>
            </div>
          </div>

          {/* Última Actividad: Feriantes e Intercambios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Últimos Intercambios en Vivo */}
            <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-loma-green mb-4 flex items-center justify-between">
                <span>Últimos Canjes de Virtudes (En Vivo)</span>
                <span className="text-xs font-bold text-loma-wood">{data.intercambios.length} canjes</span>
              </h3>

              {data.intercambios.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {data.intercambios.slice(0, 8).map((i) => (
                    <div key={i.id} className="bg-[#faf9f5] p-3 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                      <div>
                        <strong className="text-loma-green block">{i.virtudDescripcion}</strong>
                        <span className="text-gray-500">De: {i.oferente} • Por: {i.compradorNombre}</span>
                      </div>
                      <div className="text-right font-mono font-bold text-loma-accent text-sm">
                        ${i.valor.toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic text-center py-8">Aún no hay canjes registrados.</p>
              )}
            </div>

            {/* Últimos Votos de Presupuesto */}
            <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-loma-green mb-4 flex items-center justify-between">
                <span>Últimos Votos Vecinales</span>
                <span className="text-xs font-bold text-loma-wood">{data.votos.length} votos</span>
              </h3>

              {data.votos.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {data.votos.slice(0, 8).map((v) => (
                    <div key={v.id} className="bg-[#faf9f5] p-3 rounded-xl border border-gray-200 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-loma-green">{v.nombre} ({v.localidad})</strong>
                        <span className="text-[10px] text-gray-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-loma-wood font-semibold line-clamp-1">{v.opcion}</div>
                      <p className="text-gray-500 italic mt-1 line-clamp-1">"{v.justificacion}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic text-center py-8">Aún no hay votos registrados.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PESTAÑA CRM FERIANTES */}
      {/* ========================================================= */}
      {crmTab === 'feriantes' && (() => {
        const lunasBase = ['Luna Piscis', 'Luna Acuario', 'Luna Capricornio', 'Luna Sagitario', 'Luna Escorpio'];
        const lunasEnFeriantes = [...new Set((data.feriantes || []).map(f => f.lunaId || f.origen || '').flatMap(s => s.split(' / ').map(x => x.trim())).filter(Boolean))];
        const lunasDisponibles = Array.from(new Set([...lunasBase, ...lunasEnFeriantes]));

        const feriantesFiltrados = data.feriantes
          .filter((f) => selectedLuna === 'todas' || (f.lunaId || f.origen || '').includes(selectedLuna))
          .filter((f) => ferianteFilter === 'todos' || f.estado === ferianteFilter)
          .filter((f) => !ferianteSearch || f.nombre.toLowerCase().includes(ferianteSearch.toLowerCase()) || (f.nombrePersonal && f.nombrePersonal.toLowerCase().includes(ferianteSearch.toLowerCase())) || (f.tipo && f.tipo.toLowerCase().includes(ferianteSearch.toLowerCase())));

        return (
          <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6 animate-fadeIn">
            
            {/* Cabecera y Selector de Pestañas de Luna */}
            <div className="space-y-4 border-b border-gray-200 pb-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-loma-green flex items-center gap-2">
                    <span>Inscripciones y Feriantes por Ciclo Lunar</span>
                    <span className="text-xs bg-loma-accent/20 text-loma-accent font-extrabold px-2.5 py-0.5 rounded-full">
                      {data.feriantes.length} Total
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Separadas por pestañas de Luna histórica (igual que en el Excel oficial).
                  </p>
                </div>

                <button
                  onClick={() => setShowAddFerianteModal(true)}
                  className="bg-loma-green hover:bg-loma-wood text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Inscribir Feriante</span>
                </button>
              </div>

              {/* Pestañas de Lunas */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
                <button
                  onClick={() => setSelectedLuna('todas')}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    selectedLuna === 'todas'
                      ? 'bg-loma-green text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>🌕 Todas las Lunas</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${selectedLuna === 'todas' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {data.feriantes.length}
                  </span>
                </button>

                {lunasDisponibles.map((luna) => {
                  const count = data.feriantes.filter(f => (f.lunaId || f.origen || '').includes(luna)).length;
                  const isActiva = data.config?.lunaActiva === luna;
                  const icon = luna.includes('Piscis') ? '♓' : luna.includes('Acuario') ? '♒' : luna.includes('Capricornio') ? '♑' : luna.includes('Sagitario') ? '♐' : luna.includes('Escorpio') ? '♏' : '🌙';
                  
                  return (
                    <button
                      key={luna}
                      onClick={() => setSelectedLuna(luna)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        selectedLuna === luna
                          ? 'bg-loma-green text-white shadow-md'
                          : 'bg-white text-loma-green border border-loma-wood/20 hover:bg-loma-bg'
                      }`}
                    >
                      <span>{icon} {luna}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${selectedLuna === luna ? 'bg-white/20 text-white' : 'bg-loma-accent/15 text-loma-accent'}`}>
                        {count}
                      </span>
                      {isActiva && (
                        <span className="text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                          Actual
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Botón Papelera de Reciclaje */}
                <button
                  onClick={() => setSelectedLuna('papelera')}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    selectedLuna === 'papelera'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Papelera de Reciclaje</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${selectedLuna === 'papelera' ? 'bg-white/20 text-white' : 'bg-red-200 text-red-900'}`}>
                    {data.papeleraFeriantes?.length || 0}
                  </span>
                </button>
              </div>
            </div>

            {/* VISTA PAPELERA DE RECICLAJE */}
            {selectedLuna === 'papelera' ? (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <strong className="block text-sm">Papelera de Seguridad Anti-Pérdida de Datos</strong>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Los registros eliminados se guardan aquí. Puedes recuperarlos con 1 clic en "Restaurar" y volverán automáticamente a la lista activa.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-xs bg-amber-200 text-amber-950 px-3 py-1 rounded-xl shrink-0">
                    {data.papeleraFeriantes?.length || 0} en papelera
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-red-50 text-red-900 border-b border-red-200 font-bold">
                        <th className="p-3">Emprendimiento</th>
                        <th className="p-3">Responsable</th>
                        <th className="p-3">Contacto</th>
                        <th className="p-3">Ciclo Lunar</th>
                        <th className="p-3">Fecha Eliminado</th>
                        <th className="p-3 text-right">Recuperar / Eliminar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(data.papeleraFeriantes || []).length > 0 ? (
                        data.papeleraFeriantes.map((f) => (
                          <tr key={f.id} className="hover:bg-red-50/30">
                            <td className="p-3 font-bold text-gray-800">{f.nombre}</td>
                            <td className="p-3 text-gray-600">{f.nombrePersonal || '-'}</td>
                            <td className="p-3 font-mono text-gray-600">{f.contacto || f.telefono || '-'}</td>
                            <td className="p-3">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                                {f.lunaId || f.origen || 'General'}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] text-gray-400">
                              {f.eliminadoAt ? new Date(f.eliminadoAt).toLocaleString('es-AR') : 'Reciente'}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => handleRestoreFeriante(f.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[11px] shadow-xs inline-flex items-center gap-1 transition-all active:scale-95"
                                title="Recuperar feriante a la lista activa"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Restaurar</span>
                              </button>
                              <button
                                onClick={() => handleDeleteFerianteDefinitivo(f.id)}
                                className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold uppercase text-[11px] inline-flex items-center gap-1 transition-all"
                                title="Eliminar definitivamente"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Purgar</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                            La papelera de reciclaje está vacía. ¡Todos los datos están seguros y activos!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                {/* Controles de Filtrado secundario (Estado y Búsqueda) */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-400 uppercase mr-1">Estado:</span>
                    {['todos', 'pendiente', 'aprobado', 'confirmado'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFerianteFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                          ferianteFilter === st
                            ? 'bg-loma-wood text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ferianteSearch}
                      onChange={(e) => setFerianteSearch(e.target.value)}
                      placeholder="Buscar feriante, rubro o responsable..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-loma-accent"
                    />
                  </div>
                </div>

                {/* Resumen de la vista actual */}
                <div className="text-xs text-gray-500 font-semibold flex justify-between items-center">
                  <span>
                    Mostrando <strong>{feriantesFiltrados.length}</strong> feriantes en <strong>{selectedLuna === 'todas' ? 'Todas las Lunas' : selectedLuna}</strong>
                  </span>
                </div>

                {/* Tabla de Feriantes */}
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-loma-wood/10 text-loma-green border-b border-loma-wood/20 font-bold">
                    <th className="p-3">Emprendimiento</th>
                    <th className="p-3">Responsable</th>
                    <th className="p-3">Fecha Inscripción</th>
                    <th className="p-3">Rubro</th>
                    <th className="p-3">Ciclo Lunar</th>
                    <th className="p-3">Ubicación / Puesto</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feriantesFiltrados.length > 0 ? (
                    feriantesFiltrados.map((f) => (
                      <tr key={f.id} className="hover:bg-[#faf9f5] transition-colors">
                        <td className="p-3 font-bold text-loma-green">
                          <div>{f.nombre}</div>
                          {f.instagram && <span className="text-[10px] text-pink-600 font-semibold">{f.instagram}</span>}
                        </td>
                        <td className="p-3 text-gray-700 font-medium">
                          <div>{f.nombrePersonal || '-'}</div>
                          <span className="text-[10px] text-gray-400">{f.contacto || f.telefono}</span>
                        </td>
                        <td className="p-3 text-gray-600 whitespace-nowrap">
                          <div className="font-bold text-gray-800 text-[11px]">
                            {f.fechaInscripcionTexto ? f.fechaInscripcionTexto.split(',')[0] : (f.createdAt || f.fechaRegistro ? new Date(f.createdAt || f.fechaRegistro).toLocaleDateString('es-AR') : '-')}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {f.fechaInscripcionTexto && f.fechaInscripcionTexto.includes(',') 
                              ? f.fechaInscripcionTexto.split(',')[1] + ' hs'
                              : (f.createdAt || f.fechaRegistro ? new Date(f.createdAt || f.fechaRegistro).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs' : '')}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-loma-wood">{f.tipo || f.categoria}</td>
                        <td className="p-3">
                          <select
                            value={f.lunaId || f.origen?.split(' / ')[0] || data.config?.lunaActiva || 'Luna Piscis'}
                            onChange={(e) => handleUpdateFeriante(f.id, { lunaId: e.target.value, origen: e.target.value })}
                            className="text-[10px] font-bold rounded-lg px-2 py-1 border border-gray-300 bg-white text-loma-green cursor-pointer shadow-2xs"
                          >
                            {lunasDisponibles.map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            {f.puestoAsignado || 'Sin asignar'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={f.estado || 'aprobado'}
                            onChange={(e) => handleUpdateFeriante(f.id, { estado: e.target.value })}
                            className={`text-[10px] font-bold uppercase rounded px-2 py-1 border ${
                              f.estado === 'aprobado' || f.estado === 'confirmado'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : f.estado === 'pendiente'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="rechazado">Rechazado</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botón WhatsApp */}
                            {(f.contacto || f.telefono) && (
                              <button
                                onClick={() => sendWhatsAppConfirmation(f)}
                                className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-2xs"
                                title="Enviar mensaje de confirmación por WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Botón Asignar Puesto */}
                            <button
                              onClick={() => {
                                const nuevoPuesto = prompt('Asignar puesto en la plaza:', f.puestoAsignado || 'Sector A - Puesto 01');
                                if (nuevoPuesto !== null) {
                                  handleUpdateFeriante(f.id, { puestoAsignado: nuevoPuesto });
                                }
                              }}
                              className="p-1.5 bg-loma-wood hover:bg-loma-green text-white rounded-lg shadow-2xs"
                              title="Asignar puesto/ubicación"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Botón Eliminar */}
                            <button
                              onClick={() => handleDeleteFeriante(f.id)}
                              className="p-1.5 bg-gray-200 hover:bg-red-600 hover:text-white text-gray-600 rounded-lg transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400 italic">
                        No se encontraron inscripciones para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

            {/* Modal: Inscribir Feriante Manualmente */}
            {showAddFerianteModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-loma-green shadow-2xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-serif text-lg font-bold text-loma-green">
                      Inscribir Feriante Manualmente 🌿
                    </h3>
                    <button onClick={() => setShowAddFerianteModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateFeriante} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-loma-wood uppercase mb-1">Nombre del Emprendimiento *</label>
                      <input
                        type="text"
                        required
                        value={newFerianteForm.nombre}
                        onChange={(e) => setNewFerianteForm({ ...newFerianteForm, nombre: e.target.value })}
                        placeholder="Ej: Cerámica del Sol"
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-loma-wood uppercase mb-1">Nombre Responsable</label>
                        <input
                          type="text"
                          value={newFerianteForm.nombrePersonal}
                          onChange={(e) => setNewFerianteForm({ ...newFerianteForm, nombrePersonal: e.target.value })}
                          placeholder="Ej: Sofía"
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-loma-wood uppercase mb-1">WhatsApp / Contacto *</label>
                        <input
                          type="text"
                          required
                          value={newFerianteForm.contacto}
                          onChange={(e) => setNewFerianteForm({ ...newFerianteForm, contacto: e.target.value })}
                          placeholder="Ej: 1122334455"
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-loma-wood uppercase mb-1">Luna / Ciclo *</label>
                        <select
                          value={newFerianteForm.lunaId}
                          onChange={(e) => setNewFerianteForm({ ...newFerianteForm, lunaId: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                        >
                          {lunasDisponibles.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-loma-wood uppercase mb-1">Rubro / Categoría</label>
                        <select
                          value={newFerianteForm.tipo}
                          onChange={(e) => setNewFerianteForm({ ...newFerianteForm, tipo: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                        >
                          {['Artesanías', 'Gastronomía', 'Huerta / Vivero', 'Música / Arte', 'Terapias Holísticas', 'Feria Americana', 'Productos Naturales'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-loma-wood uppercase mb-1">Puesto Asignado en la Plaza</label>
                      <input
                        type="text"
                        value={newFerianteForm.puestoAsignado}
                        onChange={(e) => setNewFerianteForm({ ...newFerianteForm, puestoAsignado: e.target.value })}
                        placeholder="Ej: Sector B - Puesto 04"
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-loma-wood uppercase mb-1">Descripción / Productos</label>
                      <textarea
                        rows={2}
                        value={newFerianteForm.descripcion}
                        onChange={(e) => setNewFerianteForm({ ...newFerianteForm, descripcion: e.target.value })}
                        placeholder="Detalle de productos..."
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddFerianteModal(false)}
                        className="w-1/2 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 rounded-xl bg-loma-green hover:bg-loma-wood text-white font-bold uppercase shadow-sm"
                      >
                        Guardar Feriante
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* 3. PESTAÑA CRM VOLUNTARIOS */}
      {/* ========================================================= */}
      {crmTab === 'voluntarios' && (
        <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-loma-green">
              Roster de Voluntarios Vecinales 🤝
            </h2>
            <span className="text-xs font-bold text-loma-wood">
              {data.voluntarios.length} inscriptos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-loma-wood/10 text-loma-green border-b border-loma-wood/20">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Teléfono / WhatsApp</th>
                  <th className="p-3">Fecha Inscripción</th>
                  <th className="p-3">Área de Interés</th>
                  <th className="p-3">Contactado</th>
                  <th className="p-3">Notas</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.voluntarios.map((vol) => (
                  <tr key={vol.id} className="hover:bg-[#faf9f5]">
                    <td className="p-3 font-bold text-loma-green">{vol.nombre}</td>
                    <td className="p-3 font-mono">{vol.telefono}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap text-[11px] font-bold">
                      {vol.fechaInscripcionTexto || (vol.createdAt ? new Date(vol.createdAt).toLocaleDateString('es-AR') : '-')}
                    </td>
                    <td className="p-3 font-semibold text-loma-wood">{vol.areaInteres}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleContactado(vol)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          vol.contactado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {vol.contactado ? '✓ Contactado' : '⏳ Pendiente'}
                      </button>
                    </td>
                    <td className="p-3 text-gray-500 italic">{vol.notas || 'Sin notas'}</td>
                    <td className="p-3 text-right">
                      {vol.telefono && (
                        <a
                          href={`https://wa.me/${vol.telefono.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-green-600 text-white rounded-lg inline-block"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA CRM MAPA VECINAL & REPORTES */}
      {/* ========================================================= */}
      {crmTab === 'mapa' && (
        <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-loma-green">
                Moderación de Reportes del Mapa Vecinal 🗺️
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Supervisión de puntos, novedades, alertas e hilos de comentarios publicados por vecinos.
              </p>
            </div>
            <span className="text-xs font-bold text-loma-wood">
              {data.puntosMapa.length} reportes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-loma-wood/10 text-loma-green border-b border-loma-wood/20">
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Título & Detalle</th>
                  <th className="p-3">Ubicación / Calles</th>
                  <th className="p-3">Vecino / Contacto</th>
                  <th className="p-3">Comentarios</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.puntosMapa.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf9f5]">
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-bold text-xs">
                        <span>{p.emoji}</span>
                        <span>{p.categoriaLabel || p.categoria}</span>
                      </span>
                    </td>
                    <td className="p-3 max-w-xs">
                      <strong className="text-loma-green block">{p.titulo}</strong>
                      <span className="text-gray-500 text-[11px] line-clamp-2">{p.descripcion}</span>
                    </td>
                    <td className="p-3 text-gray-700 font-semibold">{p.calles}</td>
                    <td className="p-3">
                      <div className="font-bold text-loma-green">{p.autorNombre}</div>
                      {p.contacto && <div className="text-gray-500 font-mono text-[11px]">{p.contacto}</div>}
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                        💬 {(p.comentarios || []).length}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleResolverPuntoMapa(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.resuelto ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.resuelto ? '✓ Resuelto' : '⏳ En curso'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeletePuntoMapa(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar reporte del mapa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PESTAÑA TROQUELES & MERCADO */}
      {/* ========================================================= */}
      {crmTab === 'troqueles' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Listado de Troqueles Emitidos */}
          <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-loma-green mb-4">
              Billeteras / Troqueles Emitidos 🎫
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-loma-wood/10 text-loma-green">
                    <th className="p-3">ID Troquel</th>
                    <th className="p-3">Titular / Familia</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Tipo Aporte</th>
                    <th className="p-3">Aporte Inicial</th>
                    <th className="p-3">Saldo Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {data.vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-[#faf9f5]">
                      <td className="p-3 font-mono font-bold text-loma-accent text-sm">#{v.idTroquel}</td>
                      <td className="p-3 font-bold text-loma-green">{v.compradorNombre}</td>
                      <td className="p-3 font-mono">{v.telefono}</td>
                      <td className="p-3 text-loma-wood">{v.tipoAporte}</td>
                      <td className="p-3 font-mono">${(v.montoInicial || 0).toLocaleString('es-AR')}</td>
                      <td className="p-3 font-mono font-bold text-green-700 text-sm">
                        ${(v.saldoActual || 0).toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Listado de Virtudes & Stock */}
          <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-loma-green mb-4">
              Control de Stock de Virtudes en el Mercado 🍯
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-loma-wood/10 text-loma-green">
                    <th className="p-3">ID</th>
                    <th className="p-3">Producto / Virtud</th>
                    <th className="p-3">Oferente</th>
                    <th className="p-3">Valor ($)</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.virtudes.map((virt) => (
                    <tr key={virt.id} className="hover:bg-[#faf9f5]">
                      <td className="p-3 font-mono">#{virt.id}</td>
                      <td className="p-3 font-bold text-loma-green">{virt.descripcion}</td>
                      <td className="p-3 text-loma-wood">{virt.oferente}</td>
                      <td className="p-3 font-bold text-loma-accent font-mono">${virt.valor.toLocaleString('es-AR')}</td>
                      <td className="p-3 font-bold">{virt.stock}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          virt.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {virt.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PESTAÑA VOTOS & AUDITORÍA PRESUPUESTO */}
      {/* ========================================================= */}
      {crmTab === 'votos' && (
        <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-loma-green">
              Auditoría de Votos Vecinales 🗳️
            </h2>
            <span className="text-xs font-bold bg-loma-accent/20 text-loma-accent px-3 py-1 rounded-full">
              {data.votos.length} votos totales
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-loma-wood/10 text-loma-green">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Vecino</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Localidad / Calles</th>
                  <th className="p-3">Opción Votada</th>
                  <th className="p-3">Justificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.votos.map((v) => (
                  <tr key={v.id} className="hover:bg-[#faf9f5]">
                    <td className="p-3 font-mono text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-loma-green">{v.nombre}</td>
                    <td className="p-3 font-mono">{v.telefono}</td>
                    <td className="p-3 text-gray-700">{v.localidad} • {v.calles}</td>
                    <td className="p-3 font-bold text-loma-wood">{v.opcion}</td>
                    <td className="p-3 text-gray-600 italic max-w-xs">{v.justificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. PESTAÑA FINANZAS & CONTABILIDAD */}
      {/* ========================================================= */}
      {crmTab === 'finanzas' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Cargar Nuevo Gasto */}
          <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-loma-green mb-4">
              Cargar Nuevo Egreso / Factura 💰
            </h3>

            <form onSubmit={handleAddGasto} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Detalle del Gasto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cableado y reflectores LED"
                  value={newGasto.detalle}
                  onChange={(e) => setNewGasto({ ...newGasto, detalle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-loma-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Monto ($)</label>
                <input
                  type="number"
                  required
                  placeholder="Ej: 35000"
                  value={newGasto.monto}
                  onChange={(e) => setNewGasto({ ...newGasto, monto: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold text-red-600 focus:outline-none focus:border-loma-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Categoría</label>
                <input
                  type="text"
                  placeholder="Ej: Iluminación / Sonido"
                  value={newGasto.categoria}
                  onChange={(e) => setNewGasto({ ...newGasto, categoria: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-loma-accent"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-loma-green hover:bg-loma-wood text-white font-bold text-xs uppercase py-3 rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Egreso</span>
                </button>
              </div>
            </form>
          </div>

          {/* Listado de Gastos */}
          <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-loma-green mb-4">
              Historial de Comprobantes Registrados
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-loma-wood/10 text-loma-green">
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Detalle</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Monto ($)</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.contabilidad.gastos.map((g) => (
                    <tr key={g.id} className="hover:bg-[#faf9f5]">
                      <td className="p-3 font-mono text-gray-500">{g.fecha}</td>
                      <td className="p-3 font-bold text-loma-green">{g.detalle}</td>
                      <td className="p-3 font-semibold text-loma-wood">{g.categoria}</td>
                      <td className="p-3 font-bold text-red-600 font-mono">${g.montoNum.toLocaleString('es-AR')}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteGasto(g.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar gasto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 7. PESTAÑA CONFIGURACIÓN LUNAR & CARTELERA */}
      {/* ========================================================= */}
      {crmTab === 'config' && configForm && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Configuración de la Luna Activa y Motor Sincrónico */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Frecuencia Sincrónica 13:20
                </span>
                <h3 className="font-serif text-xl font-bold text-loma-green mt-1">
                  Motor de Ciclos Lunares & Configuración General 🌕
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Modo Calendario Automático</span>
                </span>
              </div>
            </div>

            {/* Selector Rápido de Ciclos Lunares */}
            {configForm.ciclosDisponibles && (
              <div className="bg-[#faf9f5] p-4 rounded-2xl border border-gray-200">
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1.5">
                  ⚡ Cargar Plantilla de Ciclo Lunar (12 Plenilunios Zodiacales)
                </label>
                <select
                  onChange={(e) => {
                    const sel = configForm.ciclosDisponibles.find(c => c.lunaActiva === e.target.value);
                    if (sel) {
                      setConfigForm({
                        ...configForm,
                        lunaActiva: sel.lunaActiva,
                        signo: sel.signo,
                        simboloZodiacal: sel.simboloZodiacal,
                        fechaEventoTexto: sel.fechaEventoTexto,
                        diaSemanaTexto: sel.diaSemanaTexto,
                        horarioTexto: sel.horarioTexto,
                        lugarTexto: sel.lugarTexto,
                        lema: sel.lema,
                        mistica: sel.mistica,
                        elemento: sel.elemento
                      });
                    }
                  }}
                  defaultValue=""
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-loma-green focus:outline-none focus:border-loma-accent"
                >
                  <option value="" disabled>Selecciona una Luna para autocompletar textos y mística...</option>
                  {configForm.ciclosDisponibles.map((c) => (
                    <option key={c.id} value={c.lunaActiva}>
                      {c.simboloZodiacal} {c.lunaActiva} • {c.fechaEventoTexto} ({c.elemento})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Nombre de la Luna (Pestaña CRM)</label>
                  <input
                    type="text"
                    value={configForm.lunaActiva || ''}
                    onChange={(e) => setConfigForm({ ...configForm, lunaActiva: e.target.value })}
                    placeholder="Ej: Luna Piscis"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-loma-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Signo Zodiacal</label>
                  <input
                    type="text"
                    value={configForm.signo || ''}
                    onChange={(e) => setConfigForm({ ...configForm, signo: e.target.value })}
                    placeholder="Ej: Piscis"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Símbolo Zodiacal</label>
                  <input
                    type="text"
                    value={configForm.simboloZodiacal || ''}
                    onChange={(e) => setConfigForm({ ...configForm, simboloZodiacal: e.target.value })}
                    placeholder="Ej: ♓"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-loma-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Fecha del Evento (Texto)</label>
                  <input
                    type="text"
                    value={configForm.fechaEventoTexto || ''}
                    onChange={(e) => setConfigForm({ ...configForm, fechaEventoTexto: e.target.value })}
                    placeholder="Ej: 5 DE SEPTIEMBRE"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Horario</label>
                  <input
                    type="text"
                    value={configForm.horarioTexto || ''}
                    onChange={(e) => setConfigForm({ ...configForm, horarioTexto: e.target.value })}
                    placeholder="Ej: DE 12 A 18 HS"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Lugar / Plaza</label>
                  <input
                    type="text"
                    value={configForm.lugarTexto || configForm.lugar || ''}
                    onChange={(e) => setConfigForm({ ...configForm, lugarTexto: e.target.value })}
                    placeholder="Ej: Plaza La Misión y Nigromante"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Lema / Slogan Inspirador</label>
                <input
                  type="text"
                  value={configForm.lema || configForm.motto || ''}
                  onChange={(e) => setConfigForm({ ...configForm, lema: e.target.value })}
                  placeholder="Ej: Un encuentro para compartir, conectar y fortalecer nuestra comunidad."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Mística del Ciclo Zodiacal</label>
                <textarea
                  rows={3}
                  value={configForm.mistica || ''}
                  onChange={(e) => setConfigForm({ ...configForm, mistica: e.target.value })}
                  placeholder="Texto explicativo sobre la energía mística de la Luna actual..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Imagen de Fondo / Wallpaper del Flyer (URL o ruta)</label>
                <input
                  type="text"
                  value={configForm.fondoUrl || ''}
                  onChange={(e) => setConfigForm({ ...configForm, fondoUrl: e.target.value })}
                  placeholder="Ej: /fondo-loma-verde.jpg"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Por defecto usa <code>/fondo-loma-verde.jpg</code> (fondo artístico del evento).
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-loma-green hover:bg-loma-wood text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Guardar y Aplicar en Todo el Sistema</span>
                </button>
              </div>
            </form>
          </div>

          {/* Administrador de Noticias de la Cartelera */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-loma-wood/30 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-loma-green mb-4">
              Noticias de la Cartelera Comunitaria 📝
            </h3>

            {/* Crear Noticia */}
            <form onSubmit={handleAddNoticia} className="bg-[#faf9f5] p-4 rounded-2xl border border-gray-200 mb-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Título de la noticia..."
                  value={newNoticia.titulo}
                  onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
                  className="p-2 rounded-xl border border-gray-300 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="URL Imagen (opcional)..."
                  value={newNoticia.img}
                  onChange={(e) => setNewNoticia({ ...newNoticia, img: e.target.value })}
                  className="p-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>
              <textarea
                rows={2}
                required
                placeholder="Cuerpo de la noticia..."
                value={newNoticia.texto}
                onChange={(e) => setNewNoticia({ ...newNoticia, texto: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
              <button
                type="submit"
                className="bg-loma-wood hover:bg-loma-green text-white px-4 py-2 rounded-xl text-xs font-bold uppercase"
              >
                + Publicar Noticia
              </button>
            </form>

            {/* Listado de Noticias */}
            <div className="space-y-3">
              {data.noticias.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-gray-200 flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-loma-green">{n.titulo}</h4>
                    <p className="text-xs text-gray-600 mt-1">{n.texto}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNoticia(n.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
