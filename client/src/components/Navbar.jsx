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
  X,
  UserPlus,
  MapPin
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAdmin, openLoginModal, openTroquelModal, config }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Menú público principal: limpio, esencial y directo
  const coreNavItems = [
    { id: 'inicio', label: 'Inicio', icon: Sparkles },
    { id: 'mapa', label: 'Mapa Vecinal', icon: MapPin },
    { id: 'feria', label: 'La Feria', icon: Store },
    { id: 'escenario', label: 'Escenario', icon: Music },
    { id: 'directorio', label: 'Directorio', icon: BookOpen },
  ];

  // Si se accede directamente a una sección pausada o es admin, la mostramos contextual
  const extraNavItems = [];
  if (activeTab === 'presupuesto' || isAdmin) {
    extraNavItems.push({ id: 'presupuesto', label: 'Presupuesto', icon: Vote });
  }
  if (activeTab === 'flyer-studio' || isAdmin) {
    extraNavItems.push({ id: 'flyer-studio', label: 'Flyer Studio', icon: ImageIcon });
  }
  if (activeTab === 'contabilidad' || isAdmin) {
    extraNavItems.push({ id: 'contabilidad', label: 'Transparencia', icon: Receipt });
  }
  if (activeTab === 'virtudes' || isAdmin) {
    extraNavItems.push({ id: 'virtudes', label: 'Virtudes', icon: Coins, highlight: true });
  }

  const navItems = [...coreNavItems, ...extraNavItems];

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
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
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
            
            {/* Botón rápido para participar */}
            <button
              onClick={() => {
                setActiveTab('feria');
                setTimeout(() => {
                  const el = document.getElementById('seccion-inscripcion');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-loma-green hover:bg-loma-wood text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-300" />
              <span>Participar</span>
            </button>

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
              className="lg:hidden p-2 text-loma-green hover:bg-loma-wood/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-loma-green px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
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
        </div>
      )}
    </nav>
  );
}
