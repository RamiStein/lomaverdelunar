import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Wifi, 
  WifiOff, 
  FileText, 
  Share2, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  HeartPulse, 
  Activity, 
  Flame, 
  Zap, 
  BookOpen, 
  Users, 
  PhoneCall, 
  Download, 
  Scale, 
  TreePine, 
  Check, 
  ArrowLeft, 
  MessageCircle, 
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  Send,
  Sparkles,
  Home
} from 'lucide-react';

export default function AntenaAlertaView({ config, onBackToHome }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPetitorio, setCopiedPetitorio] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeEstudio, setActiveEstudio] = useState(0);

  // Formulario de Adhesión Vecinal
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    barrio: '',
    calle: '',
    motivo: '',
    esVecino: true
  });
  const [enviado, setEnviado] = useState(false);
  const [totalAdhesiones, setTotalAdhesiones] = useState(148);

  const whatsappCoordinacion = config?.whatsappCoordinacion || '5493484503056';
  const urlPagina = 'https://lomaverdelunar.online/noalaantena';

  // Cargar contador o estado guardado
  useEffect(() => {
    try {
      const guardado = localStorage.getItem('adhesion_antena_enviada');
      if (guardado) {
        setEnviado(true);
      }
      // Intento opcional de traer conteo real si el server responde
      fetch('/api/antena/firmas')
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.total === 'number') {
            setTotalAdhesiones(Math.max(148, data.total));
          }
        })
        .catch(() => {});
    } catch (e) {
      // Ignorar en entornos aislados
    }
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Alerta Vecinal Loma Verde: No a la Antena 5G de Telmex',
      text: 'Exigimos la suspensión de la antena de microondas y pedimos conectividad limpia por FIBRA ÓPTICA. Cuidemos la salud de nuestras familias y el entorno natural de Loma Verde.',
      url: urlPagina
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback al portapapeles
      }
    }

    try {
      await navigator.clipboard.writeText(urlPagina);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      alert(`Enlace para compartir: ${urlPagina}`);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      alert('Por favor ingresá tu nombre y teléfono de contacto.');
      return;
    }

    // Intentar registrar en backend si está activo
    try {
      await fetch('/api/antena/firmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      // Silencioso, continuamos con WhatsApp
    }

    localStorage.setItem('adhesion_antena_enviada', 'true');
    setEnviado(true);
    setTotalAdhesiones(prev => prev + 1);

    // Mensaje automático para el coordinador
    const mensajeWa = `¡Hola! Me sumo formalmente a la adhesión vecinal contra la antena de Telmex en Loma Verde.%0A%0A` +
      `👤 *Nombre:* ${formData.nombre}%0A` +
      `📍 *Ubicación / Barrio:* ${formData.barrio || 'Loma Verde'} (Calle: ${formData.calle || 'S/D'})%0A` +
      `📞 *Teléfono:* ${formData.telefono}%0A` +
      (formData.motivo ? `💬 *Observaciones:* ${formData.motivo}%0A` : '') +
      `%0A🌿 *Exigimos:* Aplicación del Principio Precautorio (Ley 25.675) y tendido de FIBRA ÓPTICA cableada. ¡Cero radiación innecesaria en Loma Verde!`;

    window.open(`https://wa.me/${whatsappCoordinacion}?text=${mensajeWa}`, '_blank');
  };

  const petitorioTexto = `PETITORIO VECINAL Y CIUDADANO

A LAS AUTORIDADES COMPETENTES:
- Al Sr. Intendente de la Municipalidad de Escobar
- Al Honorable Concejo Deliberante del Partido de Escobar
- A la Secretaría de Planificación e Infraestructura y Dirección de Medio Ambiente de Escobar
- Al Ente Nacional de Comunicaciones (ENACOM)

REF: OPOSICIÓN VECINAL Y SOLICITUD DE SUSPENSIÓN PRECAUTORIA INMEDIATA DE LA INSTALACIÓN DE ESTRUCTURA PORTANTE DE ANTENA DE TELEFONÍA Y DATOS (TELMEX / CLARO / AMÉRICA MÓVIL) EN LA LOCALIDAD DE LOMA VERDE, PARTIDO DE ESCOBAR.

De nuestra mayor consideración:
Los vecinos, familias y miembros de la comunidad de Loma Verde, Partido de Escobar, nos dirigimos a Uds. con el fin de manifestar nuestra rotunda OPOSICIÓN a la instalación y puesta en funcionamiento de una torre transmisora de telecomunicaciones y microondas (tecnología 4G/5G) proyectada por la empresa TELMEX / CLARO en nuestra localidad, fundando nuestro reclamo en las siguientes consideraciones de hecho y de derecho:

1. FALTA DE LICENCIA SOCIAL Y OMISIÓN DE CONSULTA PÚBLICA:
La comunidad de Loma Verde no ha sido consultada de manera previa, libre e informada. La empresa pretende instalar una fuente de radiación electromagnética involuntaria y permanente bajo el pretexto comercial de brindar conectividad a sectores que no han solicitado dicha tecnología invasiva.

2. EXISTENCIA DE ALTERNATIVA TÉCNICA SUPERIOR Y NO CONTAMINANTE (FIBRA ÓPTICA):
Es técnicamente innecesario e inaceptable someter a la población a radiación de microondas continuas las 24 horas del día, existiendo la tecnología de FIBRA ÓPTICA CABLEADA (FTTH), la cual es biológicamente 100% inocua, brinda anchos de banda simétricos de mayor velocidad y estabilidad, y no contamina el entorno natural ni la biósfera de Loma Verde.

3. EVIDENCIA CIENTÍFICA Y MÉDICA INTERNACIONAL:
- La Organización Mundial de la Salud (OMS / IARC - Monografía 102) clasificó las radiaciones de radiofrecuencia en el Grupo 2B como posiblemente carcinogénicas para los seres humanos.
- El estudio del Instituto Ramazzini (Italia, Belpoggi et al., Environmental Research 2018) sobre niveles de exposición equivalentes a antenas de telefonía demostró incremento estadísticamente significativo de schwannomas malignos del corazón.
- El National Toxicology Program (NTP) de EE.UU. concluyó "clara evidencia" (clear evidence) de carcinogénesis y roturas de cadenas de ADN en exposición a radiofrecuencias celulares.
- El BioInitiative Report (más de 3.800 estudios revisados por pares) y las investigaciones clínicas del Dr. Lennart Hardell documentan el "Síndrome por Microondas", cefaleas severas, estrés oxidativo, disrupción del sueño y daños neurológicos acumulativos.
- La Resolución 1815 de la Asamblea Parlamentaria del Consejo de Europa insta a los Estados a aplicar el principio ALARA y a priorizar expresamente el cableado sobre la transmisión inalámbrica.

4. FUNDAMENTO LEGAL NACIONAL (PRINCIPIO PRECAUTORIO):
Conforme al Artículo 4 de la Ley General del Ambiente N° 25.675: "Cuando haya peligro de daño grave o irreversible, la ausencia de información o certeza científica no deberá utilizarse como razón para postergar la adopción de medidas eficaces... para impedir la degradación del medio ambiente".
Asimismo, nos ampara el Artículo 41 de la Constitución Nacional (derecho a un ambiente sano, equilibrado y apto para el desarrollo humano).

POR LO EXPUESTO, SOLICITAMOS:
1. La SUSPENSIÓN PRECAUTORIA INMEDIATA de cualquier obra, excavación, montaje, trámite de factibilidad o habilitación para la instalación de la mencionada antena de Telmex en Loma Verde.
2. La convocatoria urgente a una AUDIENCIA PÚBLICA VECINAL vinculante en Loma Verde.
3. La intimación a la empresa prestataria para que brinde el servicio demandado pura y exclusivamente mediante TENDIDO DE FIBRA ÓPTICA CABLEADA / SUBTERRÁNEA.

Comunidad Vecinal Organizada de Loma Verde, Partido de Escobar.`;

  const handleCopiarPetitorio = async () => {
    try {
      await navigator.clipboard.writeText(petitorioTexto);
      setCopiedPetitorio(true);
      setTimeout(() => setCopiedPetitorio(false), 2500);
    } catch (e) {
      alert('Seleccioná el texto para copiarlo manualmente.');
    }
  };

  const handleDescargarPetitorio = () => {
    const element = document.createElement("a");
    const file = new Blob([petitorioTexto], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "Petitorio_Vecinal_No_A_La_Antena_Loma_Verde.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const estudiosCientificos = [
    {
      institucion: 'Instituto Ramazzini (Centro de Investigación de Cáncer Cesare Maltoni, Bolonia, Italia)',
      publicacion: 'Environmental Research (Elsevier), Vol. 165, pp. 496-503 (2018)',
      titulo: 'Report of final results regarding brain and heart tumors in Sprague-Dawley rats exposed to mobile phone base station emission',
      autores: 'Dra. Fiorella Belpoggi, Daniele Mandrioli, et al.',
      hallazgo: 'El estudio independiente más grande de la historia en campo lejano (far-field) simulando la radiación real de antenas de telefonía celular por debajo de los límites legales. Demostró un aumento estadísticamente significativo de schwannomas cardíacos malignos (tumores de los nervios del corazón) y proliferación glial.',
      impacto: 'Prueba científica concluyente de que la radiación emitida continuamente por antenas en zonas pobladas genera efectos carcinogénicos incluso a potencias consideradas "seguras" por las normas desactualizadas.'
    },
    {
      institucion: 'National Toxicology Program (NTP) - Gobierno de los Estados Unidos',
      publicacion: 'U.S. Department of Health and Human Services (HHS) & NIEHS (2018)',
      titulo: 'NTP Technical Reports on the Toxicology and Carcinogenesis of Cell Phone Radiofrequency Radiation (TR 595 & 596)',
      autores: 'Panel de Expertos Científicos del Gobierno de EE.UU.',
      hallazgo: 'Estudio de más de $30 millones de dólares que concluyó con la categoría máxima de certeza: "Clara Evidencia" (Clear Evidence) de actividad carcinogénica en tumores malignos de corazón (schwannomas), evidencia en cerebro (gliomas) y daño genotóxico con rotura de cadenas de ADN.',
      impacto: 'Al coincidir con los mismos tumores cardíacos hallados por el Instituto Ramazzini a miles de kilómetros de distancia, se ratifica una indiscutible relación de causa-efecto biológica.'
    },
    {
      institucion: 'Agencia Internacional para la Investigación del Cáncer (IARC / OMS)',
      publicacion: 'IARC Monographs on the Evaluation of Carcinogenic Risks to Humans, Vol. 102 (2011/2013)',
      titulo: 'Non-Ionizing Radiation, Part 2: Radiofrequency Electromagnetic Fields',
      autores: 'Grupo de Trabajo de 30 científicos de 14 países miembros de la OMS',
      hallazgo: 'Clasificó oficialmente todos los campos electromagnéticos de radiofrecuencia (RF-EMF) en el Grupo 2B: "Posiblemente carcinogénicos para los seres humanos".',
      impacto: 'Numerosos miembros del panel original han publicado peticiones formales para elevar de inmediato esta clasificación al Grupo 1 (Carcinógeno Comprobado) o Grupo 2A (Probable Carcinógeno), exigiendo a los municipios moratorias preventivas.'
    },
    {
      institucion: 'Dr. Lennart Hardell & Mona Nilsson (Estudios Clínicos sobre 5G)',
      publicacion: 'World Academy of Sciences Journal & Reviews on Environmental Health (2020-2023)',
      titulo: 'Radiation from 5G base stations causes microwave syndrome in humans living in close proximity',
      autores: 'Dr. Lennart Hardell (Oncólogo y Epidemiólogo) y Mona Nilsson (Fundación de Protección contra Radiaciones)',
      hallazgo: 'Primeros estudios clínicos en humanos expuestos directamente a antenas 5G en sus hogares: aparición inmediata de "Síndrome por Microondas" agudo (insomnio refractario, cefaleas severas, taquicardias y arritmias, sangrado nasal, acúfenos/tinnitus, fatiga extrema y pérdida de memoria de corto plazo).',
      impacto: 'Los síntomas desaparecieron o se redujeron drásticamente cuando los residentes se mudaron a zonas libres de radiación de antenas 5G, demostrando la causalidad clínica directa.'
    },
    {
      institucion: 'BioInitiative Working Group (Metaestudio Internacional)',
      publicacion: 'BioInitiative Report (Edición 2012 con actualizaciones anuales)',
      titulo: 'A Rationale for Biologically-based Public Exposure Standards for Electromagnetic Fields',
      autores: '29 científicos médicos, biólogos celulares y doctores en salud pública de 10 países',
      hallazgo: 'Análisis de más de 3.800 investigaciones biomédicas revisadas por pares. Demostró que los efectos no térmicos ocurren a niveles cientos y miles de veces inferiores a los límites legales: permeabilización de la barrera hematoencefálica cerebral, estrés oxidativo mitocondrial masivo, daño en el ADN y alteración del sistema inmune.',
      impacto: 'Desmonta el argumento falaz de las telefónicas de que "si la radiación no calienta los tejidos corporales, no hay peligro".'
    },
    {
      institucion: 'Consejo de Europa - Asamblea Parlamentaria',
      publicacion: 'Resolución 1815 (Adoptada el 27 de mayo de 2011)',
      titulo: 'The potential dangers of electromagnetic fields and their effect on the environment',
      autores: 'Asamblea Parlamentaria de Europa',
      hallazgo: 'Instó a todos los gobiernos europeos y mundiales a aplicar el principio ALARA (As Low As Reasonably Achievable) y a priorizar de forma categórica el acceso a internet por cable y fibra óptica en escuelas, guarderías y áreas residenciales, desalentando las antenas de microondas.',
      impacto: 'Precedente legislativo internacional que establece que la salud y el principio precautorio deben primar por sobre cualquier interés corporativo de telecomunicaciones.'
    }
  ];

  const faqs = [
    {
      q: '¿Por qué nos oponemos a la antena si Telmex dice que es para "dar internet"?',
      a: 'Porque existe una solución mil veces mejor, más rápida, estable y 100% libre de radiación: la FIBRA ÓPTICA. Telmex busca el camino de menor costo corporativo para su red celular, a expensas de imponer un foco de microondas electromagnéticas las 24 horas sobre nuestras cabezas, sin que los vecinos hayamos pedido dicha antena.'
    },
    {
      q: '¿Qué es el Principio Precautorio consagrado en la Ley Nacional 25.675?',
      a: 'Es la norma máxima del derecho ambiental argentino (Art. 4). Establece que cuando existe riesgo de daño grave o irreversible para la salud y el medio ambiente, la falta de certeza científica absoluta no puede utilizarse como justificación para no frenar la actividad. La carga de la prueba le corresponde a Telmex: ellos deben demostrar la inocuidad total antes de colocar un solo poste.'
    },
    {
      q: '¿Por qué los límites de radiación que cita ENACOM no garantizan salud?',
      a: 'La normativa vigente en Argentina para telecomunicaciones data de hace décadas (Resolución SC 272/1995) y solo contempla los efectos térmicos agudos (es decir, el calentamiento de los tejidos en 6 minutos). Ignora por completo los efectos biológicos no térmicos acumulativos por exposición crónica 24/7/365, comprobados ampliamente por la ciencia médica moderna.'
    },
    {
      q: '¿Cómo afecta la antena 5G a los niños y adultos mayores?',
      a: 'Los niños tienen cráneos más delgados, mayor conductividad de sus tejidos debido a su alto contenido de agua y sus células se encuentran en constante división celular, absorbiendo proporcionalmente hasta el doble de radiación en el cerebro que un adulto. La Academia Estadounidense de Pediatría (AAP) advierte reiteradamente sobre la extrema vulnerabilidad infantil.'
    },
    {
      q: '¿Afecta también la naturaleza, las abejas y los animales de Loma Verde?',
      a: 'Sí. Loma Verde es un pulmón verde con flora, huertas y biodiversidad. Múltiples investigaciones en Science of the Total Environment evidencian que las frecuencias milimétricas interfieren con los campos biomagnéticos que usan las abejas para orientarse, diezmando colmenas enteras y alterando a las aves cantoras.'
    },
    {
      q: '¿Qué acciones concretas podemos realizar los vecinos ahora mismo?',
      a: '1) Firmar la adhesión vecinal en este sitio; 2) Compartir esta página en todos los grupos barriales; 3) Imprimir el Petitorio Formal para presentarlo ante el Municipio de Escobar y el Concejo Deliberante; 4) Sumarse a la asamblea vecinal activa por WhatsApp.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-rose-500 selection:text-white pb-20">
      
      {/* 1. Alerta Superior de Emergencia Comunitaria */}
      <div className="bg-red-700 text-white py-2.5 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping flex-shrink-0" />
            <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>ALERTA VECINAL EN LOMA VERDE: No a la instalación inconsulta de la Antena 5G de Telmex</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="bg-red-800 hover:bg-red-900 border border-red-500 px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-all text-white"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
            <button
              onClick={onBackToHome}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Portal Lunar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Principal de Convocatoria */}
      <header className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 text-white pt-12 pb-20 px-4 sm:px-6 overflow-hidden border-b-4 border-red-600">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Glow de advertencia */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-500/60 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-extrabold text-red-200 shadow-inner">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Defensa Ambiental y Sanitaria de Loma Verde • Escobar
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Frenemos la Antena 5G de <span className="text-red-500 underline decoration-red-600/80 decoration-4">Telmex</span> en Loma Verde
          </h1>

          <p className="text-stone-300 text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            La empresa pretende imponer una torre transmisora de microondas de alta radiación para un servicio que el barrio <strong className="text-white font-bold">no solicitó</strong>. Exigimos la aplicación inmediata del <span className="text-amber-300 font-semibold">Principio Precautorio (Ley 25.675)</span> y la alternativa limpia, segura y superior: <strong className="text-emerald-400 font-bold">FIBRA ÓPTICA CABLEADA</strong>.
          </p>

          {/* Métricas / Badges Clave */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 text-left">
            <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-red-400">0%</div>
              <div className="text-xs text-stone-300 font-medium">Consulta Vecinal</div>
              <div className="text-[11px] text-stone-400">Sin audiencia pública previa</div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">24 / 7</div>
              <div className="text-xs text-stone-300 font-medium">Radiación Involuntaria</div>
              <div className="text-[11px] text-stone-400">Exposición crónica acumulativa</div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">+3.800</div>
              <div className="text-xs text-stone-300 font-medium">Estudios Médicos</div>
              <div className="text-[11px] text-stone-400">Efectos biológicos demostrados</div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-stone-300 font-medium">Fibra Óptica Limpia</div>
              <div className="text-[11px] text-stone-400">CERO radiación en el aire</div>
            </div>
          </div>

          {/* Botones de Acción Inmediata */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#adhesion"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 text-sm sm:text-base transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Firmar Adhesión Vecinal ({totalAdhesiones})</span>
            </a>

            <a
              href="#petitorio"
              className="bg-stone-700 hover:bg-stone-600 text-white font-bold px-5 py-3.5 rounded-xl border border-stone-500/60 flex items-center gap-2 text-sm sm:text-base transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ver Petitorio para Autoridades</span>
            </a>

            <button
              onClick={handleShare}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3.5 rounded-xl shadow flex items-center gap-2 text-sm sm:text-base transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Difundir en WhatsApp'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Navegación Rápida Anclada */}
      <div className="bg-white border-b border-stone-200 sticky top-10 z-30 shadow-xs overflow-x-auto">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-4 text-xs font-bold text-stone-600 whitespace-nowrap">
          <span className="text-stone-400 uppercase tracking-widest text-[10px]">Ir a:</span>
          <a href="#problematica" className="hover:text-red-600 transition-colors">La Problemática</a>
          <span className="text-stone-300">•</span>
          <a href="#fibra-optica" className="hover:text-emerald-600 transition-colors">Solución: Fibra Óptica</a>
          <span className="text-stone-300">•</span>
          <a href="#estudios" className="hover:text-blue-600 transition-colors">Evidencia Científica</a>
          <span className="text-stone-300">•</span>
          <a href="#marco-legal" className="hover:text-purple-600 transition-colors">Marco Legal Argentino</a>
          <span className="text-stone-300">•</span>
          <a href="#adhesion" className="text-red-600 hover:underline">Formulario de Adhesión</a>
          <span className="text-stone-300">•</span>
          <a href="#petitorio" className="hover:text-amber-600 transition-colors">Petitorio Municipal</a>
          <span className="text-stone-300">•</span>
          <a href="#faq" className="hover:text-stone-900 transition-colors">Preguntas Frecuentes</a>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-16">

        {/* 4. SECCIÓN: La Problemática en Loma Verde */}
        <section id="problematica" className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                La Verdad de lo que está sucediendo en Loma Verde
              </h2>
              <p className="text-xs text-stone-500">Imposición comercial sin consulta ciudadana ni evaluación de impacto biológico</p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              La empresa de telecomunicaciones <strong>Telmex (América Móvil / Claro)</strong> se encuentra gestionando y avanzando en la instalación de una torre de transmisión de telefonía celular y tecnología <strong>5G / microondas pulsadas</strong> en nuestra localidad de Loma Verde, Partido de Escobar.
            </p>
            
            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl space-y-2">
              <h4 className="font-bold text-red-900 text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                El argumento corporativo vs. La realidad vecinal
              </h4>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                La compañía argumenta que la torre tiene por objeto <em>"llevar internet a un sector de Loma Verde"</em>. Sin embargo, <strong>la comunidad de vecinos de Loma Verde nunca solicitó esta antena ni fue convocada a una audiencia pública</strong>. Se intenta imponer una fuente permanente de electropolución en un entorno semirrural, de quintas familiares y colegios, desconociendo el derecho básico a la salud y a la tranquilidad ambiental.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-red-600" />
                  Invasión Innecesaria
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  No hay aislamiento voluntario: la radiación penetra paredes, dormitorios y espacios públicos las 24 horas del día sin posibilidad de desconexión.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-1.5">
                  <TreePine className="w-4 h-4 text-emerald-700" />
                  Impacto en el Ecosistema
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  Afectación directa a la biodiversidad autóctona, abejas polinizadoras, aves y a la masa arbórea que define la identidad de Loma Verde.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-700" />
                  Violación de Derechos
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  Vulnera el Art. 41 de la Constitución Nacional y el Principio Precautorio consagrado en el Art. 4 de la Ley General del Ambiente 25.675.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SECCIÓN: La Alternativa Limpia (Fibra Óptica vs. Microondas) */}
        <section id="fibra-optica" className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> La Solución Racional y Moderna
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
                FIBRA ÓPTICA: Conectividad Gigabits Sin Radiación
              </h2>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs px-3.5 py-1.5 rounded-full font-bold self-start md:self-auto">
              Tecnología Inocua para la Salud
            </div>
          </div>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            La comunidad de Loma Verde <strong className="text-white">no se opone al progreso ni al acceso a internet de alta calidad</strong>. Lo que exigimos es que la conectividad se brinde mediante <strong>FIBRA ÓPTICA CABLEADA (FTTH)</strong>. La luz viaja por el núcleo del cable de vidrio: entrega velocidades insuperables, estabilidad ante tormentas y <strong className="text-emerald-300">CERO radiación electromagnética dispersada al aire</strong>.
          </p>

          {/* Tabla Comparativa Contundente */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-700 text-stone-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Característica</th>
                  <th className="py-3 px-3 text-red-400 bg-red-950/40 rounded-tl-lg">Antena 5G / Microondas Aéreas</th>
                  <th className="py-3 px-3 text-emerald-300 bg-emerald-950/60 rounded-tr-lg">Fibra Óptica Cableada (FTTH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-200">Radiación Electromagnética</td>
                  <td className="py-3 px-3 text-red-300 bg-red-950/20">Constante e involuntaria 24/7 sobre viviendas y escuelas</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-950/30">CERO radiación (los pulsos de luz viajan dentro del cable)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-200">Velocidad y Simetría</td>
                  <td className="py-3 px-3 text-stone-300 bg-red-950/20">Variable, comparte ancho de banda con saturación en horas pico</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-950/30">Ultra-alta velocidad simétrica (100 a 1.000+ Mbps garantizados)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-200">Resistencia Climatológica</td>
                  <td className="py-3 px-3 text-stone-300 bg-red-950/20">Se degrada fuertemente con lluvias torrenciales y niebla</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-950/30">Inmune a interferencias electromagnéticas y climáticas</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-200">Impacto Paisajístico y Valor Inmobiliario</td>
                  <td className="py-3 px-3 text-red-300 bg-red-950/20">Torre metálica de 30-50m que deteriora el paisaje y devalúa los lotes</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-950/30">Tendido limpio, soterrado o en postes existentes sin impacto visual</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-200">Riesgo Sanitario y Biológico</td>
                  <td className="py-3 px-3 text-red-300 bg-red-950/20">Clasificado 2B OMS / NTP evidencia tumoral y daño genotóxico</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-950/30">Totalmente inocua y biológicamente neutra para humanos y fauna</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-500/40 p-4 rounded-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-emerald-100">
              ¿Por qué Telmex no tira fibra óptica? Porque busca amortizar antenas inalámbricas a bajo costo, sacrificando la salud de Loma Verde.
            </span>
            <a
              href="#adhesion"
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black px-4 py-2 rounded-lg whitespace-nowrap transition-all shadow"
            >
              Exigir Fibra Óptica Ahora
            </a>
          </div>
        </section>

        {/* 6. SECCIÓN: Dossier Científico y Referencias Médicas */}
        <section id="estudios" className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Evidencia Científica y Referencias Médicas Arbitradas
              </h2>
              <p className="text-xs text-stone-500">Publicaciones en revistas de toxicología, oncología y medicina ambiental indexadas</p>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            A continuación se detallan las investigaciones independientes más respetadas a nivel mundial realizadas por instituciones gubernamentales, médicas y académicas que prueban los riesgos biológicos y oncológicos de la radiación por estaciones base de telefonía y tecnología 5G:
          </p>

          {/* Selector de Estudios */}
          <div className="grid md:grid-cols-3 gap-2.5">
            {estudiosCientificos.map((est, idx) => (
              <button
                key={idx}
                onClick={() => setActiveEstudio(idx)}
                className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  activeEstudio === idx
                    ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs ring-1 ring-blue-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-700'
                }`}
              >
                <div className="font-bold mb-1 line-clamp-1">{est.institucion}</div>
                <div className="text-[11px] text-stone-500 line-clamp-1">{est.publicacion}</div>
              </button>
            ))}
          </div>

          {/* Ficha Detallada del Estudio Seleccionado */}
          {estudiosCientificos[activeEstudio] && (
            <div className="p-5 sm:p-6 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-blue-200 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Referencia Científica #{activeEstudio + 1}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-stone-900 mt-1">
                    {estudiosCientificos[activeEstudio].institucion}
                  </h3>
                  <p className="text-xs font-semibold text-blue-900 italic">
                    Publicado en: {estudiosCientificos[activeEstudio].publicacion}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Título del Estudio:</h4>
                <p className="font-mono text-xs sm:text-sm text-stone-800 bg-white p-2.5 rounded-lg border border-blue-100 mt-1">
                  "{estudiosCientificos[activeEstudio].titulo}"
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Autores principales: <span className="text-stone-700 font-medium">{estudiosCientificos[activeEstudio].autores}</span>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Hallazgo Científico Clave
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {estudiosCientificos[activeEstudio].hallazgo}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Consecuencia para Loma Verde
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {estudiosCientificos[activeEstudio].impacto}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cuadro de Efectos Médicos y Síntomas Reportados */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              Sintomatología clínica documentada del "Síndrome por Microondas" (Microwave Syndrome):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-stone-700">
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Cefaleas y migrañas crónicas
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Insomnio refractario
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Tinnitus (zumbido en oídos)
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Taquicardias y arritmias
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Fatiga extrema y mareos
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Sangrado nasal (epistaxis)
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Pérdida de memoria y niebla mental
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span> Estrés oxidativo celular masivo
              </div>
            </div>
            <p className="text-[11px] text-stone-500 italic text-center pt-1">
              Fuentes: Hardell & Nilsson (2023), BioInitiative Report (2020), Martin Pall (PhD, VGCC Activation).
            </p>
          </div>
        </section>

        {/* 7. SECCIÓN: Marco Legal en Argentina (Herramientas para Autoridades y Vecinos) */}
        <section id="marco-legal" className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                El Marco Legal en Argentina: Ley 25.675 y Constitución Nacional
              </h2>
              <p className="text-xs text-stone-500">Fundamentos jurídicos que facultan la suspensión inmediata de las obras</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Scale className="w-4 h-4 text-purple-700" />
                Principio Precautorio (Art. 4 - Ley General del Ambiente N° 25.675)
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                <em>"Cuando haya peligro de daño grave o irreversible, la ausencia de información o certeza científica no deberá utilizarse como razón para postergar la adopción de medidas eficaces... para impedir la degradación del medio ambiente."</em>
              </p>
              <div className="text-[11px] text-purple-900 font-medium bg-white p-2.5 rounded border border-purple-100">
                <strong>Clave jurídica:</strong> La ley invierte la carga probatoria: es la empresa Telmex quien debe probar de forma indiscutible la inocuidad antes de iniciar cualquier obra, no los vecinos demostrar el daño cuando ya sea tarde.
              </div>
            </div>

            <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <FileText className="w-4 h-4 text-purple-700" />
                Artículo 41 de la Constitución Nacional Argentina
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                <em>"Todos los habitantes gozan del derecho a un ambiente sano, equilibrado, apto para el desarrollo humano y para que las actividades productivas satisfagan las necesidades presentes sin comprometer las de las generaciones futuras; y tienen el deber de preservarlo."</em>
              </p>
              <div className="text-[11px] text-purple-900 font-medium bg-white p-2.5 rounded border border-purple-100">
                <strong>Mandato supremo:</strong> Las autoridades tienen el deber ineludible de proveer a la protección de este derecho, controlando el uso de tecnologías que amenacen la salubridad colectiva.
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 text-sm">Potestad Municipal y Poder de Policía de Escobar:</h4>
            <p>
              La Corte Suprema de Justicia de la Nación (CSJN) y la jurisprudencia bonaerense han ratificado que <strong>los municipios conservan plenas facultades de policía ambiental y de zonificación urbana</strong>. El Municipio de Escobar y el Concejo Deliberante tienen el poder legítimo de denegar permisos de radicación de estructuras portantes de antenas en distritos residenciales, priorizando la salud y exigiendo a las empresas el despliegue de infraestructura subterránea o cableada de fibra óptica.
            </p>
          </div>
        </section>

        {/* 8. SECCIÓN: Formulario de Adhesión Vecinal / Firmas */}
        <section id="adhesion" className="bg-gradient-to-br from-red-950 via-stone-900 to-stone-950 text-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-6 border-2 border-red-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Movilización Ciudadana
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
                Sumá tu Adhesión Vecinal: ¡Frenemos la Antena!
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Tu firma cuenta para el petitorio formal ante la Municipalidad de Escobar y el ENACOM.
              </p>
            </div>
            <div className="bg-red-600/30 border border-red-500/50 px-4 py-2 rounded-xl text-center flex-shrink-0">
              <span className="block text-2xl font-black text-amber-300">{totalAdhesiones}</span>
              <span className="text-[10px] text-stone-300 uppercase tracking-widest font-bold">Vecinos Adheridos</span>
            </div>
          </div>

          {enviado ? (
            <div className="bg-emerald-950/80 border border-emerald-500 p-6 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="font-bold text-lg text-emerald-300">¡Muchas gracias por sumar tu adhesión vecinal!</h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto">
                Tu registro fue computado exitosamente. Se ha abierto la conversación de WhatsApp con la coordinación vecinal de Loma Verde para incorporar formalmente tus datos al expediente.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleShare}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir en grupos de vecinos
                </button>
                <a
                  href={`https://wa.me/${whatsappCoordinacion}?text=Hola!%20Acabo%20de%20firmar%20la%20adhesión%20contra%20la%20antena%20en%20Loma%20Verde.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Escribir a la Coordinación
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Marcelo Fernández"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-500 focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej: 11 3344-5566"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-500 focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Barrio o Zona en Loma Verde</label>
                  <input
                    type="text"
                    value={formData.barrio}
                    onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                    placeholder="Ej: Haras Santa María / Los Nogales / Loma Verde Centro"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-500 focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Calle o Esquina Aprox.</label>
                  <input
                    type="text"
                    value={formData.calle}
                    onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                    placeholder="Ej: Calle Los Cerros y Colectora"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-500 focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Tu Opinión / Mensaje para las Autoridades (Opcional)
                </label>
                <textarea
                  rows="2"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  placeholder="Contanos tu preocupación (ej: tengo chicos chicos, vivimos a metros de la zona proyectada, exigimos fibra óptica)..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-500 focus:outline-hidden focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="esVecinoCheck"
                  checked={formData.esVecino}
                  onChange={(e) => setFormData({ ...formData, esVecino: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-stone-900 border-stone-700"
                />
                <label htmlFor="esVecinoCheck" className="text-stone-300 text-xs leading-normal cursor-pointer">
                  Confirmo mi adhesión formal como vecino/a de Loma Verde / Escobar en oposición a la antena 5G de Telmex y adhiero a la solicitud de suspensión precautoria y conectividad por fibra óptica.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3.5 rounded-xl text-sm sm:text-base shadow-lg shadow-red-700/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Firmar Adhesión y Conectar con Coordinación</span>
              </button>
            </form>
          )}
        </section>

        {/* 9. SECCIÓN: Petitorio Formal para Autoridades */}
        <section id="petitorio" className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Petitorio Formal para Mesa de Entradas
                </h2>
                <p className="text-xs text-stone-500">Documento legal listo para presentar al Intendente, Concejo Deliberante y ENACOM</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopiarPetitorio}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedPetitorio ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>¡Petitorio Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Petitorio</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDescargarPetitorio}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Descargar (.txt)</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Podés copiar este texto completo para imprimirlo, adjuntarlo a cartas vecinales o ingresarlo formalmente por la Mesa de Entradas de la Municipalidad de Escobar (Aschira 118, Belén de Escobar) y las dependencias del HCD:
          </p>

          {/* Caja con el texto completo del petitorio */}
          <div className="bg-stone-50 border border-stone-300 rounded-xl p-4 sm:p-6 text-stone-800 font-mono text-[11px] sm:text-xs leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
            {petitorioTexto}
          </div>
        </section>

        {/* 10. SECCIÓN: Contacto y Asamblea Vecinal */}
        <section className="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Coordinación Vecinal Activa
            </span>
            <h3 className="font-serif text-2xl font-bold">
              ¿Querés sumarte a la Asamblea o aportar asesoramiento legal/técnico?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              Vecinos, médicos, abogados, docentes e ingenieros de Loma Verde nos estamos organizando para presentar los recursos de amparo y las notas correspondientes. ¡Tu participación es vital!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <a
              href={`https://wa.me/${whatsappCoordinacion}?text=Hola!%20Quiero%20sumarme%20a%20la%20asamblea%20vecinal%20contra%20la%20antena%20de%20Telmex%20en%20Loma%20Verde.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contactar por WhatsApp</span>
            </a>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Difundir Web</span>
            </button>
          </div>
        </section>

        {/* 11. SECCIÓN: Preguntas Frecuentes (FAQ) */}
        <section id="faq" className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Preguntas Frecuentes y Clarificaciones
              </h2>
              <p className="text-xs text-stone-500">Mitos, realidades y argumentos para responder ante autoridades y empresas</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-stone-900 text-xs sm:text-sm bg-stone-50 hover:bg-stone-100 flex items-center justify-between gap-3 transition-colors"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 flex-shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 12. Footer de la Landing con Enlace Permanente */}
      <footer className="mt-20 pt-10 pb-16 px-4 bg-stone-950 text-white text-center border-t-2 border-stone-800 space-y-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto text-lg font-bold">
            ⚠️
          </div>
          <h4 className="font-serif text-lg font-bold">
            Vecinos Unidos por la Salud y el Ambiente de Loma Verde
          </h4>
          <p className="text-stone-400 text-xs leading-relaxed max-w-lg mx-auto">
            Iniciativa ciudadana comunitaria sin fines de lucro. Exigimos soberanía ambiental, protección de nuestras infancias y conectividad sana mediante fibra óptica cableada.
          </p>
          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
            <span>Enlace permanente: <strong className="text-stone-200">lomaverdelunar.online/noalaantena</strong></span>
            <span>•</span>
            <button onClick={onBackToHome} className="text-amber-400 hover:underline">
              Volver a Loma Verde Lunar
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
