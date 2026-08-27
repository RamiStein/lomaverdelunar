import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeriaSection from './components/FeriaSection';
import EscenarioSection from './components/EscenarioSection';
import InscripcionForm from './components/InscripcionForm';
import FlyerStudio from './components/FlyerStudio';
import DirectorioView from './components/DirectorioView';
import PresupuestoView from './components/PresupuestoView';
import ContabilidadView from './components/ContabilidadView';
import MercadoVirtudes from './components/MercadoVirtudes';
import TroquelModal from './components/TroquelModal';
import CRMLoginModal from './components/CRM/CRMLoginModal';
import CRMDashboard from './components/CRM/CRMDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [troquelModalOpen, setTroquelModalOpen] = useState(false);
  const [flyerData, setFlyerData] = useState(null);

  // App Data
  const [config, setConfig] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [directorio, setDirectorio] = useState({});
  const [presupuesto, setPresupuesto] = useState(null);
  const [virtudes, setVirtudes] = useState([]);
  const [contabilidad, setContabilidad] = useState({ gastos: [], totalGastado: 0 });

  // User Local Voucher State
  const [userVoucher, setUserVoucher] = useState(() => {
    try {
      const saved = localStorage.getItem('userVoucherLunar');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Check saved admin session
  useEffect(() => {
    const savedKey = localStorage.getItem('adminLunarKey');
    if (savedKey === 'lomaverde') {
      setIsAdmin(true);
      setAdminKey(savedKey);
    }
  }, []);

  // Save voucher in local storage
  useEffect(() => {
    if (userVoucher) {
      localStorage.setItem('userVoucherLunar', JSON.stringify(userVoucher));
    }
  }, [userVoucher]);

  // Load all public initial data
  const loadGlobalData = async () => {
    try {
      const [conf, not, dir, pres, virt, cont] = await Promise.all([
        fetch('/api/config').then(r => r.json()),
        fetch('/api/noticias').then(r => r.json()),
        fetch('/api/directorio').then(r => r.json()),
        fetch('/api/presupuesto').then(r => r.json()),
        fetch('/api/virtudes').then(r => r.json()),
        fetch('/api/contabilidad').then(r => r.json())
      ]);

      setConfig(conf);
      setNoticias(not);
      setDirectorio(dir);
      setPresupuesto(pres);
      setVirtudes(virt);
      setContabilidad(cont);
    } catch (err) {
      console.error('Error cargando datos globales:', err);
    }
  };

  useEffect(() => {
    loadGlobalData();
  }, []);

  const handleAdminLogin = (key) => {
    setIsAdmin(true);
    setAdminKey(key);
    setActiveTab('crm');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLunarKey');
    setIsAdmin(false);
    setAdminKey('');
    setActiveTab('inicio');
  };

  const handleGoToFlyerStudio = (data) => {
    setFlyerData(data);
    setActiveTab('flyer-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-transparent text-loma-green selection:bg-loma-accent selection:text-white">
      
      {/* 1. Barra de Navegación Sticky */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        openLoginModal={() => setLoginModalOpen(true)}
        openTroquelModal={() => setTroquelModalOpen(true)}
        config={config}
      />

      {/* 2. Contenido según pestaña activa */}
      <main className="flex-1">
        {activeTab === 'inicio' && (
          <div>
            <HeroSection
              config={config}
              noticias={noticias}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              openTroquelModal={() => setTroquelModalOpen(true)}
            />

            {/* Muestra de la Feria en Inicio */}
            <div className="bg-white/80 border-y-2 border-loma-green/20 py-8 my-8">
              <FeriaSection
                directorio={directorio}
                onOpenInscripcion={() => {
                  const formEl = document.getElementById('seccion-inscripcion');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* Escenario en Inicio */}
            <div className="my-8">
              <EscenarioSection directorio={directorio} />
            </div>

            {/* Formulario de Inscripción en Inicio */}
            <div id="seccion-inscripcion" className="my-12 px-4">
              <InscripcionForm
                config={config}
                onSuccess={loadGlobalData}
                onGoToFlyerStudio={handleGoToFlyerStudio}
              />
            </div>
          </div>
        )}

        {activeTab === 'feria' && (
          <div className="py-6">
            <FeriaSection
              directorio={directorio}
              onOpenInscripcion={() => {
                setActiveTab('inicio');
                setTimeout(() => {
                  const formEl = document.getElementById('seccion-inscripcion');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          </div>
        )}

        {activeTab === 'escenario' && (
          <div className="py-6">
            <EscenarioSection directorio={directorio} />
          </div>
        )}

        {activeTab === 'directorio' && (
          <div className="py-6">
            <DirectorioView directorio={directorio} />
          </div>
        )}

        {activeTab === 'presupuesto' && (
          <div className="py-6">
            <PresupuestoView
              presupuestoData={presupuesto}
              onVoteSubmitted={loadGlobalData}
              onVolunteerSubmitted={loadGlobalData}
            />
          </div>
        )}

        {activeTab === 'virtudes' && (
          <div className="py-6">
            <MercadoVirtudes
              virtudes={virtudes}
              userVoucher={userVoucher}
              setUserVoucher={setUserVoucher}
              openTroquelModal={() => setTroquelModalOpen(true)}
              onIntercambioDone={loadGlobalData}
              onPublicarDone={loadGlobalData}
            />
          </div>
        )}

        {activeTab === 'flyer-studio' && (
          <div className="py-6">
            <FlyerStudio
              initialData={flyerData || {}}
              config={config}
              onSaved={loadGlobalData}
            />
          </div>
        )}

        {activeTab === 'contabilidad' && (
          <div className="py-6">
            <ContabilidadView contabilidadData={contabilidad} />
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="py-6">
            <CRMDashboard
              adminKey={adminKey}
              onLogout={handleAdminLogout}
              refreshGlobalData={loadGlobalData}
            />
          </div>
        )}
      </main>

      {/* 3. Footer Oficial Loma Verde */}
      <footer className="bg-loma-green text-white border-t-4 border-loma-accent py-12 px-4 mt-16 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-loma-wood border-2 border-amber-400 mx-auto flex items-center justify-center text-2xl">
            ♒
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-wide">
            {config?.quienesSomos?.titulo || 'Loma Verde Lunar'}
          </h3>
          <p className="text-gray-200 text-sm max-w-lg mx-auto leading-relaxed">
            {config?.quienesSomos?.texto || 'Tejiendo redes comunitarias, economía fraterna y soberanía vecinal en armonía con la naturaleza.'}
          </p>

          <div className="pt-6 border-t border-loma-wood/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
            <span>Encuentro Lunar 13:20 • Loma Verde - Escobar</span>
            <button
              onClick={() => {
                if (isAdmin) setActiveTab('crm');
                else setLoginModalOpen(true);
              }}
              className="text-amber-300 hover:text-amber-200 uppercase font-bold tracking-widest text-[10px]"
            >
              🌙 {isAdmin ? 'Abrir Panel CRM' : 'Acceso de Coordinación'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modales Globales */}
      <TroquelModal
        isOpen={troquelModalOpen}
        onClose={() => setTroquelModalOpen(false)}
        userVoucher={userVoucher}
        setUserVoucher={setUserVoucher}
      />

      <CRMLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleAdminLogin}
      />

    </div>
  );
}
