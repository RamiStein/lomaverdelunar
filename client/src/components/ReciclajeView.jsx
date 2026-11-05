import React, { useState, useMemo } from 'react';
import {
  Recycle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Droplets,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Package,
  Wine,
  Layers,
  HeartHandshake,
  MessageCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function ReciclajeView({ config, onBackToHome, onGoToDiario }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Lista detallada de objetos para el buscador interactivo
  const databaseObjetos = [
    // Plásticos
    {
      nombre: 'Botella de gaseosa o agua (PET)',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'Enjuagada, escurrida y aplastada con su tapa puesta para ahorrar volumen.',
      detalle: 'El plástico PET es altamente reciclable y se transforma en nuevas botellas o fibra textil.'
    },
    {
      nombre: 'Plástico sucio con grasa o comida',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'no',
      condicion: 'NO VA SUCIO. Debe estar limpio y seco.',
      detalle: 'La grasa y los restos de comida pudren los bolsones de acopio, generan malos olores y arruinan los lotes de molienda en la recicladora.'
    },
    {
      nombre: 'Pote de yogur o postre',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'SÍ VA, pero únicamente si está bien enjuagado y seco (sin restos de lácteo).',
      detalle: 'Un simple enjuague con agua residual de la bacha alcanza para no contaminar el fardo.'
    },
    {
      nombre: 'Pote de queso crema o manteca',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'SÍ VA enjuagado y seco. La grasa pegada debe removerse antes de entregar.',
      detalle: 'Pasale una esponja o servilleta usada para sacar la grasa antes de sumar a reciclables.'
    },
    {
      nombre: 'Envase de shampoo o crema',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'Enjuagado con un chorrito de agua para que no derrame líquido en el acopio.',
      detalle: 'Plástico PEAD (Polietileno de alta densidad), muy buscado por cooperativas.'
    },
    {
      nombre: 'Botella de lavandina o desinfectante',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'Completamente escurrida y sin líquido adentro.',
      detalle: 'Material PEAD reciclable. Evitar que queden restos que irriten las manos de los recuperadores.'
    },
    {
      nombre: 'Tapitas plásticas de gaseosa',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'Limpias. Podés dejarlas enroscadas en la botella aplastada o juntarlas en frasco/bolsa.',
      detalle: 'Polipropileno virgen de altísimo valor para proyectos solidarios y comunitarios.'
    },
    {
      nombre: 'Bolsitas de compras / nylon',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'si',
      condicion: 'Limpias y secas. Ideal compactarlas dentro de una Ecobotella o atarlas juntas.',
      detalle: 'Si están húmedas o con restos de verdura, deben lavarse y secarse previamente.'
    },
    {
      nombre: 'Cepillo de dientes descartable',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'no',
      condicion: 'NO es reciclable en corriente común.',
      detalle: 'Está compuesto por cerdas de nylon termoselladas con plásticos mezclados que no se separan.'
    },
    {
      nombre: 'Maquinita de afeitar descartable',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'no',
      condicion: 'NO va en reciclables secos.',
      detalle: 'Mezcla de plástico con hojas metálicas filosas no separables que presentan riesgo biológico y de corte.'
    },
    {
      nombre: 'Vajilla descartable usada (vasos / cubiertos sucios)',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'no',
      condicion: 'NO va si tiene grasa o salsa pegada.',
      detalle: 'El plástico sucio contamina todo el bolsón. Si se puede enjuagar va, pero generalmente es plástico quebradizo no recuperable.'
    },
    {
      nombre: 'Envases de pintura sintética o solventes',
      categoria: 'plastico',
      categoriaLabel: 'Plástico',
      apto: 'no',
      condicion: 'NO va en reciclables domiciliarios.',
      detalle: 'Contiene químicos tóxicos y residuos peligrosos que no deben ingresar al circuito cooperativo común.'
    },

    // Cartón y Papel
    {
      nombre: 'Cartón mojado o húmedo',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'no',
      condicion: 'NO VA MOJADO bajo ninguna circunstancia.',
      detalle: 'El agua pudre y desintegra las fibras naturales de celulosa, haciendo que el material se vuelva inservible y desarrolle hongos en los fardos.'
    },
    {
      nombre: 'Papel brillante de color / plastificado',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'no',
      condicion: 'NO es reciclable en papelera.',
      detalle: 'El papel brillante de color, metalizado o plastificado (regalos, calcomanías, volantes con barniz UV) tiene capas plásticas que impiden su disolución en agua para nueva pulpa.'
    },
    {
      nombre: 'Caja de pizza con grasa o queso pegado',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'depende',
      condicion: 'CONDICIÓN: La parte grasosa NO va. Si la tapa está limpia y seca, cortala: esa mitad SÍ va.',
      detalle: 'La grasa y el aceite son enemigos del reciclaje de celulosa porque no se mezclan con agua. La base sucia va al tacho de basura o compost.'
    },
    {
      nombre: 'Cajas de cartón corrugado',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Desarmadas, aplanadas y 100% secas.',
      detalle: 'Uno de los materiales más nobles y demandados por las cooperativas de recuperadores.'
    },
    {
      nombre: 'Cajas de cartulina (remedios, té, cereales)',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Aplanadas y secas, sin el envoltorio plástico interior.',
      detalle: 'Cartulina limpia y seca de primera calidad para reciclaje.'
    },
    {
      nombre: 'Diarios y periódicos',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Totalmente secos y atados o en bolsa seca.',
      detalle: 'Fibras vegetales reutilizables para cajas de cartón gris y aislantes.'
    },
    {
      nombre: 'Revistas comunes no plastificadas',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Hojas secas. Retirar inserts plásticos si los tuviera.',
      detalle: 'El papel ilustración común de revista es reciclable; solo el plastificado brillante grueso se descarta.'
    },
    {
      nombre: 'Hojas de resma / impresiones / cuadernos',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Secas. Retirar tapas plásticas o espirales de alambre antes de entregar.',
      detalle: 'Papel blanco de oficina: es el de mayor cotización para las papeleras cooperativas.'
    },
    {
      nombre: 'Tickets de compra de supermercado (papel térmico)',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'no',
      condicion: 'NO se recicla.',
      detalle: 'El papel térmico para tickets contiene Bisfenol A (BPA) o químicos que manchan y contaminan la pasta de reciclado.'
    },
    {
      nombre: 'Servilletas o pañuelos descartables usados',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'no',
      condicion: 'NO van en reciclables.',
      detalle: 'Tienen restos orgánicos, fluidos y grasas. Van al compost domiciliario (si no tienen químicos) o a basura común.'
    },
    {
      nombre: 'Tubos de cartón de rollo de cocina y papel higiénico',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Completamente secos.',
      detalle: 'Cartón prensado 100% reciclable.'
    },
    {
      nombre: 'Maples de huevo de cartón',
      categoria: 'carton',
      categoriaLabel: 'Cartón & Papel',
      apto: 'si',
      condicion: 'Secos y sin restos de huevo roto.',
      detalle: 'Cartón moldeado apto para reciclaje o para compostar troceado.'
    },

    // Metales
    {
      nombre: 'Lata de aluminio de cerveza o gaseosa',
      categoria: 'metal',
      categoriaLabel: 'Metal',
      apto: 'si',
      condicion: 'Escurrida y aplastada.',
      detalle: 'El aluminio puede reciclarse infinitas veces ahorrando un 95% de energía frente a producirlo de cero.'
    },
    {
      nombre: 'Lata de conservas / hojalata (tomate, atún, choclo)',
      categoria: 'metal',
      categoriaLabel: 'Metal',
      apto: 'si',
      condicion: 'Enjuagada con agua para quitar salsas y restos de comida. Tapa doblada hacia adentro.',
      detalle: 'Hojalata de acero reutilizable en siderurgia industrial.'
    },
    {
      nombre: 'Aerosol de desodorante o desodorante de ambiente',
      categoria: 'metal',
      categoriaLabel: 'Metal',
      apto: 'si',
      condicion: 'Completamente despresurizado y vacío. Retirar tapa plástica.',
      detalle: 'Cuerpo de aluminio u hojalata 100% recuperable.'
    },
    {
      nombre: 'Pilas y baterías alcalinas o de litio',
      categoria: 'metal',
      categoriaLabel: 'Metal',
      apto: 'no',
      condicion: 'NO van en el tacho de secos.',
      detalle: 'Son residuos peligrosos con metales pesados. Requieren contenedores especiales de gestión electrónica.'
    },
    {
      nombre: 'Clavos, alambres o chapas oxidadas sueltas',
      categoria: 'metal',
      categoriaLabel: 'Metal',
      apto: 'depende',
      condicion: 'CUIDADO: No entregar sueltos en bolsas comunes por riesgo de heridas graves y tétanos.',
      detalle: 'El metal es reciclable, pero si tiene puntas filosas debe ir en una lata cerrada o caja bien sellada y rotulada.'
    },
    {
      nombre: 'Papel de aluminio de cocina',
      categoria: 'metal',
      categoriaLabel: 'Metal',
      apto: 'si',
      condicion: 'SÍ VA si está limpio y sin restos de grasa quemada.',
      detalle: 'Aluminio flexible; hacé una bolita compacta para que no se vuele.'
    },

    // Vidrio
    {
      nombre: 'Botella de vidrio entera (vino, cerveza, salsa)',
      categoria: 'vidrio',
      categoriaLabel: 'Vidrio',
      apto: 'si',
      condicion: 'Enjuagada, escurrida y sin tapita (la tapita de metal va con metales).',
      detalle: 'El vidrio es 100% reciclable en circuito cerrado para nuevos envases.'
    },
    {
      nombre: 'Frasco de vidrio (mermelada, café, conservas)',
      categoria: 'vidrio',
      categoriaLabel: 'Vidrio',
      apto: 'si',
      condicion: 'Limpio y seco. La tapa de chapa se separa en metales.',
      detalle: 'Excelente para reutilización comunitaria o fundición.'
    },
    {
      nombre: 'Vidrio roto o astillado suelto en bolsa',
      categoria: 'vidrio',
      categoriaLabel: 'Vidrio',
      apto: 'no',
      condicion: 'PELIGRO: NUNCA entregar vidrio roto suelto.',
      detalle: 'Corta las bolsas y pone en riesgo la salud y las manos de los recolectores. Si tenés un frasco roto, envolvelo en papel grueso o caja de cartón rotulada "VIDRIO ROTO".'
    },
    {
      nombre: 'Espejo roto o entero',
      categoria: 'vidrio',
      categoriaLabel: 'Vidrio',
      apto: 'no',
      condicion: 'NO se funde con las botellas.',
      detalle: 'Los espejos contienen óxidos de plata, aluminio y químicos con diferente punto de fusión que arruinan la masa de vidrio.'
    },
    {
      nombre: 'Vajilla de cerámica, loza, porcelana o cristal',
      categoria: 'vidrio',
      categoriaLabel: 'Vidrio',
      apto: 'no',
      condicion: 'NO es vidrio de envase.',
      detalle: 'No funde a la misma temperatura que el vidrio de botellas y causa fallas estructurales al mezclarlo.'
    },
    {
      nombre: 'Focos incandescentes, bajo consumo o tubos fluorescentes',
      categoria: 'vidrio',
      categoriaLabel: 'Vidrio',
      apto: 'no',
      condicion: 'NO van al reciclaje seco común.',
      detalle: 'Los tubos y focos bajo consumo contienen mercurio y polvos fosforados tóxicos. Circuito RAEE especial.'
    },

    // Ecobotellas
    {
      nombre: 'Botella de Amor / Ecobotella',
      categoria: 'ecobotellas',
      categoriaLabel: 'Botellas de Amor',
      apto: 'si',
      condicion: 'Botella PET rellena a presión con plásticos de un solo uso limpios y secos.',
      detalle: 'Debe quedar tan dura que no se hunda al pisarla. Se convierte en madera plástica para bancos de plaza.'
    },
    {
      nombre: 'Envoltorios de galletitas, fideos y golosinas',
      categoria: 'ecobotellas',
      categoriaLabel: 'Botellas de Amor',
      apto: 'si',
      condicion: 'Limpios y secos, colocados dentro de la Ecobotella bien compactados con una cuchara de madera.',
      detalle: 'Plásticos tipo polipropileno biorientado (BOPP) ideales para madera plástica.'
    }
  ];

  // Filtro de búsqueda y categorías
  const resultadosFiltrados = useMemo(() => {
    return databaseObjetos.filter((item) => {
      const coincideCat = activeCategory === 'todos' || item.categoria === activeCategory;
      if (!coincideCat) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.nombre.toLowerCase().includes(term) ||
        item.condicion.toLowerCase().includes(term) ||
        item.detalle.toLowerCase().includes(term) ||
        item.categoriaLabel.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, activeCategory]);

  const categorias = [
    { id: 'todos', label: 'Todos los materiales', icon: Recycle, color: 'text-stone-800' },
    { id: 'plastico', label: 'Plásticos 🧴', icon: Droplets, color: 'text-amber-700' },
    { id: 'carton', label: 'Cartón & Papel 📦', icon: Package, color: 'text-yellow-800' },
    { id: 'metal', label: 'Metales 🥫', icon: Layers, color: 'text-slate-700' },
    { id: 'vidrio', label: 'Vidrios 🍾', icon: Wine, color: 'text-emerald-700' },
    { id: 'ecobotellas', label: 'Ecobotellas ♻️', icon: Sparkles, color: 'text-teal-700' }
  ];

  // Compartir en WhatsApp
  const handleShareGuia = () => {
    const texto = `♻️ *GUÍA DE RECICLAJE Y PUNTO VERDE EN LOMA VERDE* 🌿\n\n¿Sabías qué materiales se pueden reciclar y cuáles no? La regla de oro es que todo debe estar *LIMPIO Y SECO*.\n\n❌ *NO VA:* Plástico sucio con grasa o comida, cartón mojado o húmedo, papel brillante de color/plastificado, y vidrio roto suelto.\n✅ *SÍ VA:* Botellas enjuagadas y aplastadas, cartón seco desarmado, latas de aluminio y hojalata lavadas, y frascos de vidrio enteros.\n\n📍 *Punto Verde GIRSU en la Feria Lunar:* Domingo 8 de Noviembre de 12 a 18 hs en Plaza La Misión.\n\nLeé la guía completa e interactiva acá:\nhttps://lomaverdelunar.online/reciclaje`;
    const url = `https://api.whatsapp.com/send/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Copiar resumen al portapapeles
  const handleCopyResumen = () => {
    const resumen = `GUÍA RÁPIDA DE RECICLAJE • LOMA VERDE LUNAR ♻️

🟢 SÍ SE PUEDE RECICLAR (Limpio y Seco):
• Plásticos: Botellas PET aplastadas con tapa, envases de limpieza y shampoo enjuagados, potes limpios de yogur y queso.
• Cartón y Papel: Cajas corrugadas desarmadas secas, hojas blancas, diarios y rollos de cartón.
• Metales: Latas de cerveza/gaseosa aplastadas, latas de conserva enjuagadas, desodorantes vacíos.
• Vidrios: Botellas enteras y frascos lavados (tapa de chapa a metal).
• Botellas de Amor: Plásticos de 1 solo uso limpios y bien compactados.

🔴 NO SE PUEDE RECICLAR:
• Plásticos sucios con grasa o restos de comida.
• Cartón mojado o húmedo (la humedad arruina las fibras de celulosa).
• Papel brillante de color, plastificado, metalizado o térmico de tickets.
• Vidrio roto suelto (peligro de cortes para los recuperadores).
• Cajas de pizza con grasa adherida o restos de queso.

📍 Stand de GIRSU: Domingo 8 de Noviembre • 12 a 18 hs • Plaza La Misión.
Más info: https://lomaverdelunar.online/reciclaje`;

    navigator.clipboard.writeText(resumen).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    });
  };

  const faqs = [
    {
      q: '¿Por qué el papel brillante de color o plastificado no se recicla?',
      a: 'Porque está recubierto con una lámina plástica de polipropileno o barnices UV térmicos. Cuando el papel ingresa al proceso de reciclaje en fábrica, se disuelve en agua tibia para formar pulpa. El papel brillante no se desintegra, se apelmaza en grumos plásticos y arruina toda la maquinaria y la pasta de papel reciclado.'
    },
    {
      q: '¿Por qué el cartón mojado o húmedo no sirve para reciclar?',
      a: 'La humedad pudre las fibras orgánicas de celulosa en cuestión de horas. Un cartón mojado pierde su resistencia estructural, genera moho y hongos que contaminan los fardos secos con los que entra en contacto, y las industrias papeleras lo rechazan directamente.'
    },
    {
      q: '¿Qué hago con las cajas de pizza con grasa o queso pegado?',
      a: 'La grasa animal o vegetal no se mezcla con el agua en el pulpeado de papel. Sin embargo, en la mayoría de las cajas de pizza, la tapa superior está intacta, limpia y seca. Cortá la caja al medio: la tapa limpia va al reciclaje, y la base con grasa va a la basura común o se puede compostar en trozos pequeños.'
    },
    {
      q: '¿Tengo que lavar los plásticos con detergente?',
      a: '¡No hace falta gastar detergente ni litros de agua limpia! Con una rápida enjuagada usando el agua jabonosa que queda al lavar los platos y dejándolo secar boca abajo sobre la rejilla o una toalla es más que suficiente. Lo fundamental es que no tenga restos orgánicos que fermenten.'
    },
    {
      q: '¿A dónde van los materiales que dejamos en la Feria Lunar?',
      a: 'Son recibidos y clasificados por los recicladores urbanos de la Cooperativa GIRSU (Gestión Integral de Residuos Sólidos Urbanos). Ellos los prensan en fardos por tipo de material y los entregan directamente a la industria transformadora, generando trabajo digno, formal y economía circular en nuestra comunidad.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. ENCABEZADO Y BARRA SUPERIOR */}
      {/* ========================================================================= */}
      <header className="bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-900 text-white border-b-4 border-emerald-500 shadow-xl relative overflow-hidden">
        
        {/* Destellos ambientales */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10">
          
          {/* Botón Volver */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-stone-700 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </button>

            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <Recycle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guía Vecinal Oficial</span>
            </span>
          </div>

          {/* Título y Copete */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-stone-950 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-md">
              <span>♻️ SEPARACIÓN EN ORIGEN</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Qué se puede tirar y qué no?
            </h1>
            
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
              Plásticos, cartón, metal y vidrio: aprendé a diferenciar los materiales para cuidar el trabajo de la <strong>Cooperativa GIRSU</strong> y hacer de Loma Verde un barrio con Basura Cero.
            </p>

            {/* Banner de Convocatoria a la Feria */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-900/80 via-stone-900/90 to-teal-950/80 border border-emerald-400/40 text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                  📍
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <span>Punto Verde en Plaza La Misión</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                    Domingo 8 de Noviembre • De 12:00 a 18:00 hs
                  </h3>
                  <p className="text-xs text-stone-300">
                    Traé tus materiales limpios y secos de casa. Stands de recepción y talleres interactivos al paso.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleShareGuia}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Compartir</span>
                </button>
                <button
                  onClick={handleCopyResumen}
                  className="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="Copiar resumen para WhatsApp"
                >
                  {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSummary ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. REGLA DE ORO: LIMPIO Y SECO (BANNER PEDAGÓGICO) */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-amber-100/90 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
                ✨
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-900 block">
                  Regla de Oro Comunitaria
                </span>
                <h3 className="font-serif font-black text-lg sm:text-xl text-stone-950">
                  Todo material debe estar LIMPIO y SECO
                </h3>
                <p className="text-xs sm:text-sm text-stone-800 mt-0.5">
                  Una sola botella con restos de salsa o un cartón mojado pudren el fardo entero y obligan a descartar kilos de trabajo ajeno.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold w-full md:w-auto shrink-0">
              <div className="bg-white/80 border border-amber-300 p-2.5 rounded-xl flex items-center gap-2">
                <span className="text-emerald-700 text-lg">💧</span>
                <span className="text-stone-800 leading-tight">Enjuagá con agua residual</span>
              </div>
              <div className="bg-white/80 border border-amber-300 p-2.5 rounded-xl flex items-center gap-2">
                <span className="text-amber-700 text-lg">☀️</span>
                <span className="text-stone-800 leading-tight">Escurrí boca abajo</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUSCADOR INTERACTIVO EN TIEMPO REAL */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-950 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>Buscador: ¿Esto se puede reciclar?</span>
              </h2>
              <p className="text-xs text-stone-500">
                Escribí cualquier objeto de tu casa para ver al instante si va o no va y por qué.
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>

          {/* Input de Búsqueda */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: pote de yogur, caja de pizza, cartón mojado, papel de regalo, latas, vidrio..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 focus:border-emerald-500 focus:bg-white text-stone-900 placeholder-stone-400 font-medium text-sm transition-all outline-none"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sugerencias Rápidas */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 pt-1">
            <span className="font-bold text-stone-500 text-[11px] uppercase tracking-wider">Consultas frecuentes:</span>
            {[
              'Cartón mojado',
              'Plástico sucio',
              'Papel brillante de color',
              'Caja de pizza',
              'Pote de yogur',
              'Vidrio roto',
              'Latas de cerveza',
              'Tickets de compra'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setSearchTerm(chip)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
              >
                {chip}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SELECTOR DE CATEGORÍAS */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categorias.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VISTA DE COMPARACIÓN: SÍ VA vs NO VA (GRAN PANEL VISUAL) */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* Conteo de resultados */}
        <div className="mb-4 flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>Mostrando {resultadosFiltrados.length} elementos clasificados</span>
          {activeCategory !== 'todos' && (
            <button
              onClick={() => setActiveCategory('todos')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        {/* Columnas SÍ VA / NO VA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* COLUMNA 1: 🟢 SÍ SE PUEDE RECICLAR */}
          <div className="bg-emerald-50/60 rounded-3xl border-2 border-emerald-300 p-5 sm:p-6 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ✓
                </div>
                <div>
                  <h2 className="font-serif font-black text-lg text-emerald-950">
                    SÍ SE PUEDE RECICLAR
                  </h2>
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Entregar siempre LIMPIO y SECO
                  </p>
                </div>
              </div>
              <span className="bg-emerald-200 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-full">
                {resultadosFiltrados.filter(i => i.apto === 'si').length}
              </span>
            </div>

            <div className="space-y-3">
              {resultadosFiltrados
                .filter(i => i.apto === 'si')
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <h4 className="font-serif font-bold text-sm text-stone-950">
                          {item.nombre}
                        </h4>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md shrink-0">
                        {item.categoriaLabel}
                      </span>
                    </div>

                    <div className="bg-emerald-50/50 p-2 rounded-xl text-xs text-emerald-950 font-medium">
                      <strong>Cómo acondicionarlo:</strong> {item.condicion}
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {item.detalle}
                    </p>
                  </div>
                ))}

              {resultadosFiltrados.filter(i => i.apto === 'si').length === 0 && (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No hay elementos marcados como aceptados para este filtro.
                </div>
              )}
            </div>

          </div>

          {/* COLUMNA 2: 🔴 NO SE PUEDE RECICLAR (O ATENCIÓN ESPECIAL) */}
          <div className="bg-rose-50/60 rounded-3xl border-2 border-rose-300 p-5 sm:p-6 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-rose-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ✕
                </div>
                <div>
                  <h2 className="font-serif font-black text-lg text-rose-950">
                    NO SE PUEDE RECICLAR
                  </h2>
                  <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                    Contamina el fardo o arruina el lote
                  </p>
                </div>
              </div>
              <span className="bg-rose-200 text-rose-900 text-xs font-black px-2.5 py-1 rounded-full">
                {resultadosFiltrados.filter(i => i.apto === 'no' || i.apto === 'depende').length}
              </span>
            </div>

            <div className="space-y-3">
              {resultadosFiltrados
                .filter(i => i.apto === 'no' || i.apto === 'depende')
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.apto === 'depende' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <h4 className="font-serif font-bold text-sm text-stone-950">
                          {item.nombre}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                        item.apto === 'depende' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.apto === 'depende' ? 'Condición' : 'Descarte'}
                      </span>
                    </div>

                    <div className={`p-2 rounded-xl text-xs font-medium ${
                      item.apto === 'depende' ? 'bg-amber-50 text-amber-950' : 'bg-rose-50 text-rose-950'
                    }`}>
                      <strong>{item.apto === 'depende' ? 'Atención:' : 'Por qué no va:'}</strong> {item.condicion}
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {item.detalle}
                    </p>
                  </div>
                ))}

              {resultadosFiltrados.filter(i => i.apto === 'no' || i.apto === 'depende').length === 0 && (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No hay elementos marcados como no aceptados para este filtro.
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 6. GUÍA DE LAS 4 SECCIONES CLAVE (RESUMEN TARJETA POR MATERIAL) */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 mt-12 space-y-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 block">
            Guía por Categoría
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-950">
            Los 4 Materiales Fundamentales
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Un repaso rápido para tener siempre presente en la cocina o al momento de separar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tarjeta 1: Plástico */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                🧴
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-950">
                1. Plásticos
              </h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="text-emerald-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✓</span>
                  <span>Botellas PET (aplastadas con tapa), bidones y potes limpios.</span>
                </div>
                <div className="text-rose-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✕</span>
                  <span><strong>Plástico sucio:</strong> Restos de salsa, grasa, queso o comida.</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
              💡 Aplastá las botellas para que no ocupen aire en los bolsones de acopio.
            </div>
          </div>

          {/* Tarjeta 2: Cartón y Papel */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                📦
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-950">
                2. Cartón & Papel
              </h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="text-emerald-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✓</span>
                  <span>Cajas corrugadas desarmadas, diarios, revistas y hojas secas.</span>
                </div>
                <div className="text-rose-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✕</span>
                  <span><strong>Cartón mojado</strong> y <strong>papel brillante de color / plastificado</strong>.</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
              💡 Desarmá las cajas para que entren 10 veces más en el vehículo de carga.
            </div>
          </div>

          {/* Tarjeta 3: Metal */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                🥫
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-950">
                3. Metales
              </h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="text-emerald-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✓</span>
                  <span>Latas de aluminio y hojalata enjuagadas, aerosoles vacíos.</span>
                </div>
                <div className="text-rose-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✕</span>
                  <span>Pilas, baterías o latas con solventes y pinturas tóxicas.</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
              💡 Doblá la tapita de la lata hacia adentro para evitar accidentes al manipularla.
            </div>
          </div>

          {/* Tarjeta 4: Vidrio */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                🍾
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-950">
                4. Vidrios
              </h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="text-emerald-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✓</span>
                  <span>Botellas enteras y frascos lavados de cualquier color.</span>
                </div>
                <div className="text-rose-700 font-semibold flex items-start gap-1.5">
                  <span className="text-sm">✕</span>
                  <span><strong>Vidrio roto suelto</strong>, espejos, cerámica o vajilla rota.</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
              💡 Si se te rompe un frasco, envolvelo en cartón cerrado y rotulado.
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. PREGUNTAS FRECUENTES (FAQ INTERACTIVO) */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm">
          
          <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-950">
                Preguntas Frecuentes de los Vecinos
              </h3>
              <p className="text-xs text-stone-500">
                Dudas comunes resueltas junto a los recuperadores de la Cooperativa GIRSU.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <span className="font-serif font-bold text-sm text-stone-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LLAMADO FINAL Y ENLACE AL DIARIO */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border-2 border-emerald-400/50">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🌱
          </div>
          <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
            La materia viva no se tira: se cuida y se transforma
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Te esperamos este <strong>domingo 8 de noviembre</strong> de 12:00 a 18:00 hs en <strong>Plaza La Misión</strong> con tus reciclables para ser parte del nuevo Espacio Permanente de Residuos de Loma Verde.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onGoToDiario && onGoToDiario('noticia-tauro-girsu-reciclado')}
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Leer Nota de GIRSU en El Diario</span>
            </button>

            <button
              onClick={handleShareGuia}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all border border-stone-700 flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Difundir Guía en WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
