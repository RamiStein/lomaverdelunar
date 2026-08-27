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

export default function Navbar({ activeTab, setActiveTab, isAdmin, setIsAdmin, openLoginModal, openTroquelModal, config }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Sparkles },
    { id: 'feria', label: 'La Feria', icon: Store },
    { id: 'escenario', label: 'Escenario', icon: Music },
    { id: 'directorio', label: 'Directorio', icon: BookOpen },
    { id: 'presupuesto', label: 'Presupuesto', icon: Vote },
    { id: 'virtudes', label: 'Virtudes', icon: Coins, highlight: true },
    { id: 'flyer-studio', label: 'Flyer Studio', icon: ImageIcon },
    { id: 'contabilidad', label: 'Transparencia', icon: Receipt },
  ];

  return (
    <nav className="bg-loma-bg/95 backdrop-blur-md sticky top-0 z-40 border-b-2 border-loma-green shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          
          {/* Logo y Nombre (Nunca se rompe en líneas) */}
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

          {/* Enlaces Desktop (Compactos y limpios con whitespace-nowrap) */}
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
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Enlaces para pantallas medianas (LG: 1024px a 1280px) */}
          <div className="hidden lg:flex xl:hidden items-center gap-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-loma-green text-white shadow-sm'
                      : 'text-loma-green hover:bg-loma-wood/10'
                  }`}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setActiveTab('virtudes')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'virtudes'
                  ? 'bg-loma-accent text-white'
                  : 'bg-loma-accent/15 text-loma-accent border border-loma-accent/40'
              }`}
            >
              <Coins className="w-3 h-3 flex-shrink-0" />
              <span>Virtudes</span>
            </button>
          </div>

          {/* Acciones de la derecha */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Botón Mi Troquel Rápido */}
            <button
              onClick={openTroquelModal}
              className="inline-flex items-center gap-1.5 bg-loma-accent text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-amber-600 transition-all active:scale-95 whitespace-nowrap"
            >
              <Coins className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Mi Troquel</span>
            </button>

            {/* Acceso Lunar / Admin */}
            {isAdmin ? (
              <button
                onClick={() => setActiveTab('crm')}
                className={`p-1.5 rounded-xl border-2 transition-all flex items-center gap-1 text-xs font-bold px-2.5 whitespace-nowrap ${
                  activeTab === 'crm' 
                    ? 'bg-amber-500 text-white border-amber-600 shadow scale-105' 
                    : 'bg-loma-wood text-white border-loma-green hover:bg-loma-green'
                }`}
                title="Panel de Control CRM"
              >
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden md:inline">CRM</span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="p-1.5 rounded-full text-loma-green/60 hover:text-loma-accent hover:scale-110 transition-all"
                title="Ingreso Administrador Lunar"
              >
                <Moon className="w-4 h-4" />
              </button>
            )}

            {/* Botón Menú Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-loma-green hover:bg-loma-wood/10"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-loma-green" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-loma-green p-4 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
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
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-loma-green text-white shadow-md'
                      : item.highlight
                      ? 'bg-loma-accent/15 text-loma-accent border border-loma-accent'
                      : 'text-loma-green hover:bg-loma-wood/10 bg-loma-bg/50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center gap-2">
            <button
              onClick={() => {
                openTroquelModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-loma-accent text-white py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Mi Troquel Comunitario</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('crm');
                  setMobileMenuOpen(false);
                }}
                className="bg-amber-500 text-white py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>CRM</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
