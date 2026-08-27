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
    noticias: []
  });

  // Filters & State
  const [ferianteFilter, setFerianteFilter] = useState('todos');
  const [ferianteSearch, setFerianteSearch] = useState('');
  const [editingFeriante, setEditingFeriante] = useState(null);

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
        notRes
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
        fetch('/api/noticias').then(r => r.json())
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
        noticias: notRes || []
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

  const handleDeleteFeriante = async (id) => {
    if (!confirm('¿Deseas eliminar este registro de feriante?')) return;
    try {
      await fetch(`/api/admin/feriantes/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
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
      
      {/* Barra Superior CRM */}
      <div className="bg-white p-6 rounded-3xl border-2 border-loma-green shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
      {/* ========================================================= */}
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
      {crmTab === 'feriantes' && (
        <div className="bg-white p-6 rounded-3xl border border-loma-wood/30 shadow-sm space-y-6 animate-fadeIn">
          
          {/* Controles de Filtrado */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {['todos', 'pendiente', 'aprobado', 'confirmado'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFerianteFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    ferianteFilter === st
                      ? 'bg-loma-green text-white shadow-xs'
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
                placeholder="Buscar feriante o rubro..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-loma-accent"
              />
            </div>
          </div>

          {/* Tabla de Feriantes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-loma-wood/10 text-loma-green border-b border-loma-wood/20">
                  <th className="p-3">Emprendimiento</th>
                  <th className="p-3">Responsable</th>
                  <th className="p-3">Rubro</th>
                  <th className="p-3">Ubicación / Puesto</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.feriantes
                  .filter((f) => ferianteFilter === 'todos' || f.estado === ferianteFilter)
                  .filter((f) => !ferianteSearch || f.nombre.toLowerCase().includes(ferianteSearch.toLowerCase()) || (f.nombrePersonal && f.nombrePersonal.toLowerCase().includes(ferianteSearch.toLowerCase())))
                  .map((f) => (
                    <tr key={f.id} className="hover:bg-[#faf9f5] transition-colors">
                      <td className="p-3 font-bold text-loma-green">
                        <div>{f.nombre}</div>
                        {f.instagram && <span className="text-[10px] text-pink-600 font-semibold">{f.instagram}</span>}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">
                        <div>{f.nombrePersonal || '-'}</div>
                        <span className="text-[10px] text-gray-400">{f.contacto}</span>
                      </td>
                      <td className="p-3 font-semibold text-loma-wood">{f.tipo}</td>
                      <td className="p-3">
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {f.puestoAsignado || 'Sin asignar'}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={f.estado}
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
                          {f.contacto && (
                            <button
                              onClick={() => sendWhatsAppConfirmation(f)}
                              className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg"
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
                            className="p-1.5 bg-loma-wood hover:bg-loma-green text-white rounded-lg"
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
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          
          {/* Configuración de la Luna Activa */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-loma-wood/30 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-loma-green mb-4">
              Configurador del Ciclo Lunar Activo ♒
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Luna Activa (Pestaña)</label>
                  <input
                    type="text"
                    value={configForm.lunaActiva || ''}
                    onChange={(e) => setConfigForm({ ...configForm, lunaActiva: e.target.value })}
                    placeholder="Ej: Luna Acuario"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-loma-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Nombre del Encuentro</label>
                  <input
                    type="text"
                    value={configForm.nombreEvento || ''}
                    onChange={(e) => setConfigForm({ ...configForm, nombreEvento: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Signo / Subtítulo</label>
                  <input
                    type="text"
                    value={configForm.subtitulo || ''}
                    onChange={(e) => setConfigForm({ ...configForm, subtitulo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-loma-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Fecha y Horario</label>
                  <input
                    type="text"
                    value={configForm.fechaEvento || ''}
                    onChange={(e) => setConfigForm({ ...configForm, fechaEvento: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Lugar / Ubicación</label>
                  <input
                    type="text"
                    value={configForm.lugar || ''}
                    onChange={(e) => setConfigForm({ ...configForm, lugar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-loma-wood uppercase mb-1">Mística del Ciclo</label>
                <textarea
                  rows={3}
                  value={configForm.mistica || ''}
                  onChange={(e) => setConfigForm({ ...configForm, mistica: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="bg-loma-green hover:bg-loma-wood text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
              >
                Guardar Configuración Lunar
              </button>
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
