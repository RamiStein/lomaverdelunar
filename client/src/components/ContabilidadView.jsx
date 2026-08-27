import React from 'react';
import { Receipt, FileText, CheckCircle, ExternalLink, TrendingDown, DollarSign, Lock, ShieldCheck, ArrowRight, HandHeart } from 'lucide-react';

export default function ContabilidadView({ contabilidadData, isAdmin, openLoginModal, setActiveTab }) {
  const gastos = contabilidadData?.gastos || [];
  const totalGastado = contabilidadData?.totalGastado || 0;

  // Si no está logueado como Admin/Asociado, mostramos el acceso protegido
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)]">
          <div className="w-16 h-16 rounded-full bg-loma-wood/20 text-loma-green flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <span className="bg-loma-wood/20 text-loma-wood font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
            <Receipt className="w-4 h-4" /> Rendición de Cuentas
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-loma-green uppercase tracking-tight mb-4">
            Transparencia y Economía Comunitaria 📊
          </h1>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
            La rendición contable detallada de egresos, facturas públicas y balances se comparte internamente con los <strong>vecinos asociados</strong> y el equipo de gestión en asamblea.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={openLoginModal}
              className="w-full sm:w-auto bg-loma-green hover:bg-loma-wood text-white px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>Ingresar con Clave Lunar</span>
            </button>

            <button
              onClick={() => setActiveTab('presupuesto')}
              className="w-full sm:w-auto bg-white hover:bg-loma-bg text-loma-green border-2 border-loma-green px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-xs hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <HandHeart className="w-5 h-5 text-loma-accent" />
              <span>Sumarme como Vecino Asociado</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
            ¿Quieres ser parte del equipo de gestión y asamblea? Déjanos tus datos en la sección de Presupuesto.
          </div>
        </div>
      </div>
    );
  }

  // Vista Completa para Administradores y Vecinos Asociados logueados
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Cabecera Principal */}
      <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <span className="bg-loma-wood/20 text-loma-wood font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
          <ShieldCheck className="w-4 h-4" /> Vista Autenticada de Gestión
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-loma-green uppercase tracking-tight">
          Balance y Rendición de Egresos 📊
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
          Registro detallado de egresos, comprobantes y facturas cargadas en la plataforma comunitaria.
        </p>

        {/* Total Gastado Card */}
        <div className="my-8 max-w-sm mx-auto bg-red-50/80 border-2 border-red-200 p-6 rounded-2xl shadow-xs">
          <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider block mb-1">
            Total Invertido Hasta Ahora
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-red-600">
            ${totalGastado.toLocaleString('es-AR')}
          </div>
        </div>
      </div>

      {/* Tabla de Egresos */}
      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border-2 border-loma-green shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6 border-b border-loma-wood/20 pb-4">
          <h2 className="font-serif text-2xl font-bold text-loma-green">
            Registro de Comprobantes
          </h2>
          <span className="text-xs font-bold text-loma-wood bg-loma-wood/15 px-3 py-1 rounded-full">
            {gastos.length} comprobantes
          </span>
        </div>

        {gastos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-loma-wood bg-loma-wood text-white font-serif">
                  <th className="p-3.5 rounded-l-xl">Fecha</th>
                  <th className="p-3.5">Detalle del Gasto</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Monto ($)</th>
                  <th className="p-3.5 rounded-r-xl">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gastos.map((g) => (
                  <tr key={g.id} className="hover:bg-loma-bg/60 transition-colors">
                    <td className="p-3.5 text-gray-500 font-mono text-xs whitespace-nowrap">
                      {g.fecha}
                    </td>
                    <td className="p-3.5 font-bold text-loma-green">
                      {g.detalle}
                    </td>
                    <td className="p-3.5 text-xs">
                      <span className="bg-loma-bg px-2.5 py-1 rounded-md text-loma-wood font-semibold border border-loma-wood/20">
                        {g.categoria || 'General'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-red-600 font-mono">
                      ${g.montoNum ? g.montoNum.toLocaleString('es-AR') : g.montoStr}
                    </td>
                    <td className="p-3.5">
                      {g.comprobante ? (
                        <a
                          href={g.comprobante}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-loma-accent hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver Factura</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No adjunto</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            Aún no se han registrado egresos en este ciclo lunar.
          </div>
        )}
      </div>

    </div>
  );
}
