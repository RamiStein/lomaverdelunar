import React, { useState } from 'react';
import { Vote, Heart, CheckCircle, Info, Copy, ExternalLink, Users, Sparkles, HandHeart, ShieldCheck, Lock, Lightbulb, MapPin, ArrowRight } from 'lucide-react';

export default function PresupuestoView({ presupuestoData, onVolunteerSubmitted, isAdmin, openLoginModal }) {
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Voluntario / Vecino Asociado state
  const [voluntarioForm, setVoluntarioForm] = useState({
    nombre: '',
    telefono: '',
    areaInteres: 'General',
    notas: ''
  });
  const [voluntarioLoading, setVoluntarioLoading] = useState(false);
  const [voluntarioSuccess, setVoluntarioSuccess] = useState(false);

  const opciones = presupuestoData?.opciones || [];
  const lunas = presupuestoData?.lunas || [];

  const handleVoluntarioSubmit = async (e) => {
    e.preventDefault();
    setVoluntarioLoading(true);
    try {
      const res = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voluntarioForm)
      });
      if (!res.ok) throw new Error('Error al registrar la inscripción.');
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
      <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <span className="bg-loma-accent/20 text-loma-accent font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
          <Vote className="w-4 h-4" /> Participación Vecinal • Loma Verde
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-loma-green uppercase tracking-tight">
          Presupuesto Participativo Comunitario 🗳️
        </h1>
        
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
          El Presupuesto Participativo es una herramienta comunitaria para soñar, evaluar y decidir en conjunto las mejoras de la <strong>Plaza La Misión</strong> y los espacios públicos de nuestro barrio. ¡Construimos futuro entre todos los vecinos!
        </p>

        {/* Solo visible para miembros autenticados en CRM */}
        {isAdmin && (
          <div className="mt-6 pt-6 border-t border-loma-wood/20 bg-amber-50/80 p-5 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Fondo Común Proyectado (Vista Administrativa CRM)
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-loma-accent">
              {presupuestoData?.monto || '$2.500.000'}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {lunas.map((l, i) => (
                <span key={i} className="text-xs bg-white px-2.5 py-1 rounded-full border border-amber-300 font-semibold text-gray-700">
                  {l.nombre}: <strong className="text-loma-green">{l.monto}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. ADELANTO: ¿EN QUÉ ESTAMOS PENSANDO INVERTIR? */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-loma-accent font-serif font-bold text-lg mb-1">
            <Lightbulb className="w-5 h-5" />
            <span>Proyectos en Evaluación</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-loma-green">
            Adelanto: ¿En qué estamos soñando invertir? 🌿
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto mt-1">
            Conoce las iniciativas vecinales que se están evaluando para el bienestar y la sustentabilidad del barrio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opciones.map((op) => (
            <div 
              key={op.id}
              className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-loma-green overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {op.imagen && (
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={op.imagen} 
                    alt={op.titulo} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-loma-green text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow">
                    Propuesta #{op.id + 1}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-loma-green mb-2 leading-snug">
                    {op.titulo}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {op.desc}
                  </p>
                </div>

                <div>
                  {isAdmin && op.presupuestoDetalle && (
                    <div className="text-xs bg-loma-bg p-3 rounded-xl border border-loma-wood/20 text-gray-700 whitespace-pre-line mb-3 font-mono">
                      <strong>Detalle de Costos:</strong>
                      <br />
                      {op.presupuestoDetalle}
                    </div>
                  )}

                  {/* Donación voluntaria alias */}
                  {op.donacion && (
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span>Alias aporte: </span>
                        <strong className="text-loma-green">{op.donacion}</strong>
                      </div>
                      <button
                        onClick={() => copyToClipboard(op.donacion)}
                        className="text-xs text-loma-accent hover:text-amber-700 font-bold p-1 rounded transition-colors"
                        title="Copiar alias"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FORMULARIO DE INSCRIPCIÓN / SUMARSE COMO VECINO ASOCIADO O VOLUNTARIO */}
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl border-2 border-loma-accent shadow-[8px_8px_0px_rgba(196,140,38,0.15)] relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-loma-accent/20 text-loma-accent flex items-center justify-center mx-auto mb-3">
            <HandHeart className="w-6 h-6" />
          </div>
          
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-loma-green">
            ¡Súmate al Equipo y Sé Parte Activa! 🌿
          </h3>
          
          <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">
            La información detallada, balances y asambleas se comparten con los vecinos asociados. 
            <br />
            <strong>Déjanos tus datos a continuación y el equipo vecinal se pondrá en contacto contigo para darte la bienvenida.</strong>
          </p>
        </div>

        {voluntarioSuccess ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-6 rounded-2xl text-center animate-in fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h4 className="font-serif font-bold text-xl mb-1">¡Gracias por sumarte a la red! 🌿</h4>
            <p className="text-sm leading-relaxed">
              Hemos recibido tu información con éxito. Parte del equipo de vecinos se pondrá en contacto con vos a la brevedad para coordinar juntos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleVoluntarioSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                Tu Nombre y Apellido *
              </label>
              <input
                type="text"
                required
                value={voluntarioForm.nombre}
                onChange={(e) => setVoluntarioForm({ ...voluntarioForm, nombre: e.target.value })}
                placeholder="Ej: María Gómez"
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-loma-green focus:ring-2 focus:ring-loma-green/20 outline-none text-sm bg-loma-bg/50"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                Tu Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={voluntarioForm.telefono}
                onChange={(e) => setVoluntarioForm({ ...voluntarioForm, telefono: e.target.value })}
                placeholder="Ej: 11 2233 4455"
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-loma-green focus:ring-2 focus:ring-loma-green/20 outline-none text-sm bg-loma-bg/50"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                ¿En qué área te gustaría colaborar o participar?
              </label>
              <select
                value={voluntarioForm.areaInteres}
                onChange={(e) => setVoluntarioForm({ ...voluntarioForm, areaInteres: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-loma-green focus:ring-2 focus:ring-loma-green/20 outline-none text-sm bg-loma-bg/50 font-medium"
              >
                <option value="General">Participación General / Vecino Asociado</option>
                <option value="Armado y Logística de Puestos">Armado y Logística de la Feria</option>
                <option value="Huerta y Compostaje">Huerta Comunitaria y Compostaje</option>
                <option value="Recepción y Asambleas">Recepción y Coordinación de Asambleas</option>
                <option value="Cultura y Escenario">Cultura, Arte y Escenario</option>
                <option value="Comunicación y Difusión">Comunicación, Redes y Flyers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                Comentarios / Ideas para el barrio (Opcional)
              </label>
              <textarea
                rows={2}
                value={voluntarioForm.notas}
                onChange={(e) => setVoluntarioForm({ ...voluntarioForm, notas: e.target.value })}
                placeholder="¿Tienes alguna propuesta o disponibilidad de horarios?"
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-loma-green focus:ring-2 focus:ring-loma-green/20 outline-none text-sm bg-loma-bg/50"
              />
            </div>

            <button
              type="submit"
              disabled={voluntarioLoading}
              className="w-full bg-loma-green hover:bg-loma-wood text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {voluntarioLoading ? 'Enviando...' : 'INSCRIBIRME Y SUMARME AL EQUIPO 🌿'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
