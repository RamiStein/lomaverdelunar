import React, { useState, useEffect } from 'react';
import { Vote, Heart, CheckCircle, Info, Copy, ExternalLink, Users, Coins, Sparkles } from 'lucide-react';

export default function PresupuestoView({ presupuestoData, onVoteSubmitted, onVolunteerSubmitted }) {
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Voting state
  const [votoForm, setVotoForm] = useState({
    nombre: '',
    telefono: '',
    partido: 'Escobar',
    localidad: 'Loma Verde',
    calles: '',
    opcion: '',
    justificacion: ''
  });
  const [votoLoading, setVotoLoading] = useState(false);
  const [votoSuccess, setVotoSuccess] = useState(false);
  const [votoError, setVotoError] = useState(null);

  // Voluntario state
  const [voluntarioForm, setVoluntarioForm] = useState({
    nombre: '',
    telefono: '',
    areaInteres: 'General'
  });
  const [voluntarioLoading, setVoluntarioLoading] = useState(false);
  const [voluntarioSuccess, setVoluntarioSuccess] = useState(false);

  const opciones = presupuestoData?.opciones || [];
  const lunas = presupuestoData?.lunas || [];

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    setVotoLoading(true);
    setVotoError(null);

    try {
      const res = await fetch('/api/votos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(votoForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al emitir el voto.');

      setVotoSuccess(true);
      if (onVoteSubmitted) onVoteSubmitted();
      setTimeout(() => {
        setVotoSuccess(false);
        setVotoForm({
          nombre: '',
          telefono: '',
          partido: 'Escobar',
          localidad: 'Loma Verde',
          calles: '',
          opcion: '',
          justificacion: ''
        });
      }, 4000);
    } catch (err) {
      setVotoError(err.message);
    } finally {
      setVotoLoading(false);
    }
  };

  const handleVoluntarioSubmit = async (e) => {
    e.preventDefault();
    setVoluntarioLoading(true);
    try {
      const res = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voluntarioForm)
      });
      if (!res.ok) throw new Error('Error al inscribirse.');
      setVoluntarioSuccess(true);
      if (onVolunteerSubmitted) onVolunteerSubmitted();
    } catch (err) {
      alert(err.message);
    } finally {
      setVoluntarioLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* 1. Header Card Principal */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <span className="bg-loma-accent/20 text-loma-accent font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
          <Vote className="w-4 h-4" /> Democracia Directa Barrial
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-loma-green uppercase tracking-tight">
          Presupuesto Participativo 🗳️
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
          {presupuestoData?.texto || 'Los vecinos de Loma Verde decidimos en qué proyectos e infraestructura sustentable se invierten los recursos del fondo común.'}
        </p>

        {/* Monto Destacado */}
        <div className="my-6">
          <div className="font-serif text-4xl sm:text-6xl font-extrabold text-loma-accent tracking-tight">
            {presupuestoData?.monto || '$2.500.000'}
          </div>
          <span className="text-xs font-bold text-loma-wood uppercase tracking-widest block mt-1">
            Fondo Total a Invertir
          </span>
        </div>

        {/* Recaudación por Lunas */}
        {lunas.length > 0 && (
          <div className="mt-6 pt-6 border-t border-loma-wood/20">
            <h4 className="text-xs font-bold text-loma-wood uppercase tracking-wider mb-3">
              Cosecha y Aportes por Ciclo Lunar:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {lunas.map((l, idx) => (
                <div 
                  key={idx}
                  className="bg-[#faf9f5] border border-loma-accent/40 px-3 py-1.5 rounded-xl text-xs font-semibold text-loma-green shadow-xs flex items-center gap-1.5"
                >
                  <span>{l.nombre}:</span>
                  <strong className="text-loma-accent">{l.monto}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Proyectos Propuestos */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-loma-wood mb-10 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-loma-accent" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-loma-green">
            Proyectos en Evaluación (Fase 1)
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-8">
          Conoce las propuestas vecinales, su desglose de costos y cómo apoyar cada iniciativa.
        </p>

        <div className="space-y-6">
          {opciones.map((op, idx) => (
            <div 
              key={op.id || idx}
              className="border-l-4 border-loma-accent bg-[#faf9f5] p-6 rounded-r-2xl border border-loma-wood/20 hover:border-loma-accent transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="font-serif text-xl font-bold text-loma-green">
                  {op.titulo}
                </h3>
                {op.votosCount !== undefined && (
                  <span className="bg-loma-green text-white text-xs font-bold px-2.5 py-1 rounded-full w-fit">
                    🗳️ {op.votosCount} votos
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {op.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedProyecto(op)}
                  className="bg-white hover:bg-loma-accent hover:text-white text-loma-accent border-2 border-loma-accent font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  🔍 Ver Detalle de Costos y Apoyar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Formulario para Emitir Voto */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-loma-green shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <div className="text-center mb-6 border-b border-loma-wood/20 pb-4">
          <span className="bg-loma-accent text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider inline-block mb-1">
            Votación Comunitaria
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-loma-green">
            Emitir mi Voto 🗳️
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Elige el proyecto que consideres más prioritario para nuestro barrio.
          </p>
        </div>

        {votoSuccess ? (
          <div className="bg-green-50 border-2 border-green-500 text-green-800 p-6 rounded-2xl text-center animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h3 className="font-serif text-xl font-bold mb-1">¡Voto Registrado con Éxito!</h3>
            <p className="text-sm">Gracias por participar activamente en el futuro sustentable de Loma Verde.</p>
          </div>
        ) : (
          <form onSubmit={handleVoteSubmit} className="space-y-4">
            {votoError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold">
                🚨 {votoError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={votoForm.nombre}
                  onChange={(e) => setVotoForm({ ...votoForm, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={votoForm.telefono}
                  onChange={(e) => setVotoForm({ ...votoForm, telefono: e.target.value })}
                  placeholder="Ej: 11 2345-6789"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">Partido</label>
                <input
                  type="text"
                  required
                  value={votoForm.partido}
                  onChange={(e) => setVotoForm({ ...votoForm, partido: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">Localidad</label>
                <input
                  type="text"
                  required
                  value={votoForm.localidad}
                  onChange={(e) => setVotoForm({ ...votoForm, localidad: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">Calles / Dirección</label>
                <input
                  type="text"
                  required
                  value={votoForm.calles}
                  onChange={(e) => setVotoForm({ ...votoForm, calles: e.target.value })}
                  placeholder="Ej: La Misión y Nigromante"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">Proyecto que Eliges *</label>
              <select
                required
                value={votoForm.opcion}
                onChange={(e) => setVotoForm({ ...votoForm, opcion: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm font-semibold focus:outline-none focus:border-loma-accent"
              >
                <option value="" disabled>Selecciona un proyecto...</option>
                {opciones.map((op) => (
                  <option key={op.id} value={op.titulo}>
                    {op.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                ¿Por qué consideras que es la mejor opción? (Justificación breve) *
              </label>
              <textarea
                required
                rows={3}
                value={votoForm.justificacion}
                onChange={(e) => setVotoForm({ ...votoForm, justificacion: e.target.value })}
                placeholder="Cuéntanos por qué elegiste este proyecto..."
                className="w-full p-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
              />
            </div>

            <button
              type="submit"
              disabled={votoLoading}
              className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 mt-2"
            >
              {votoLoading ? 'Registrando Voto...' : 'CONFIRMAR MI VOTO VECINAL'}
            </button>
          </form>
        )}
      </div>

      {/* 4. Inscripción de Voluntarios */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 p-6 sm:p-10 rounded-3xl border-2 border-loma-green/50">
        <div className="max-w-xl mx-auto text-center">
          <Users className="w-8 h-8 text-loma-green mx-auto mb-2" />
          <h3 className="font-serif text-2xl font-bold text-loma-green">
            ¿Querés sumarte como Voluntario? 🤝
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-6">
            Ayudanos en el armado de puestos, recepción, coordinación del Mercado de Virtudes o talleres.
          </p>

          {voluntarioSuccess ? (
            <div className="bg-white p-4 rounded-2xl border border-green-500 text-green-800 text-sm font-bold animate-fadeIn">
              ¡Gracias por sumarte! Un coordinador del equipo te contactará pronto.
            </div>
          ) : (
            <form onSubmit={handleVoluntarioSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Tu Nombre"
                value={voluntarioForm.nombre}
                onChange={(e) => setVoluntarioForm({ ...voluntarioForm, nombre: e.target.value })}
                className="flex-1 p-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-loma-green"
              />
              <input
                type="tel"
                required
                placeholder="WhatsApp"
                value={voluntarioForm.telefono}
                onChange={(e) => setVoluntarioForm({ ...voluntarioForm, telefono: e.target.value })}
                className="flex-1 p-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-loma-green"
              />
              <button
                type="submit"
                disabled={voluntarioLoading}
                className="bg-loma-wood hover:bg-loma-green text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow transition-all"
              >
                Sumarme
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Modal Detalle de Proyecto */}
      {selectedProyecto && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProyecto(null)}
        >
          <div 
            className="bg-white border-3 border-loma-accent p-6 sm:p-8 rounded-3xl max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedProyecto.imagen && (
              <img 
                src={selectedProyecto.imagen} 
                alt={selectedProyecto.titulo} 
                className="w-full h-48 sm:h-56 object-cover rounded-2xl border border-loma-wood/20 mb-4"
              />
            )}

            <h3 className="font-serif text-2xl font-bold text-loma-green mb-2">
              {selectedProyecto.titulo}
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {selectedProyecto.desc}
            </p>

            {/* Desglose Presupuestario */}
            {selectedProyecto.presupuestoDetalle && (
              <div className="bg-amber-50/80 border-l-4 border-loma-accent p-4 rounded-r-xl mb-6">
                <h4 className="text-xs font-bold text-loma-accent uppercase tracking-wider mb-2">
                  Transparencia y Desglose de Costos:
                </h4>
                <pre className="font-sans text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedProyecto.presupuestoDetalle}
                </pre>
              </div>
            )}

            {/* Donación / Aporte Directo */}
            {selectedProyecto.donacion && (
              <div className="bg-[#faf9f5] border-2 border-dashed border-loma-green p-4 rounded-2xl text-center mb-6">
                <h4 className="font-serif font-bold text-loma-green text-base mb-1">
                  💖 Apoyar directamente este Proyecto
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Transfiere tu aporte voluntario al alias oficial del proyecto:
                </p>
                <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-200">
                  <strong className="text-loma-green font-mono text-sm sm:text-base">
                    {selectedProyecto.donacion}
                  </strong>
                  <button
                    onClick={() => copyToClipboard(selectedProyecto.donacion)}
                    className="bg-loma-green text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-loma-wood transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAlias ? '¡COPIADO!' : 'COPIAR'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setSelectedProyecto(null)}
                className="bg-gray-100 hover:bg-gray-200 text-loma-green font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
