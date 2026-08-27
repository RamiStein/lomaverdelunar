import React from 'react';
import { 
  Sparkles, 
  Store, 
  Music, 
  BookOpen, 
  Vote, 
  Coins, 
  Receipt, 
  Image as ImageIcon, 
  ShieldCheck, 
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAdmin, setIsAdmin, openLoginModal, openTroquelModal, config, showMercado }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const baseNavItems = [
    { id: 'inicio', label: 'Inicio', icon: Sparkles },
    { id: 'feria', label: 'La Feria', icon: Store },
    { id: 'escenario', label: 'Escenario', icon: Music },
    { id: 'directorio', label: 'Directorio', icon: BookOpen },
    { id: 'presupuesto', label: 'Presupuesto', icon: Vote },
    { id: 'flyer-studio', label: 'Flyer Studio', icon: ImageIcon },
    { id: 'contabilidad', label: 'Transparencia', icon: Receipt },
  ];

  // Si está en modo mercado o admin, se agrega Virtudes
  const navItems = showMercado
    ? [
        ...baseNavItems.slice(0, 4),
        { id: 'virtudes', label: 'Mercado de Virtudes', icon: Coins, highlight: true },
        ...baseNavItems.slice(4)
      ]
    : baseNavItems;

  return (
    <nav className="bg-loma-bg/95 backdrop-blur-md sticky top-0 z-40 border-b-2 border-loma-green shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          
          {/* Logo y Nombre */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => { setActiveTab('inicio'); setMobileMenuOpen(false); }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-loma-wood border-2 border-loma-green flex items-center justify-center text-lg sm:text-xl text-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              {config?.signo === 'Piscis' ? '♓' : (config?.signo === 'Acuario' ? '♒' : (config?.signo === 'Aries' ? '♈' : '🌙'))}
            </div>
            <div className="whitespace-nowrap">
              <span className="font-serif font-bold text-base sm:text-lg text-loma-green tracking-wide block leading-none">
                {config?.quienesSomos?.titulo || 'Loma Verde Lunar'}
              </span>
              <span className="text-[10px] font-extrabold text-loma-wood uppercase tracking-wider block mt-0.5">
                {config?.signo ? `Luna en ${config.signo}` : 'Frecuencia 13:20'}
              </span>
            </div>
          </div>

          {/* Enlaces Desktop */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-loma-green text-white shadow-sm'
                      : item.highlight
                      ? 'bg-loma-accent/15 text-loma-accent border border-loma-accent/40 hover:bg-loma-accent hover:text-white'
                      : 'text-loma-green hover:bg-loma-wood/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Botones Derecha */}
          <div className="flex items-center gap-2">
            {showMercado && (
              <button
                onClick={openTroquelModal}
                className="hidden sm:flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                title="Billetera de Troqueles"
              >
                <span>🎫</span>
                <span className="hidden md:inline">Troquel</span>
              </button>
            )}

            {/* Acceso CRM Admin */}
            {isAdmin ? (
              <button
                onClick={() => setActiveTab('crm')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'crm'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-loma-wood/20 text-loma-green hover:bg-loma-wood/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-loma-accent" />
                <span className="hidden sm:inline">Panel CRM</span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="p-2 text-loma-green/50 hover:text-loma-green hover:bg-loma-wood/10 rounded-lg transition-colors"
                title="Acceso Gestión Vecinal"
              >
                <Moon className="w-4 h-4" />
              </button>
            )}

            {/* Botón Menú Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-loma-green hover:bg-loma-wood/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-loma-green px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-loma-green text-white'
                    : item.highlight
                    ? 'bg-amber-50 text-loma-accent border border-loma-accent/30'
                    : 'text-loma-green hover:bg-loma-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {showMercado && (
            <div className="pt-3 border-t border-gray-200 mt-2">
              <button
                onClick={() => {
                  openTroquelModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                <span>🎫 Billetera de Troqueles</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
