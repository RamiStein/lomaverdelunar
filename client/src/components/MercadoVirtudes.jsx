import React, { useState, useEffect } from 'react';
import { Coins, Sparkles, PlusCircle, CheckCircle, HeartHandshake, QrCode, X, Search } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MercadoVirtudes({ 
  virtudes, 
  userVoucher, 
  setUserVoucher, 
  openTroquelModal, 
  onIntercambioDone,
  onPublicarDone 
}) {
  const [selectedVirtud, setSelectedVirtud] = useState(null);
  const [inputTroquel, setInputTroquel] = useState(userVoucher?.idTroquel || '');
  const [canjeLoading, setCanjeLoading] = useState(false);
  const [canjeResult, setCanjeResult] = useState(null);
  const [canjeError, setCanjeError] = useState(null);

  // Form publicar virtud
  const [showPublicar, setShowPublicar] = useState(false);
  const [pubForm, setPubForm] = useState({
    oferente: '',
    descripcion: '',
    valor: 4000,
    stock: 3,
    categoria: 'Gastronomía'
  });
  const [pubLoading, setPubLoading] = useState(false);

  // Filter & Search
  const [filterCat, setFilterCat] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Update inputTroquel when userVoucher changes
  useEffect(() => {
    if (userVoucher?.idTroquel) {
      setInputTroquel(userVoucher.idTroquel);
    }
  }, [userVoucher]);

  const disponibles = (virtudes || []).filter(v => v.estado === 'Disponible' && v.stock > 0);
  const intercambiadas = (virtudes || []).filter(v => v.estado !== 'Disponible' || v.stock <= 0);

  const filteredDisponibles = disponibles.filter(v => {
    const matchesCat = filterCat === 'TODOS' || v.categoria === filterCat;
    const matchesSearch = !searchTerm.trim() || 
      v.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.oferente.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCanjearSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVirtud || !inputTroquel) return;
    setCanjeLoading(true);
    setCanjeError(null);
    setCanjeResult(null);

    try {
      const res = await fetch('/api/intercambios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTroquel: inputTroquel,
          idVirtud: selectedVirtud.id
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar el canje.');

      setCanjeResult(data);
      // Update local voucher if matches
      if (userVoucher && userVoucher.idTroquel === inputTroquel) {
        setUserVoucher({ ...userVoucher, saldoActual: data.saldoRestante });
      }
      if (onIntercambioDone) onIntercambioDone();
    } catch (err) {
      setCanjeError(err.message);
    } finally {
      setCanjeLoading(false);
    }
  };

  const handlePublicarSubmit = async (e) => {
    e.preventDefault();
    setPubLoading(true);
    try {
      const res = await fetch('/api/virtudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pubForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al publicar la virtud.');

      alert(data.mensaje || '¡Virtud publicada en el Mercado con éxito!');
      setShowPublicar(false);
      setPubForm({
        oferente: '',
        descripcion: '',
        valor: 4000,
        stock: 3,
        categoria: 'Gastronomía'
      });
      if (onPublicarDone) onPublicarDone();
    } catch (err) {
      alert(err.message);
    } finally {
      setPubLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Cabecera Header Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <span className="bg-loma-accent/20 text-loma-accent font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
          <Coins className="w-4 h-4" /> Economía Fraterna 13:20
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-loma-green uppercase tracking-tight">
          Mercado de Virtudes & Saberes 🍯
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
          Espacio de trueque y economía solidaria de Loma Verde. Canjea tus troqueles por alimentos orgánicos, plantines, terapias y artesanías de los vecinos.
        </p>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={openTroquelModal}
            className="bg-loma-accent hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2 active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>{userVoucher ? `Mi Troquel (${userVoucher.idTroquel} - Saldo $${userVoucher.saldoActual.toLocaleString('es-AR')})` : 'Generar / Ver mi Troquel'}</span>
          </button>

          <button
            onClick={() => setShowPublicar(!showPublicar)}
            className="bg-loma-green hover:bg-loma-wood text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Soy Feriante: Publicar Producto</span>
          </button>
        </div>
      </div>

      {/* Billetera de Troquel Activa (Si el usuario ya generó uno) */}
      {userVoucher && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-amber-500/10 border-2 border-loma-accent p-6 rounded-3xl mb-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white p-2 rounded-2xl border-2 border-loma-accent shadow-sm flex-shrink-0">
              <QRCodeSVG value={`TROQUEL:${userVoucher.idTroquel}`} size={80} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-loma-accent text-white px-2.5 py-0.5 rounded-full">
                {userVoucher.tipoAporte || 'Troquel Activo'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-loma-green mt-1">
                Troquel #{userVoucher.idTroquel}
              </h3>
              <p className="text-xs font-bold text-loma-wood">
                Familia / Titular: {userVoucher.compradorNombre}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-white/80 backdrop-blur-xs px-6 py-3 rounded-2xl border border-loma-accent/30">
            <span className="text-xs font-bold text-loma-wood uppercase tracking-wider block">
              Saldo Disponible
            </span>
            <span className="font-serif text-3xl font-extrabold text-loma-accent">
              ${userVoucher.saldoActual.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      )}

      {/* Formulario Desplegable: Publicar Virtud */}
      {showPublicar && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-loma-green shadow-lg mb-10 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-loma-wood/20 pb-3">
            <h3 className="font-serif text-xl font-bold text-loma-green flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-loma-accent" />
              <span>Publicar Producto o Virtud en el Mercado</span>
            </h3>
            <button 
              onClick={() => setShowPublicar(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePublicarSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                  Nombre del Oferente / Emprendimiento *
                </label>
                <input
                  type="text"
                  required
                  value={pubForm.oferente}
                  onChange={(e) => setPubForm({ ...pubForm, oferente: e.target.value })}
                  placeholder="Ej: Huerta El Trébol"
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={pubForm.categoria}
                  onChange={(e) => setPubForm({ ...pubForm, categoria: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm font-semibold focus:outline-none focus:border-loma-accent"
                >
                  <option value="Gastronomía">Gastronomía</option>
                  <option value="Artesanías">Artesanías</option>
                  <option value="Huerta">Huerta & Plantas</option>
                  <option value="Terapias Holísticas">Terapias Holísticas</option>
                  <option value="Productos Naturales">Productos Naturales</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                Descripción del Producto o Virtud *
              </label>
              <textarea
                required
                rows={2}
                value={pubForm.descripcion}
                onChange={(e) => setPubForm({ ...pubForm, descripcion: e.target.value })}
                placeholder="Ej: Miel de monte agroecológica (500g)..."
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                  Valor ($ Troquel) *
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  required
                  value={pubForm.valor}
                  onChange={(e) => setPubForm({ ...pubForm, valor: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm font-bold text-loma-accent focus:outline-none focus:border-loma-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                  Stock Inicial (Unidades) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={pubForm.stock}
                  onChange={(e) => setPubForm({ ...pubForm, stock: parseInt(e.target.value, 10) })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPublicar(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pubLoading}
                className="bg-loma-green hover:bg-loma-wood text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-all"
              >
                {pubLoading ? 'Publicando...' : 'Publicar en el Catálogo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros de Virtudes */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-loma-accent" />
          <h2 className="font-serif text-2xl font-bold text-loma-green">
            Virtudes Disponibles para Canje ✨
          </h2>
          <span className="text-xs font-bold bg-loma-accent/20 text-loma-accent px-2.5 py-0.5 rounded-full">
            {filteredDisponibles.length}
          </span>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar virtud..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-loma-accent"
          />
        </div>
      </div>

      {/* Grid de Virtudes Disponibles */}
      {filteredDisponibles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredDisponibles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl border-2 border-loma-green p-6 shadow-[5px_5px_0px_rgba(43,83,41,0.12)] hover:-translate-y-1 hover:border-loma-accent hover:shadow-[7px_7px_0px_rgba(196,140,38,0.25)] transition-all flex flex-col justify-between relative"
            >
              {/* Badge Stock Hexagonal */}
              <div className="absolute -top-3 right-4 bg-loma-accent text-white font-bold w-12 h-12 hex-badge flex flex-col items-center justify-center text-[10px] leading-tight shadow-md">
                <span>STOCK</span>
                <strong className="font-serif text-base">{v.stock}</strong>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase bg-loma-wood/15 text-loma-wood px-2 py-0.5 rounded-md inline-block mb-2">
                  {v.categoria || 'Economía Fraterna'}
                </span>

                <h3 className="font-serif text-lg font-bold text-loma-green leading-snug pr-10 mb-1">
                  {v.descripcion}
                </h3>

                <p className="text-xs font-bold text-loma-wood mb-4">
                  Ofrece: {v.oferente}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="font-serif text-2xl font-black text-loma-accent mb-3">
                  ${v.valor.toLocaleString('es-AR')}
                </div>

                <button
                  onClick={() => {
                    setSelectedVirtud(v);
                    setCanjeResult(null);
                    setCanjeError(null);
                  }}
                  className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>CANJEAR CON TROQUEL</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-loma-wood text-center text-gray-500 italic max-w-md mx-auto mb-16">
          No hay virtudes disponibles con los filtros actuales.
        </div>
      )}

      {/* Sección de Virtudes ya Intercambiadas */}
      {intercambiadas.length > 0 && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-loma-wood/30">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="w-5 h-5 text-loma-wood" />
            <h2 className="font-serif text-2xl font-bold text-loma-wood">
              Ya Fluyeron en la Comunidad 🌿
            </h2>
            <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full">
              {intercambiadas.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {intercambiadas.map((v) => (
              <div
                key={v.id}
                className="bg-gray-100 rounded-3xl border border-gray-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-base font-bold text-gray-700 mb-1 line-through">
                    {v.descripcion}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Ofreció: {v.oferente}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="font-serif font-bold text-gray-500 line-through">
                    ${v.valor.toLocaleString('es-AR')}
                  </span>
                  <span className="bg-gray-400 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                    INTERCAMBIADA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Canje de Virtud */}
      {selectedVirtud && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVirtud(null)}
        >
          <div 
            className="bg-loma-bg border-3 border-loma-accent p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVirtud(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-loma-green text-center mb-1">
              Canjear Virtud 🍯
            </h3>
            <p className="text-xs text-center text-loma-wood font-semibold mb-4">
              Ingresa el número de tu troquel para descontar el intercambio.
            </p>

            {/* Resumen del Producto */}
            <div className="bg-white p-4 rounded-2xl border border-loma-accent/30 text-center mb-6">
              <span className="text-xs text-gray-500 uppercase block mb-1">Producto a recibir:</span>
              <strong className="font-serif text-lg text-loma-green block">{selectedVirtud.descripcion}</strong>
              <span className="text-xs text-loma-wood block mt-0.5">De: {selectedVirtud.oferente}</span>
              <div className="mt-2 text-2xl font-black text-loma-accent font-serif">
                ${selectedVirtud.valor.toLocaleString('es-AR')}
              </div>
            </div>

            {canjeResult ? (
              <div className="bg-green-50 border-2 border-green-500 text-green-800 p-6 rounded-2xl text-center animate-fadeIn">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h4 className="font-serif text-xl font-bold text-green-900 mb-1">
                  ¡Intercambio Realizado!
                </h4>
                <p className="text-sm leading-relaxed mb-3">
                  {canjeResult.mensaje}
                </p>
                <div className="bg-white p-3 rounded-xl border border-green-300 font-mono text-sm font-bold text-green-900 mb-4">
                  Saldo Restante: ${canjeResult.saldoRestante.toLocaleString('es-AR')}
                </div>
                <button
                  onClick={() => setSelectedVirtud(null)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow"
                >
                  Volver al Mercado
                </button>
              </div>
            ) : (
              <form onSubmit={handleCanjearSubmit} className="space-y-4">
                {canjeError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold">
                    🚨 {canjeError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-loma-wood uppercase text-center mb-1">
                    Número de Troquel Comunitario
                  </label>
                  <input
                    type="text"
                    required
                    value={inputTroquel}
                    onChange={(e) => setInputTroquel(e.target.value)}
                    placeholder="Ej: 136901"
                    className="w-full p-4 rounded-xl border-2 border-loma-green bg-white text-center font-mono font-black text-2xl text-loma-green tracking-widest focus:outline-none focus:border-loma-accent"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={canjeLoading}
                    className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {canjeLoading ? 'Verificando en la red...' : 'CONFIRMAR CANJE'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVirtud(null)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
