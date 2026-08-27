import React, { useState } from 'react';
import { Moon, ShieldCheck, X, KeyRound } from 'lucide-react';

export default function CRMLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Clave incorrecta.');

      localStorage.setItem('adminLunarKey', data.adminKey || clave);
      onLoginSuccess(data.adminKey || clave);
      onClose();
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
        className="bg-white border-2 border-loma-green p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-loma-accent flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner border border-amber-300">
            🌕
          </div>
          <h3 className="font-serif text-2xl font-bold text-loma-green">
            Acceso Lunar CRM
          </h3>
          <p className="text-xs text-loma-wood font-semibold mt-1">
            Ingresa la clave de administración comunitaria.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-200 text-xs font-bold mb-4 text-center">
            🚨 {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Clave lunar..."
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-300 bg-[#faf9f5] text-sm focus:outline-none focus:border-loma-accent text-center font-bold tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-loma-green hover:bg-loma-wood text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Verificando...' : 'Desbloquear CRM'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
