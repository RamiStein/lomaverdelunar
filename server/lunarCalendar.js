/**
 * ============================================================================
 * MOTOR DE CALENDARIO Y CICLOS LUNARES 13:20 - LOMA VERDE LUNAR
 * ============================================================================
 * Gestiona el calendario continuo de plenilunios, signos zodiacales,
 * fechas de ferias, textos místicos, iconografía y transiciones automáticas.
 */

const LUNAR_CALENDAR = [
  {
    id: 'luna-escorpio-2026',
    lunaActiva: 'Luna Escorpio',
    signo: 'Escorpio',
    simboloZodiacal: '♏',
    elemento: 'Agua Fija 🌊',
    fechaEvento: '2026-05-02',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '2 DE MAYO',
    horarioTexto: 'DE 12 A 18 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Transformación profunda, reciclaje de energía y renacimiento comunitario.',
    mistica: 'La Luna Llena en Escorpio nos convoca a mirar nuestras raíces, transmutar lo viejo en tierra fértil y celebrar el misterio que nos une. Tiempo de alquimia colectiva, soberanía y poder compartido.',
    tags: ['Transmutación', 'Misterio y Raíces', 'Alquimia Comunitaria'],
    fechaInicio: '2026-04-15',
    fechaFin: '2026-05-05'
  },
  {
    id: 'luna-sagitario-2026',
    lunaActiva: 'Luna Sagitario',
    signo: 'Sagitario',
    simboloZodiacal: '♐',
    elemento: 'Fuego Mutable 🔥',
    fechaEvento: '2026-06-06',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '6 DE JUNIO',
    horarioTexto: 'DE 12 A 18 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Expansión de horizontes, sabiduría compartida y alegría de encontrarnos.',
    mistica: 'La Luna Llena en Sagitario enciende la flecha del propósito común, la verdad sentida y la confianza en el camino comunitario. Conectamos con el fuego de la celebración, los saberes ancestrales y el disfrute.',
    tags: ['Expansión', 'Saberes Ancestrales', 'Optimismo y Fuego'],
    fechaInicio: '2026-05-06',
    fechaFin: '2026-06-15'
  },
  {
    id: 'luna-capricornio-2026',
    lunaActiva: 'Luna Capricornio',
    signo: 'Capricornio',
    simboloZodiacal: '♑',
    elemento: 'Tierra Cardinal ⛰️',
    fechaEvento: '2026-07-11',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '11 DE JULIO',
    horarioTexto: 'DE 12 A 18 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Construyendo realidades sólidas, soberanas y perdurables para nuestro barrio.',
    mistica: 'La Luna Llena en Capricornio nos ancla en la tierra para materializar sueños comunitarios. Es la energía de la perseverancia, el compromiso mutuo y las estructuras que sostienen la vida colectiva.',
    tags: ['Estructura Soberana', 'Perseverancia', 'Materialización'],
    fechaInicio: '2026-06-16',
    fechaFin: '2026-07-20'
  },
  {
    id: 'luna-acuario-2026',
    lunaActiva: 'Luna Acuario',
    signo: 'Acuario',
    simboloZodiacal: '♒',
    elemento: 'Aire Fijo 🌬️',
    fechaEvento: '2026-08-08',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '8 DE AGOSTO',
    horarioTexto: 'DE 12 A 18 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Tejiendo redes libres, vanguardia comunitaria y economías del bien común.',
    mistica: 'La Luna Llena en Acuario trae la visión del futuro al presente. Es la luna de las redes horizontales, la innovación social, la sincronía 13:20 y el florecimiento del talento de cada vecino al servicio del todo.',
    tags: ['Redes Libres', 'Frecuencia 13:20', 'Bien Común'],
    fechaInicio: '2026-07-21',
    fechaFin: '2026-08-18'
  },
  {
    id: 'luna-piscis-2026',
    lunaActiva: 'Luna Piscis',
    signo: 'Piscis',
    simboloZodiacal: '♓',
    elemento: 'Agua Mutable 🌊',
    fechaEvento: '2026-09-05',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '5 DE SEPTIEMBRE',
    horarioTexto: 'DE 12 A 18 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Un encuentro para compartir, conectar y fortalecer nuestra comunidad. ♡',
    mistica: 'La Luna Llena en Piscis nos invita a sumergirnos en la sensibilidad, la empatía profunda y la creatividad colectiva. Piscis es el agua que todo lo abraza, recordándonos que somos parte de un mismo tejido vivo. Unimos arte, música del corazón, economía solidaria y cuidado mutuo.',
    tags: ['Sensibilidad Cósmica', 'Empatía y Sanación', 'Arte y Poesía'],
    fechaInicio: '2026-08-19',
    fechaFin: '2026-09-12'
  },
  {
    id: 'luna-aries-2026',
    lunaActiva: 'Luna Aries',
    signo: 'Aries',
    simboloZodiacal: '♈',
    elemento: 'Fuego Cardinal 🔥',
    fechaEvento: '2026-10-03',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '3 DE OCTUBRE',
    horarioTexto: 'DE 13 A 19 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Impulso, vitalidad, coraje emprendedor y nuevos comienzos bajo el sol de primavera.',
    mistica: 'La Luna Llena en Aries despierta el fuego creador y la chispa pionera. Es el momento de dar el primer paso, activar nuevos proyectos en el barrio y expresar la fuerza viva de nuestra comunidad.',
    tags: ['Fuego Creador', 'Iniciativa', 'Primavera'],
    fechaInicio: '2026-09-13',
    fechaFin: '2026-10-10'
  },
  {
    id: 'luna-tauro-2026',
    lunaActiva: 'Luna Tauro',
    signo: 'Tauro',
    simboloZodiacal: '♉',
    elemento: 'Tierra Fija 🌸',
    fechaEvento: '2026-10-31',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '31 DE OCTUBRE',
    horarioTexto: 'DE 13 A 19 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Celebrando la abundancia de la tierra, la soberanía alimentaria y el goce consciente.',
    mistica: 'La Luna Llena en Tauro nos arraiga en la belleza de lo simple: los frutos de la huerta, los aromas naturales, el trabajo manual con amor y el valor genuino de lo que producimos con nuestras manos.',
    tags: ['Abundancia', 'Frutos de la Tierra', 'Soberanía Alimentaria'],
    fechaInicio: '2026-10-11',
    fechaFin: '2026-11-08'
  },
  {
    id: 'luna-geminis-2026',
    lunaActiva: 'Luna Géminis',
    signo: 'Géminis',
    simboloZodiacal: '♊',
    elemento: 'Aire Mutable 🍃',
    fechaEvento: '2026-11-28',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '28 DE NOVIEMBRE',
    horarioTexto: 'DE 13 A 19 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Palabras que unen, juego, intercambio de saberes y curiosidad compartida.',
    mistica: 'La Luna Llena en Géminis dinamiza el encuentro barrial a través de la comunicación, la música, los talleres y la liviandad de aprender unos de otros bajo la brisa primaveral.',
    tags: ['Comunicación', 'Intercambio de Saberes', 'Juego y Talleres'],
    fechaInicio: '2026-11-09',
    fechaFin: '2026-12-08'
  },
  {
    id: 'luna-cancer-2026',
    lunaActiva: 'Luna Cáncer',
    signo: 'Cáncer',
    simboloZodiacal: '♋',
    elemento: 'Agua Cardinal 🌊',
    fechaEvento: '2026-12-26',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '26 DE DICIEMBRE',
    horarioTexto: 'DE 12 A 19 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'El hogar comunitario, la nutrición del alma, las raíces y el abrazo de fin de año.',
    mistica: 'La Luna Llena en Cáncer nos abraza como una gran familia extendida. Celebramos el cierre de ciclos, la memoria de lo vivido y el calor de cuidar a nuestros vecinos como a nuestro propio hogar.',
    tags: ['Hogar Comunitario', 'Cuidado y Afecto', 'Celebración de Cierre'],
    fechaInicio: '2026-12-09',
    fechaFin: '2027-01-08'
  },
  {
    id: 'luna-leo-2027',
    lunaActiva: 'Luna Leo',
    signo: 'Leo',
    simboloZodiacal: '♌',
    elemento: 'Fuego Fijo ☀️',
    fechaEvento: '2027-01-23',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '23 DE ENERO',
    horarioTexto: 'DE 16 A 21 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Brillo radiante, expresión artística, corazón abierto y fiesta de verano.',
    mistica: 'La Luna Llena en Leo ilumina el escenario de talentos de Loma Verde. Es la luna de la alegría sin reservas, del juego de los niños en la plaza y de compartir el fuego de nuestra autenticidad.',
    tags: ['Brillo del Corazón', 'Arte en Vivo', 'Noche de Verano'],
    fechaInicio: '2027-01-09',
    fechaFin: '2027-02-08'
  },
  {
    id: 'luna-virgo-2027',
    lunaActiva: 'Luna Virgo',
    signo: 'Virgo',
    simboloZodiacal: '♍',
    elemento: 'Tierra Mutable 🌾',
    fechaEvento: '2027-02-20',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '20 DE FEBRERO',
    horarioTexto: 'DE 15 A 20 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Cosecha con amor, medicina natural, salud integral y orden sagrado.',
    mistica: 'La Luna Llena en Virgo nos conecta con la sabiduría de las plantas, las terapias de bienestar, el servicio desinteresado y el cuidado minucioso de cada detalle que hace florecer a nuestra comunidad.',
    tags: ['Cosecha y Salud', 'Medicina de la Tierra', 'Servicio Amoroso'],
    fechaInicio: '2027-02-09',
    fechaFin: '2027-03-08'
  },
  {
    id: 'luna-libra-2027',
    lunaActiva: 'Luna Libra',
    signo: 'Libra',
    simboloZodiacal: '♎',
    elemento: 'Aire Cardinal 🕊️',
    fechaEvento: '2027-03-20',
    diaSemanaTexto: 'SÁBADO',
    fechaEventoTexto: '20 DE MARZO',
    horarioTexto: 'DE 12 A 18 HS',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Equinoccio, armonía, belleza, acuerdos justos y reciprocidad comunitaria.',
    mistica: 'La Luna Llena en Libra marca el equilibrio perfecto entre el día y la noche en el equinoccio. Un portal para cultivar la diplomacia del corazón, la estética sagrada y la belleza del encuentro pacífico.',
    tags: ['Equinoccio', 'Armonía y Paz', 'Reciprocidad 13:20'],
    fechaInicio: '2027-03-09',
    fechaFin: '2027-04-05'
  }
];

