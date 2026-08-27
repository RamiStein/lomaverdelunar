import React from 'react';
import { Receipt, FileText, CheckCircle, ExternalLink, TrendingDown, DollarSign } from 'lucide-react';

export default function ContabilidadView({ contabilidadData }) {
  const gastos = contabilidadData?.gastos || [];
  const totalGastado = contabilidadData?.totalGastado || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Cabecera Principal */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-loma-green text-center shadow-[6px_6px_0px_rgba(43,83,41,0.1)] mb-10">
        <span className="bg-loma-wood/20 text-loma-wood font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-3">
          <Receipt className="w-4 h-4" /> Cuentas Claras
        </span>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-loma-green uppercase tracking-tight">
          Transparencia y Economía Abierta 📊
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
          Publicamos el detalle contable de todos los gastos e inversiones realizadas con el fondo comunitario para la plaza. Cada peso cuenta.
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-loma-wood shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6 border-b border-loma-wood/20 pb-4">
          <h2 className="font-serif text-2xl font-bold text-loma-green">
            Registro de Egresos Comunitarios
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
