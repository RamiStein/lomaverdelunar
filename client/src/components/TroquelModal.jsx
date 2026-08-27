import React, { useState } from 'react';
import { QrCode, Coins, X, CheckCircle, HeartHandshake, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function TroquelModal({ isOpen, onClose, userVoucher, setUserVoucher }) {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    monto: '20000',
    tipoAporte: '🌿 Aporte Brote'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleMontoChange = (e) => {
    const val = e.target.value;
    let tipo = '🌱 Aporte Semilla';
    if (val === '20000') tipo = '🌿 Aporte Brote';
    if (val === '30000') tipo = '🌸 Aporte Flor';
    if (val === '50000') tipo = '🍎 Aporte Fruto';
    if (val === '100000') tipo = '🌳 Aporte Árbol';
    setForm({ ...form, monto: val, tipoAporte: tipo });
  };

  const handleGenerar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          telefono: form.telefono,
          monto: form.monto,
          tipoAporte: form.tipoAporte
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar el troquel.');

      setUserVoucher(data.voucher);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-loma-bg border-3 border-loma-accent p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-black/5"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Badge superior */}
        <div className="text-center mb-4">
          <span className="bg-loma-accent text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider inline-block">
            ECONOMÍA FRATERNA LOMA VERDE
          </span>
          <h2 className="font-serif text-2xl font-bold text-loma-green mt-2">
            {userVoucher ? 'Tu Troquel Digital' : 'Generar Troquel de Aporte'}
          </h2>
          <p className="text-xs text-loma-wood font-semibold mt-0.5">
            Moneda comunitaria para el intercambio fraterno.
          </p>
        </div>

        {userVoucher ? (
          /* Vista del Troquel Generado con QR */
          <div className="space-y-4 text-center animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-loma-accent shadow-sm flex flex-col items-center">
              <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-xs mb-3">
                <QRCodeSVG value={`TROQUEL:${userVoucher.idTroquel}`} size={140} />
              </div>

              <span className="text-xs font-bold text-loma-wood uppercase tracking-widest block">
                NÚMERO DE TROQUEL:
              </span>
              <div className="font-serif text-3xl font-black text-loma-accent tracking-widest my-1">
                {userVoucher.idTroquel}
              </div>

              <div className="text-xs text-gray-600">
                Titular: <strong>{userVoucher.compradorNombre}</strong>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 w-full flex justify-between items-center text-sm font-bold">
                <span className="text-gray-500 text-xs uppercase">Saldo Disponible:</span>
                <span className="font-serif text-xl text-green-700 font-extrabold">
                  ${userVoucher.saldoActual.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed px-4">
              Muestra este código QR o tu número <strong>#{userVoucher.idTroquel}</strong> a los feriantes para canjear tus productos en la plaza.
            </p>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full bg-loma-green hover:bg-loma-wood text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow transition-all"
              >
                Entrar al Mercado de Virtudes
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de Emisión */
          <form onSubmit={handleGenerar} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold">
                🚨 {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                Familia / Tu Nombre *
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Familia García Gómez"
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-loma-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                WhatsApp de Contacto *
              </label>
              <input
                type="tel"
                required
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="Ej: 1122334455"
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-loma-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-loma-wood uppercase mb-1">
                Monto de Aporte Fraterno:
              </label>
              <select
                value={form.monto}
                onChange={handleMontoChange}
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-loma-green focus:outline-none focus:border-loma-accent"
              >
                <option value="10000">🌱 Aporte Semilla - $10.000</option>
                <option value="20000">🌿 Aporte Brote - $20.000</option>
                <option value="30000">🌸 Aporte Flor - $30.000</option>
                <option value="50000">🍎 Aporte Fruto - $50.000</option>
                <option value="100000">🌳 Aporte Árbol - $100.000</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                <span>{loading ? 'Generando Troquel...' : 'Generar mi Troquel'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