function getAutoLunarCycle(targetDate = new Date()) {
  const now = new Date(targetDate);
  const nowIso = now.toISOString().split('T')[0];

  const match = LUNAR_CALENDAR.find(luna => nowIso >= luna.fechaInicio && nowIso <= luna.fechaFin);
  if (match) return match;

  const future = LUNAR_CALENDAR.find(luna => nowIso <= luna.fechaFin);
  if (future) return future;

  return LUNAR_CALENDAR[5] || LUNAR_CALENDAR[0];
}

function getUpcomingMoons(targetDate = new Date()) {
  const now = new Date(targetDate);
  const nowIso = now.toISOString().split('T')[0];
  const activeCycle = getAutoLunarCycle(targetDate);

  const activeIndex = LUNAR_CALENDAR.findIndex(l => l.id === activeCycle.id);
  const fromIndex = activeIndex >= 0 ? activeIndex : 0;

  return LUNAR_CALENDAR.slice(fromIndex).map((luna, idx) => {
    const eventDate = new Date(luna.fechaEvento + 'T12:00:00-03:00');
    const diffMs = eventDate.getTime() - now.getTime();
    const diasFaltantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      ...luna,
      esActiva: idx === 0,
      diasFaltantes: diasFaltantes > 0 ? diasFaltantes : 0,
      ordenConsecutivo: idx + 1
    };
  });
}

