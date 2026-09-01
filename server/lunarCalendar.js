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
    horarioTexto: 'DE 12 A 18 HS',
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
    horarioTexto: 'DE 12 A 18 HS',
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
    horarioTexto: 'DE 12 A 18 HS',
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

  return LUNAR_CALENDAR[4]; // Luna Piscis
}

function getAllLunarCycles() {
  return LUNAR_CALENDAR;
}

function getLunarCycleByName(name) {
  if (!name) return null;
  const n = String(name).toLowerCase();
  return LUNAR_CALENDAR.find(luna => 
    luna.lunaActiva.toLowerCase() === n ||
    luna.signo.toLowerCase() === n ||
    luna.id.toLowerCase() === n ||
    n.includes(luna.signo.toLowerCase())
  ) || null;
}

module.exports = {
  LUNAR_CALENDAR,
  getAutoLunarCycle,
  getAllLunarCycles,
  getLunarCycleByName
};
