import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle2, AlertCircle, Clock, MapPin, Share2, CornerDownRight, User } from 'lucide-react';

export default function PuntoDetalleDrawer({ punto, onClose, onUpdatePunto }) {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [autorComentario, setAutorComentario] = useState('');
  const [contactoComentario, setContactoComentario] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [comentarios, setComentarios] = useState(punto?.comentarios || []);
  const [resuelto, setResuelto] = useState(punto?.resuelto || false);

  if (!punto) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setSubmittingComment(true);
    const commentPayload = {
      autorNombre: autorComentario.trim() || 'Vecino de Loma Verde',
      texto: nuevoComentario.trim(),
      contacto: contactoComentario.trim()
    };

    try {
      const res = await fetch(`/api/mapa/puntos/${punto.id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar comentario');

      const updatedList = data.punto?.comentarios || [...comentarios, { id: 'com-' + Date.now(), ...commentPayload, createdAt: new Date().toISOString() }];
      setComentarios(updatedList);
      setNuevoComentario('');
      if (onUpdatePunto) onUpdatePunto({ ...punto, comentarios: updatedList });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleResolve = async () => {
    setResolving(true);
    try {
      const res = await fetch(`/api/mapa/puntos/${punto.id}/resolver`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar estado');

      setResuelto(data.resuelto);
      if (onUpdatePunto) onUpdatePunto({ ...punto, resuelto: data.resuelto });
    } catch (err) {
      alert(err.message);
    } finally {
      setResolving(false);
    }
  };

  const formatWhatsAppUrl = (phone, title) => {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length >= 10 && !clean.startsWith('54')) clean = '549' + clean;
    const msg = encodeURIComponent(`¡Hola! Te contacto por tu reporte en el Mapa Vecinal de Loma Verde: "${title}"`);
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l-2 border-loma-green z-[9999] flex flex-col animate-slideInRight overflow-hidden">
      
      {/* Cabecera Drawer */}
      <div className="bg-gradient-to-r from-loma-green to-emerald-900 text-white p-4 sm:p-5 flex justify-between items-start shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{punto.emoji || '📍'}</span>
            <span className="text-[10px] font-extrabold uppercase bg-white/20 text-amber-200 px-2.5 py-0.5 rounded-full">
              {punto.categoriaLabel || punto.categoria}
            </span>
            {resuelto ? (
              <span className="text-[10px] font-black uppercase bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                ✓ Resuelto
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                En curso
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
            {punto.titulo}
          </h3>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-gray-700">
        
        {/* Metadatos */}
        <div className="bg-[#faf9f5] p-3.5 rounded-2xl border border-gray-200 space-y-2">
          <div className="flex items-center gap-1.5 text-loma-green font-semibold">
            <MapPin className="w-4 h-4 text-loma-accent shrink-0" />
            <span>{punto.calles || 'Loma Verde, Escobar'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
            <span>Publicado por: <strong className="text-gray-800">{punto.autorNombre}</strong></span>
            <span>{new Date(punto.createdAt).toLocaleDateString('es-AR')}</span>
          </div>
        </div>

        {/* Foto si existe */}
        {punto.foto && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm max-h-56 bg-black/5">
            <img src={punto.foto} alt="Foto del reporte" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Descripción detallada */}
        <div>
          <h4 className="font-serif text-sm font-bold text-loma-green mb-1.5">
            Detalle de la situación:
          </h4>
          <p className="text-gray-700 leading-relaxed bg-[#faf9f5] p-3.5 rounded-2xl border border-gray-100 text-xs sm:text-sm whitespace-pre-line">
            {punto.descripcion}
          </p>
        </div>

        {/* Botones de acción principales */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          {punto.contacto && (
            <a
              href={formatWhatsAppUrl(punto.contacto, punto.titulo)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar WhatsApp</span>
            </a>
          )}

          <button
            onClick={handleToggleResolve}
            disabled={resolving}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
              resuelto
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{resuelto ? 'Reabrir Situación' : 'Marcar Resuelto'}</span>
          </button>
        </div>

        {/* HILO DE COMENTARIOS VECINALES (Estilo Google Maps) */}
        <div className="border-t border-gray-200 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-loma-green flex items-center gap-1.5">
              <span>Aportes y Comentarios del Barrio</span>
              <span className="bg-loma-accent/20 text-loma-accent text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {comentarios.length}
              </span>
            </h4>
          </div>

          {/* Listado de comentarios */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {comentarios.length > 0 ? (
              comentarios.map((c) => (
                <div key={c.id} className="bg-[#faf9f5] p-3 rounded-xl border border-gray-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-loma-green flex items-center gap-1">
                      <User className="w-3 h-3 text-loma-wood" />
                      {c.autorNombre}
                    </span>
                    <span className="text-gray-400 text-[10px]">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-snug">{c.texto}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-4 text-xs">
                Aún no hay comentarios en este punto. ¡Sé el primero en aportar datos o novedades!
              </p>
            )}
          </div>

          {/* Formulario para agregar comentario */}
          <form onSubmit={handleAddComment} className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/60 space-y-2.5">
            <span className="text-[11px] font-bold text-loma-green block">
              💬 Dejar un comentario o actualización:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Tu Nombre..."
                value={autorComentario}
                onChange={(e) => setAutorComentario(e.target.value)}
                className="p-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-loma-accent"
              />
              <input
                type="text"
                placeholder="Contacto (Opcional)..."
                value={contactoComentario}
                onChange={(e) => setContactoComentario(e.target.value)}
                className="p-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-loma-accent"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Escribe tu mensaje aquí..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-loma-accent"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-loma-green hover:bg-loma-wood text-white px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