function getAllLunarCycles() {
  return LUNAR_CALENDAR;
}

function getEnergiaDelDia(customData = {}) {
  const defaults = {
    fechaTexto: "Jueves 15 de Octubre de 2026",
    sol: {
      signo: "Libra",
      simbolo: "♎",
      elemento: "Aire Cardinal 🌬️",
      regente: "Venus 🌸",
      arquetipo: "El Pacificador y Creador de Armonía",
      descripcion: "El Sol transita por Libra, invitándonos a equilibrar la balanza en nuestras relaciones, crear belleza cotidiana y tejer acuerdos justos. En la comunidad, es la energía de la reciprocidad y la diplomacia del corazón.",
      lema: "Encuentro en el otro el reflejo de mi propia armonía."
    },
    luna: {
      signo: "Sagitario",
      simbolo: "♐",
      elemento: "Fuego Mutable 🔥",
      regente: "Júpiter ⚡",
      arquetipo: "El Explorador y Buscador de la Verdad",
      descripcion: "La Luna en Sagitario enciende el entusiasmo colectivo, la fe en el porvenir y las ganas de expandir horizontes. Nos inspira a compartir ideas con optimismo y a celebrar el camino comunitario con alegría.",
      lema: "La flecha de la intuición vuela hacia el propósito compartido."
    },
    maya: {
      kinNumero: 50,
      kinNombre: "Perro Espectral Blanco",
      kinCodigo: "Kin 50 • Oc • Tono 11",
      selloNombre: "Perro Blanco (Oc)",
      selloIcono: "🐾",
      selloColor: "Blanco (Refina y Purifica)",
      selloPoder: "El Poder del Corazón",
      selloAccion: "Amar incondicionalmente, ser leal y custodiar el afecto",
      tonoNombre: "Tono 11 • Espectral",
      tonoIcono: "✨",
      tonoPoder: "La Disolución y la Liberación",
      tonoAccion: "Liberar, soltar lo caduco y divulgar la verdad",
      tonoPregunta: "¿Cómo me libero de ataduras y suelto lo que pesa para expandir mi luz?",
      ondaEncantada: "Onda Encantada del Sol (Ahau)",
      ondaNumero: 4,
      ondaProposito: "Iluminar la vida desde el fuego universal, la consciencia despierta y la ascensión colectiva.",
      posicionEnOnda: "Día 11 de 13 (Portal de la Liberación)",
      afirmacion: "Disuelvo con el fin de amar,\nliberando la lealtad.\nSello el proceso del corazón\ncon el tono espectral de la liberación.\nMe guía mi propio poder duplicado.",
      oraculo: {
        guia: {
          nombre: "Perro Espectral Blanco",
          rol: "Guía por poder duplicado",
          descripcion: "Tu propio corazón sincero es la brújula inquebrantable hoy. No busques afuera lo que tu lealtad interna ya sabe."
        },
        analogo: {
          nombre: "Luna Espectral Roja (Muluc)",
          rol: "Sostén Análogo",
          descripcion: "Flujo de las emociones sagradas. Llorar, reír y dejar que las aguas corran para limpiar el alma comunitaria."
        },
        antipoda: {
          nombre: "Mono Espectral Azul (Chuen)",
          rol: "Desafío y Espejo",
          descripcion: "No te tomes las cosas con gravedad rígida. La magia, el juego y el humor son el puente para desarmar ilusiones."
        },
        oculto: {
          nombre: "Sol Autoexistente Amarillo (Ahau)",
          rol: "Poder Oculto",
          descripcion: "Definir la estructura de la luz. Cuando el amor es genuino, la verdad ilumina cualquier oscuridad sin esfuerzo."
        }
      }
    },
    sintoniaLomaVerde: {
      titulo: "Sintonía Comunitaria para Hoy en Loma Verde",
      bajada: "¿Cómo resuena esta frecuencia en nuestro barrio y con la tierra?",
      reflexion: "Hoy es un día sagrado para la liberación del corazón. Con el Sol en Libra buscamos el entendimiento mutuo y la belleza de estar juntos, mientras que la Luna en Sagitario nos impulsa con fuego y entusiasmo. El Kin 50 Perro Espectral Blanco nos invita a disolver viejos rencores, soltar mochilas y reafirmar la lealtad con los compañeros del destino: nuestros vecinos, la familia de la feria y los guardianes de este suelo verde.",
      claves: [
        "🌿 Abrazá la fraternidad: Si cruzás a un vecino en la calle o en la plaza, saludalo con presencia. El corazón del Perro reconoce a los suyos.",
        "🕊️ Soltá lo innecesario: La vibración espectral disuelve tensiones pasadas. Excelente día para perdonar, clarificar acuerdos y vivir livianos.",
        "🔥 Canalizá el entusiasmo sagitariano: Ideá proyectos que expandan el bienestar barrial con alegría y espíritu generoso.",
        "⚖️ Armonizá tu espacio: Regalale a tu casa o jardín un toque de belleza y equilibrio bajo la mirada venusina de Libra."
      ]
    }
  };

  return {
    ...defaults,
    ...customData,
    sol: { ...defaults.sol, ...(customData.sol || {}) },
    luna: { ...defaults.luna, ...(customData.luna || {}) },
    maya: {
      ...defaults.maya,
      ...(customData.maya || {}),
      oraculo: { ...defaults.maya.oraculo, ...(customData.maya?.oraculo || {}) }
    },
    sintoniaLomaVerde: {
      ...defaults.sintoniaLomaVerde,
      ...(customData.sintoniaLomaVerde || {})
    }
  };
}

module.exports = {
  LUNAR_CALENDAR,
  getAutoLunarCycle,
  getUpcomingMoons,
  getAllLunarCycles,
  getLunarCycleByName,
  getEnergiaDelDia
};
