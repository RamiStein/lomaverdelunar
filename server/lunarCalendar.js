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
    fechaFin: '2026-10-03'
  },
  {
    id: 'luna-tauro-2026',
    lunaActiva: 'Luna Tauro',
    signo: 'Tauro',
    simboloZodiacal: '♉',
    elemento: 'Tierra Fija 🌿🐂',
    fechaEvento: '2026-11-08',
    diaSemanaTexto: 'DOMINGO',
    fechaEventoTexto: '8 DE NOVIEMBRE',
    horarioTexto: 'HORARIO A DEFINIR',
    lugarTexto: 'Plaza La Misión y Nigromante • Loma Verde',
    lema: 'Celebrando la abundancia de la tierra, la soberanía alimentaria, el enraizamiento y el goce consciente.',
    mistica: 'La Luna Llena en Tauro nos enraíza en la belleza y fertilidad de la tierra. Momento de honrar los frutos de la huerta, las manos hacedoras, la economía fraterna y el cuidado paciente de lo que amamos. Conectamos con el valor genuino de la materia viva y la reciprocidad comunitaria. ♉🌿🐂🌾',
    tags: ['Abundancia', 'Frutos de la Tierra', 'Soberanía Alimentaria', 'Enraizamiento'],
    fechaInicio: '2026-10-04',
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

  return LUNAR_CALENDAR[6] || LUNAR_CALENDAR[0];
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

function getLunarCycleByName(name = '') {
  if (!name) return getAutoLunarCycle();
  const clean = name.toLowerCase().trim();
  return LUNAR_CALENDAR.find(l => 
    l.lunaActiva.toLowerCase().includes(clean) || 
    l.signo.toLowerCase().includes(clean) || 
    l.id.toLowerCase().includes(clean)
  ) || LUNAR_CALENDAR[6];
}

const ZODIAC_SIGNS = [
  { 
    signo: "Aries", simbolo: "♈", elemento: "Fuego Cardinal 🔥", regente: "Marte ⚔️", 
    arquetipo: "El Pionero y Activador del Fuego",
    lema: "Doy el primer paso con coraje y enciendo la chispa creadora.",
    descSol: "El Sol en Aries despierta el impulso de avanzar, iniciar proyectos audaces y manifestar el liderazgo personal con determinación y fuerza viva.",
    descLuna: "La Luna en Aries enciende el entusiasmo impulsivo, el coraje instantáneo y las ganas de emprender sin vacilar ante los desafíos cotidianos."
  },
  { 
    signo: "Tauro", simbolo: "♉", elemento: "Tierra Fija 🌿🐂", regente: "Venus 🌸", 
    arquetipo: "El Custodio de la Abundancia y la Materia Viva",
    lema: "Enraízo en el valor genuino de la tierra y disfruto la belleza sencilla.",
    descSol: "El Sol en Tauro nos invita a enraizarnos con paciencia, cuidar la tierra fértil, sembrar economía fraterna y saborear la abundancia tangible de la vida.",
    descLuna: "La Luna en Tauro aquieta las emociones, arraigando en el goce de los sentidos, la tranquilidad afectiva, la buena mesa y la reciprocidad comunitaria."
  },
  { 
    signo: "Géminis", simbolo: "♊", elemento: "Aire Mutable 🍃", regente: "Mercurio 📜", 
    arquetipo: "El Mensajero y Tejedor de Redes",
    lema: "Conecto saberes y tiendo puentes fraternos con la palabra viva.",
    descSol: "El Sol en Géminis dinamiza el intercambio de ideas, la curiosidad compartida y el aprendizaje mutuo en toda la comunidad barrial.",
    descLuna: "La Luna en Géminis activa la charla vecinal, la búsqueda de datos frescos, la versatilidad y la necesidad de comunicar lo que sentimos con agilidad."
  },
  { 
    signo: "Cáncer", simbolo: "♋", elemento: "Agua Cardinal 🌊", regente: "Luna 🌙", 
    arquetipo: "El Guardián del Hogar y la Memoria Afectiva",
    lema: "Nutro mis raíces y cobijo a mi comunidad como una gran familia.",
    descSol: "El Sol en Cáncer ilumina la importancia del cuidado mutuo, las raíces del pueblo, la memoria histórica y la protección fraterna de los más vulnerables.",
    descLuna: "La Luna en Cáncer profundiza la sensibilidad y el sentido de pertenencia, invitando a reunirse al calor del hogar y compartir el afecto más tierno."
  },
  { 
    signo: "Leo", simbolo: "♌", elemento: "Fuego Fijo ☀️", regente: "Sol ☀️", 
    arquetipo: "El Soberano Generoso y Creador del Corazón",
    lema: "Irradio mi luz genuina y celebro el arte de estar vivos.",
    descSol: "El Sol en Leo potencia la creatividad artística, el carisma solidario, la nobleza del corazón y la expresión alegre de nuestros dones en comunidad.",
    descLuna: "La Luna en Leo enciende la alegría expresiva, el juego creador, la lealtad fraterna y el deseo de ver brillar a cada vecino en su autenticidad."
  },
  { 
    signo: "Virgo", simbolo: "♍", elemento: "Tierra Mutable 🌾", regente: "Mercurio 📜", 
    arquetipo: "El Servidor Sabio y Alquimista de los Detalles",
    lema: "Pongo mis dones al servicio humilde del bienestar común.",
    descSol: "El Sol en Virgo nos orienta hacia la salud integral, el orden sagrado de lo cotidiano, el compostaje, la huerta y la eficiencia colaborativa.",
    descLuna: "La Luna en Virgo aporta sobriedad mental, ganas de ordenar y colaborar en tareas prácticas para que todo funcione en armonía barrial."
  },
  { 
    signo: "Libra", simbolo: "♎", elemento: "Aire Cardinal 🌬️", regente: "Venus 🌸", 
    arquetipo: "El Pacificador y Creador de Armonía",
    lema: "Encuentro en el otro el reflejo de mi propia armonía.",
    descSol: "El Sol transita por Libra, invitándonos a equilibrar la balanza en nuestras relaciones, crear belleza cotidiana y tejer acuerdos justos con diplomacia del corazón.",
    descLuna: "La Luna en Libra suaviza los ánimos colectivos, facilitando acuerdos armoniosos, tertulias pacíficas y sensibilidad hacia el arte y la convivencia."
  },
  { 
    signo: "Escorpio", simbolo: "♏", elemento: "Agua Fija 🦂", regente: "Plutón / Marte ⚡", 
    arquetipo: "El Alquimista de las Sombras y Renacedor",
    lema: "Transformo el dolor en sabiduría y renazco desde la verdad profunda.",
    descSol: "El Sol en Escorpio nos adentra en la transmutación profunda, la honestidad radical, la sanación de heridas colectivas y el poder regenerativo del alma.",
    descLuna: "La Luna en Escorpio intensifica las emociones, desnudando intenciones ocultas y consolidando lazos de lealtad indestructible entre pares."
  },
  { 
    signo: "Sagitario", simbolo: "♐", elemento: "Fuego Mutable 🔥", regente: "Júpiter ⚡", 
    arquetipo: "El Explorador y Buscador de la Verdad",
    lema: "La flecha de la intuición vuela hacia el propósito compartido.",
    descSol: "El Sol en Sagitario expande nuestra visión de futuro, la generosidad comunitaria, la fe inquebrantable y la búsqueda de una sabiduría trascendente.",
    descLuna: "La Luna en Sagitario enciende el entusiasmo colectivo, la fe en el porvenir y las ganas de expandir horizontes y celebrar el camino comunitario."
  },
  { 
    signo: "Capricornio", simbolo: "♑", elemento: "Tierra Cardinal 🏔️", regente: "Saturno 🪐", 
    arquetipo: "El Constructor Paciente y Guardián del Tiempo",
    lema: "Paso a paso edifico cimientos sólidos que honren a las futuras generaciones.",
    descSol: "El Sol en Capricornio estructura nuestros objetivos más nobles con constancia, disciplina amorosa y madurez para consolidar la soberanía del pueblo.",
    descLuna: "La Luna en Capricornio aporta templanza constructiva, madurez emocional, enfoque realista y voluntad de sostener los acuerdos asumidos."
  },
  { 
    signo: "Acuario", simbolo: "♒", elemento: "Aire Fijo ⚡", regente: "Urano / Saturno 🌐", 
    arquetipo: "El Visionario Libre y Tejedora de Comunidad",
    lema: "Despierto a la fraternidad universal y diseño el mundo nuevo en red horizontal.",
    descSol: "El Sol en Acuario convoca a la innovación solidaria, la libertad comunitaria, el pensamiento libre y la caída de viejas jerarquías obsoletas.",
    descLuna: "La Luna en Acuario desapega de dramatismos individuales, estimula la originalidad colectiva y refuerza el compañerismo horizontal."
  },
  { 
    signo: "Piscis", simbolo: "♓", elemento: "Agua Mutable 🐟", regente: "Neptuno / Júpiter 🌊", 
    arquetipo: "El Místico Compasivo y Poeta del Mar Cósmico",
    lema: "Me fundo en el amor universal que todo lo abraza y disuelve las fronteras.",
    descSol: "El Sol en Piscis nos sumerge en la empatía pura, la sensibilidad espiritual, la música sagrada y la certeza de que somos gotas de un mismo océano vivo.",
    descLuna: "La Luna en Piscis sensibiliza el corazón colectivo, envolviéndonos en empatía, imaginación poética y resonancia amorosa compartida."
  }
];

const MAYA_SELLOS = [
  { id: 1, nombre: "Dragón Rojo (Imix)", raiz: "Dragón", maya: "Imix", color: "Rojo", icono: "🐲", poder: "el nacimiento", accion: "nutrir", esencia: "el ser", raza: "Inicia el Ser" },
  { id: 2, nombre: "Viento Blanco (Ik)", raiz: "Viento", maya: "Ik", color: "Blanco", icono: "💨", poder: "el espíritu", accion: "comunicar", esencia: "el aliento", raza: "Refina el Sentir" },
  { id: 3, nombre: "Noche Azul (Akbal)", raiz: "Noche", maya: "Akbal", color: "Azul", icono: "🌌", poder: "la abundancia", accion: "soñar", esencia: "la intuición", raza: "Transforma la Ilusión" },
  { id: 4, nombre: "Semilla Amarilla (Kan)", raiz: "Semilla", maya: "Kan", color: "Amarillo", icono: "🌱", poder: "el florecimiento", accion: "atinar", esencia: "la consciencia", raza: "Madura el Fruto" },
  { id: 5, nombre: "Serpiente Roja (Chicchan)", raiz: "Serpiente", maya: "Chicchan", color: "Rojo", icono: "🐍", poder: "la fuerza vital", accion: "sobrevivir", esencia: "el instinto", raza: "Inicia el Ser" },
  { id: 6, nombre: "Enlazador de Mundos Blanco (Cimi)", raiz: "Enlazador de Mundos", maya: "Cimi", color: "Blanco", icono: "🌉", poder: "la muerte y el renacimiento", accion: "igualar", esencia: "la oportunidad", raza: "Refina el Sentir" },
  { id: 7, nombre: "Mano Azul (Manik)", raiz: "Mano", maya: "Manik", color: "Azul", icono: "🖐️", poder: "la realización", accion: "conocer", esencia: "la sanación", raza: "Transforma la Ilusión" },
  { id: 8, nombre: "Estrella Amarilla (Lamat)", raiz: "Estrella", maya: "Lamat", color: "Amarillo", icono: "⭐", poder: "la elegancia", accion: "embellecer", esencia: "el arte", raza: "Madura el Fruto" },
  { id: 9, nombre: "Luna Roja (Muluc)", raiz: "Luna", maya: "Muluc", color: "Rojo", icono: "💧", poder: "el agua universal", accion: "purificar", esencia: "el flujo", raza: "Inicia el Ser" },
  { id: 10, nombre: "Perro Blanco (Oc)", raiz: "Perro", maya: "Oc", color: "Blanco", icono: "🐾", poder: "el corazón", accion: "amar", esencia: "la lealtad", raza: "Refina el Sentir" },
  { id: 11, nombre: "Mono Azul (Chuen)", raiz: "Mono", maya: "Chuen", color: "Azul", icono: "🐒", poder: "la magia", accion: "jugar", esencia: "la ilusión", rol: "Transforma la Ilusión" },
  { id: 12, nombre: "Humano Amarillo (Eb)", raiz: "Humano", maya: "Eb", color: "Amarillo", icono: "🌾", poder: "el libre albedrío", accion: "influenciar", esencia: "la sabiduría", raza: "Madura el Fruto" },
  { id: 13, nombre: "Caminante del Cielo Rojo (Ben)", raiz: "Caminante del Cielo", maya: "Ben", color: "Rojo", icono: "🚶", poder: "el espacio", accion: "explorar", esencia: "la vigilancia", raza: "Inicia el Ser" },
  { id: 14, nombre: "Mago Blanco (Ix)", raiz: "Mago", maya: "Ix", color: "Blanco", icono: "🧙", poder: "la atemporalidad", accion: "encantar", esencia: "la receptividad", raza: "Refina el Sentir" },
  { id: 15, nombre: "Águila Azul (Men)", raiz: "Águila", maya: "Men", color: "Azul", icono: "🦅", poder: "la visión", accion: "crear", esencia: "la mente", raza: "Transforma la Ilusión" },
  { id: 16, nombre: "Guerrero Amarillo (Cib)", raiz: "Guerrero", maya: "Cib", color: "Amarillo", icono: "🏹", poder: "la inteligencia", accion: "cuestionar", esencia: "la intrepidez", raza: "Madura el Fruto" },
  { id: 17, nombre: "Tierra Roja (Caban)", raiz: "Tierra", maya: "Caban", color: "Rojo", icono: "🌍", poder: "la navegación", accion: "evolucionar", esencia: "la sincronía", raza: "Inicia el Ser" },
  { id: 18, nombre: "Espejo Blanco (Etznab)", raiz: "Espejo", maya: "Etznab", color: "Blanco", icono: "🪞", poder: "el sinfín", accion: "reflejar", esencia: "el orden", raza: "Refina el Sentir" },
  { id: 19, nombre: "Tormenta Azul (Cauac)", raiz: "Tormenta", maya: "Cauac", color: "Azul", icono: "⛈️", poder: "la autogeneración", accion: "catalizar", esencia: "la energía", raza: "Transforma la Ilusión" },
  { id: 20, nombre: "Sol Amarillo (Ahau)", raiz: "Sol", maya: "Ahau", color: "Amarillo", icono: "☀️", poder: "el fuego universal", accion: "iluminar", esencia: "la vida", raza: "Madura el Fruto" }
];

const MAYA_TONOS = [
  { numero: 1, nombre: "Tono 1 • Magnético", nombreCorto: "Magnético", accionVerbo: "Unifico", funcionVerbo: "atrayendo", cualidad: "el propósito", poder: "La Unificación", accion: "Atraer y Unificar", pregunta: "¿Cuál es mi propósito?", rolOnda: "Identificar el Propósito del ciclo" },
  { numero: 2, nombre: "Tono 2 • Lunar", nombreCorto: "Lunar", accionVerbo: "Polarizo", funcionVerbo: "estabilizando", cualidad: "el desafío", poder: "La Polaridad Consciente", accion: "Estabilizar e Integrar polaridades", pregunta: "¿Cuáles son mis desafíos y cómo los integro?", rolOnda: "Identificar los Desafíos a trascender" },
  { numero: 3, nombre: "Tono 3 • Eléctrico", nombreCorto: "Eléctrico", accionVerbo: "Activo", funcionVerbo: "vinculando", cualidad: "el servicio", poder: "La Activación de Red", accion: "Activar y Vincular en fraternidad", pregunta: "¿Cómo puedo servir mejor a la comunidad?", rolOnda: "Activar el Servicio colaborativo" },
  { numero: 4, nombre: "Tono 4 • Autoexistente", nombreCorto: "Autoexistente", accionVerbo: "Defino", funcionVerbo: "midiendo", cualidad: "la forma", poder: "La Definición", accion: "Dar Forma tangible y medir la acción", pregunta: "¿Cuál es la forma óptima de mi acción?", rolOnda: "Definir la Estructura de la obra" },
  { numero: 5, nombre: "Tono 5 • Entonado", nombreCorto: "Entonado", accionVerbo: "Empodero", funcionVerbo: "comandando", cualidad: "el esplendor", poder: "El Mandato Interno", accion: "Tomar el Centro y el Mando consciente", pregunta: "¿Cómo tomo mi verdadero poder con humildad?", rolOnda: "Reunir los Recursos esenciales" },
  { numero: 6, nombre: "Tono 6 • Rítmico", nombreCorto: "Rítmico", accionVerbo: "Organizo", funcionVerbo: "equilibrando", cualidad: "la igualdad", poder: "El Equilibrio Orgánico", accion: "Organizar los recursos en armonía", pregunta: "¿Cómo administro el equilibrio en mis relaciones?", rolOnda: "Equilibrar el Flujo de energía" },
  { numero: 7, nombre: "Tono 7 • Resonante", nombreCorto: "Resonante", accionVerbo: "Canalizo", funcionVerbo: "inspirando", cualidad: "la sintonía", poder: "La Mística y la Canalización", accion: "Sintonizar la columna vertebral cósmica", pregunta: "¿Cómo me alineo a la sincronía más elevada?", rolOnda: "Sintonizar con la Sabiduría Sagrada" },
  { numero: 8, nombre: "Tono 8 • Galáctico", nombreCorto: "Galáctico", accionVerbo: "Armonizo", funcionVerbo: "modelando", cualidad: "la integridad", poder: "La Coherencia", accion: "Vivir lo que se predica con verdad", pregunta: "¿Vivo realmente en coherencia con lo que creo?", rolOnda: "Integrar la Coherencia de vida" },
  { numero: 9, nombre: "Tono 9 • Solar", nombreCorto: "Solar", accionVerbo: "Pulso", funcionVerbo: "realizando", cualidad: "la intención", poder: "El Impulso Solar", accion: "Movilizar la intención hacia adelante", pregunta: "¿Cómo alcanzo mi meta con firmeza?", rolOnda: "Pulsar la Intención hacia la meta" },
  { numero: 10, nombre: "Tono 10 • Planetario", nombreCorto: "Planetario", accionVerbo: "Perfecciono", funcionVerbo: "produciendo", cualidad: "la manifestación", poder: "La Obra Concreta", accion: "Materializar la obra con excelencia", pregunta: "¿Cómo mejoro y manifiesto lo que ofrezco?", rolOnda: "Manifestar los Frutos en la materia" },
  { numero: 11, nombre: "Tono 11 • Espectral", nombreCorto: "Espectral", accionVerbo: "Disuelvo", funcionVerbo: "liberando", cualidad: "la liberación", poder: "La Disolución Sagrada", accion: "Soltar amarras, disolver y compartir", pregunta: "¿Cómo me libero de lo que pesa para ser liviano?", rolOnda: "Liberar, Soltar y Divulgar la verdad" },
  { numero: 12, nombre: "Tono 12 • Cristal", nombreCorto: "Cristal", accionVerbo: "Dedico", funcionVerbo: "universalizando", cualidad: "la cooperación", poder: "La Mesa Redonda", accion: "Cooperar comunitariamente en fraternidad", pregunta: "¿Cómo colaboro con el todo de forma altruista?", rolOnda: "Consagrar en Cooperación comunitaria" },
  { numero: 13, nombre: "Tono 13 • Cósmico", nombreCorto: "Cósmico", accionVerbo: "Perduro", funcionVerbo: "trascendiendo", cualidad: "la presencia", poder: "La Trascendencia", accion: "Trascender con alegría y vuelo libre", pregunta: "¿Cómo expando mi presencia y alegría viva?", rolOnda: "Trascender hacia una nueva octava" }
];

function getJulianDay(date) {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  if (month < 3) {
    year--;
    month += 12;
  }
  let a = Math.floor(year / 100);
  let b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function calculateSunPosition(date) {
  const jd = getJulianDay(date);
  const T = (jd - 2451545.0) / 36525;
  const rad = Math.PI / 180;
  const L0 = (280.46646 + 36000.76983 * T) % 360;
  const M = (357.52911 + 35999.05029 * T) % 360;
  const C = (1.914602 - 0.004817 * T) * Math.sin(M * rad) 
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M * rad) 
          + 0.000289 * Math.sin(3 * M * rad);
  const lon = ((L0 + C) % 360 + 360) % 360;
  const signIdx = Math.floor(lon / 30);
  const sign = ZODIAC_SIGNS[signIdx];
  const deg = Math.floor(lon % 30);
  return {
    signo: sign.signo,
    simbolo: sign.simbolo,
    elemento: sign.elemento,
    regente: sign.regente,
    arquetipo: sign.arquetipo,
    descripcion: sign.descSol,
    lema: sign.lema,
    grado: deg
  };
}

function calculateMoonPosition(date) {
  const jd = getJulianDay(date);
  const T = (jd - 2451545.0) / 36525;
  const rad = Math.PI / 180;
  const L0 = (218.3164477 + 481267.88123421 * T) % 360;
  const D = (297.8501921 + 445267.1114034 * T) % 360;
  const M = (357.5291092 + 35999.0502909 * T) % 360;
  const Mp = (134.9633964 + 477198.8675055 * T) % 360;
  const F = (93.2720950 + 483202.0175233 * T) % 360;
  const dL = 6.288774 * Math.sin(Mp * rad)
         + 1.274027 * Math.sin((2 * D - Mp) * rad)
         + 0.658314 * Math.sin(2 * D * rad)
         + 0.213618 * Math.sin(2 * Mp * rad)
         - 0.185116 * Math.sin(M * rad)
         - 0.114332 * Math.sin(2 * F * rad);
  const lon = ((L0 + dL) % 360 + 360) % 360;
  const signIdx = Math.floor(lon / 30);
  const sign = ZODIAC_SIGNS[signIdx];
  const deg = Math.floor(lon % 30);

  let daysSinceNew = (jd - 2451549.5) % 29.53058770576;
  if (daysSinceNew < 0) daysSinceNew += 29.53058770576;
  const phaseIndex = Math.floor((daysSinceNew / 29.53058770576) * 8 + 0.5) % 8;
  const percentage = Math.round(((1 - Math.cos((daysSinceNew / 29.53058770576) * 2 * Math.PI)) / 2) * 100);

  const phases = [
    { name: "Luna Nueva", emoji: "🌑" },
    { name: "Luna Creciente", emoji: "🌒" },
    { name: "Cuarto Creciente", emoji: "🌓" },
    { name: "Gibosa Creciente", emoji: "🌔" },
    { name: "Luna Llena", emoji: "🌕" },
    { name: "Gibosa Menguante", emoji: "🌖" },
    { name: "Cuarto Menguante", emoji: "🌗" },
    { name: "Luna Menguante", emoji: "🌘" }
  ];

  return {
    signo: sign.signo,
    simbolo: sign.simbolo,
    elemento: sign.elemento,
    regente: sign.regente,
    arquetipo: sign.arquetipo,
    descripcion: sign.descLuna,
    lema: sign.lema,
    grado: deg,
    fase: {
      ...phases[phaseIndex],
      illumination: percentage,
      ageDays: Math.round(daysSinceNew * 10) / 10
    }
  };
}

const CASTILLOS = [
  {
    numero: 1,
    nombre: "Castillo Rojo del Girar",
    corte: "Corte del Nacimiento",
    direccion: "Este",
    color: "Rojo",
    colorTexto: "text-rose-950",
    colorBadge: "bg-rose-100 text-rose-900 border-rose-300",
    colorGrad: "from-rose-500 via-red-600 to-amber-600",
    proposito: "Inicia el Ser a través del nacimiento",
    kinInicio: 1,
    kinFin: 52,
    ondas: [
      { numero: 1, nombre: "Dragón Rojo", kinInicio: 1, kinFin: 13 },
      { numero: 2, nombre: "Viento Blanco", kinInicio: 14, kinFin: 26 },
      { numero: 3, nombre: "Noche Azul", kinInicio: 27, kinFin: 39 },
      { numero: 4, nombre: "Semilla Amarilla", kinInicio: 40, kinFin: 52 }
    ]
  },
  {
    numero: 2,
    nombre: "Castillo Blanco del Cruzar",
    corte: "Corte de la Muerte / Refinamiento",
    direccion: "Norte",
    color: "Blanco",
    colorTexto: "text-slate-900",
    colorBadge: "bg-slate-100 text-slate-900 border-slate-300",
    colorGrad: "from-slate-400 via-stone-500 to-zinc-600",
    proposito: "Refina el Sentir y purifica el Espíritu",
    kinInicio: 53,
    kinFin: 104,
    ondas: [
      { numero: 5, nombre: "Caminante del Cielo Rojo", kinInicio: 53, kinFin: 65 },
      { numero: 6, nombre: "Enlazador de Mundos Blanco", kinInicio: 66, kinFin: 78 },
      { numero: 7, nombre: "Tormenta Azul", kinInicio: 79, kinFin: 91 },
      { numero: 8, nombre: "Humano Amarillo", kinInicio: 92, kinFin: 104 }
    ]
  },
  {
    numero: 3,
    nombre: "Castillo Azul del Quemar",
    corte: "Corte de la Magia / Transformación",
    direccion: "Oeste",
    color: "Azul",
    colorTexto: "text-blue-950",
    colorBadge: "bg-blue-100 text-blue-900 border-blue-300",
    colorGrad: "from-blue-600 via-indigo-600 to-slate-800",
    proposito: "Transforma la Ilusión a través de la magia",
    kinInicio: 105,
    kinFin: 156,
    ondas: [
      { numero: 9, nombre: "Serpiente Roja", kinInicio: 105, kinFin: 117 },
      { numero: 10, nombre: "Espejo Blanco", kinInicio: 118, kinFin: 130 },
      { numero: 11, nombre: "Mono Azul", kinInicio: 131, kinFin: 143 },
      { numero: 12, nombre: "Semilla Amarilla", kinInicio: 144, kinFin: 156 }
    ]
  },
  {
    numero: 4,
    nombre: "Castillo Amarillo del Dar",
    corte: "Corte de la Inteligencia / Maduración",
    direccion: "Sur",
    color: "Amarillo",
    colorTexto: "text-amber-950",
    colorBadge: "bg-amber-100 text-amber-900 border-amber-300",
    colorGrad: "from-amber-500 via-yellow-500 to-amber-700",
    proposito: "Madura el Fruto a través de la inteligencia",
    kinInicio: 157,
    kinFin: 208,
    ondas: [
      { numero: 13, nombre: "Tierra Roja", kinInicio: 157, kinFin: 169 },
      { numero: 14, nombre: "Perro Blanco", kinInicio: 170, kinFin: 182 },
      { numero: 15, nombre: "Noche Azul", kinInicio: 183, kinFin: 195 },
      { numero: 16, nombre: "Guerrero Amarillo", kinInicio: 196, kinFin: 208 }
    ]
  },
  {
    numero: 5,
    nombre: "Castillo Verde del Encantar",
    corte: "Corte de la Sincronización",
    direccion: "Centro",
    color: "Verde",
    colorTexto: "text-emerald-950",
    colorBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    colorGrad: "from-emerald-600 via-teal-600 to-emerald-800",
    proposito: "Sincroniza y trasciende en el Tiempo Natural 13:20",
    kinInicio: 209,
    kinFin: 260,
    ondas: [
      { numero: 17, nombre: "Luna Roja", kinInicio: 209, kinFin: 221 },
      { numero: 18, nombre: "Viento Blanco", kinInicio: 222, kinFin: 234 },
      { numero: 19, nombre: "Águila Azul", kinInicio: 235, kinFin: 247 },
      { numero: 20, nombre: "Estrella Amarilla", kinInicio: 248, kinFin: 260 }
    ]
  }
];

const PALABRAS_CLAVE_TONOS = [
  "Propósito",
  "Desafío",
  "Servicio",
  "Forma",
  "Poder",
  "Equilibrio",
  "Resonancia",
  "Congruencia",
  "Acción",
  "Manifestación",
  "Liberación",
  "Cooperación",
  "Trascendencia"
];

function getKinDataByNumber(kinNumero, kinDiaActual = null) {
  const kin = ((kinNumero - 1) % 260 + 260) % 260 + 1;
  const tonoIdx = (kin - 1) % 13;
  const selloIdx = (kin - 1) % 20;

  const tono = MAYA_TONOS[tonoIdx];
  const sello = MAYA_SELLOS[selloIdx];

  const ondaNumero = Math.floor((kin - 1) / 13) + 1;
  const kinInicioOnda = (ondaNumero - 1) * 13 + 1;
  const kinFinOnda = ondaNumero * 13;
  const selloOnda = MAYA_SELLOS[(kinInicioOnda - 1) % 20];
  const diaDeOnda = tonoIdx + 1;

  const kinNombre = `${sello.raiz} ${tono.nombreCorto} ${sello.color}`;
  const kinCodigo = `Kin ${kin} • ${sello.maya} • Tono ${tono.numero}`;

  // Castillo
  const castilloNumero = Math.floor((kin - 1) / 52) + 1;
  const castilloInfo = CASTILLOS[castilloNumero - 1];
  const diaEnCastillo = ((kin - 1) % 52) + 1;

  // Pasos de la Onda Encantada (13 escalones)
  const kinesOnda = [];
  for (let i = 0; i < 13; i++) {
    const stepKin = kinInicioOnda + i;
    const stepSelloIdx = (stepKin - 1) % 20;
    const stepSello = MAYA_SELLOS[stepSelloIdx];
    const stepTono = MAYA_TONOS[i];
    kinesOnda.push({
      paso: i + 1,
      tonoNumero: i + 1,
      tonoNombre: stepTono.nombreCorto,
      palabraClave: PALABRAS_CLAVE_TONOS[i],
      kinNumero: stepKin,
      kinNombre: `${stepSello.raiz} ${stepTono.nombreCorto} ${stepSello.color}`,
      sello: stepSello,
      esKinActual: kinDiaActual ? stepKin === kinDiaActual : stepKin === kin
    });
  }

  function getKinNumber(sIdx, tIdx) {
    for (let k = 1; k <= 260; k++) {
      if ((k - 1) % 20 === sIdx && (k - 1) % 13 === tIdx) return k;
    }
    return 1;
  }

  // Oráculo de la 5ta Fuerza:
  let guiaSello = sello;
  let guiaEsPoderDuplicado = false;
  if (tono.numero === 1 || tono.numero === 6 || tono.numero === 11) {
    guiaEsPoderDuplicado = true;
  } else if (tono.numero === 2 || tono.numero === 7 || tono.numero === 12) {
    guiaSello = MAYA_SELLOS[(selloIdx + 12) % 20];
  } else if (tono.numero === 3 || tono.numero === 8 || tono.numero === 13) {
    guiaSello = MAYA_SELLOS[(selloIdx + 4) % 20];
  } else if (tono.numero === 4 || tono.numero === 9) {
    guiaSello = MAYA_SELLOS[(selloIdx + 16) % 20];
  } else if (tono.numero === 5 || tono.numero === 10) {
    guiaSello = MAYA_SELLOS[(selloIdx + 8) % 20];
  }
  const guiaSelloIdx = guiaSello.id - 1;
  const guiaKinNumero = getKinNumber(guiaSelloIdx, tonoIdx);
  const guiaNombre = guiaEsPoderDuplicado ? kinNombre : `${guiaSello.raiz} ${tono.nombreCorto} ${guiaSello.color}`;
  const guiaPoderTexto = guiaEsPoderDuplicado ? 'mi propio poder duplicado' : `el poder de ${guiaSello.poder}`;

  const analogoIdx = (17 - selloIdx + 20) % 20;
  const analogoSello = MAYA_SELLOS[analogoIdx];
  const analogoKinNumero = getKinNumber(analogoIdx, tonoIdx);

  const antipodaIdx = (selloIdx + 10) % 20;
  const antipodaSello = MAYA_SELLOS[antipodaIdx];
  const antipodaKinNumero = getKinNumber(antipodaIdx, tonoIdx);

  const kinOcultoNum = 261 - kin;
  const ocultoSelloIdx = (kinOcultoNum - 1) % 20;
  const ocultoSello = MAYA_SELLOS[ocultoSelloIdx];
  const ocultoTonoIdx = (kinOcultoNum - 1) % 13;
  const ocultoTono = MAYA_TONOS[ocultoTonoIdx];

  const afirmacion = `${tono.accionVerbo} con el fin de ${sello.accion},\n` +
    `${tono.funcionVerbo} ${sello.esencia}.\n` +
    `Sello la matriz de ${sello.poder}\n` +
    `con el tono ${tono.nombreCorto.toLowerCase()} de ${tono.cualidad}.\n` +
    `Me guía ${guiaPoderTexto}.`;

  return {
    kinNumero: kin,
    kinNombre,
    kinCodigo,
    selloNombre: sello.nombre,
    selloIcono: sello.icono,
    selloColor: `${sello.color} (${sello.raza})`,
    selloColorSolo: sello.color,
    selloPoder: `El Poder de ${sello.poder}`,
    selloAccion: `${sello.accion.charAt(0).toUpperCase() + sello.accion.slice(1)} ${sello.esencia}`,
    sello,
    tonoNombre: tono.nombre,
    tonoNumero: tono.numero,
    tonoIcono: "✨",
    tonoPoder: tono.poder,
    tonoAccion: tono.accion,
    tonoPregunta: tono.pregunta,
    tonoPalabraClave: PALABRAS_CLAVE_TONOS[tonoIdx],
    tono,

    castillo: {
      ...castilloInfo,
      diaEnCastillo,
      totalDias: 52,
      progresoPorcentaje: Math.round((diaEnCastillo / 52) * 100)
    },

    ondaEncantada: `Onda Encantada de ${selloOnda.nombre}`,
    ondaSelloRaiz: selloOnda.raiz,
    ondaNumero,
    ondaKinInicio: kinInicioOnda,
    ondaKinFin: kinFinOnda,
    diaDeOnda,
    posicionEnOnda: `Día ${diaDeOnda} de 13 (${PALABRAS_CLAVE_TONOS[tonoIdx]})`,
    kinesOnda,

    afirmacion,

    oraculo: {
      destino: {
        kinNumero: kin,
        nombre: kinNombre,
        sello,
        tono,
        tonoNumero: tono.numero,
        rol: "Kin Destino • Frecuencia Central",
        descripcion: `Esencia principal: ${sello.raiz} bajo la vibración del tono ${tono.nombreCorto}. Su misión es ${sello.accion} ${sello.esencia}.`
      },
      guia: {
        kinNumero: guiaKinNumero,
        nombre: guiaNombre,
        sello: guiaSello,
        tono,
        tonoNumero: tono.numero,
        rol: guiaEsPoderDuplicado ? "5ta Fuerza • Poder Duplicado" : "5ta Fuerza • Poder Guía",
        descripcion: guiaEsPoderDuplicado 
          ? `Tu propia esencia de ${sello.raiz} es la brújula inquebrantable hoy. Confía en tu propia intuición.`
          : `Te guía la sabiduría de ${guiaSello.raiz} para orientar tus acciones con ${guiaSello.esencia}.`
      },
      analogo: {
        kinNumero: analogoKinNumero,
        nombre: `${analogoSello.raiz} ${tono.nombreCorto} ${analogoSello.color}`,
        sello: analogoSello,
        tono,
        tonoNumero: tono.numero,
        rol: "Sostén Análogo • Fuerza Gemela",
        descripcion: `Fuerza gemela de soporte: ${analogoSello.raiz} aporta ${analogoSello.esencia} para nutrir el propósito compartido.`
      },
      antipoda: {
        kinNumero: antipodaKinNumero,
        nombre: `${antipodaSello.raiz} ${tono.nombreCorto} ${antipodaSello.color}`,
        sello: antipodaSello,
        tono,
        tonoNumero: tono.numero,
        rol: "Desafío Antípoda • El Espejo",
        descripcion: `El reto evolutivo: ${antipodaSello.raiz} te desafía a integrar ${antipodaSello.poder} para no caer en la rigidez.`
      },
      oculto: {
        kinNumero: kinOcultoNum,
        nombre: `${ocultoSello.raiz} ${ocultoTono.nombreCorto} ${ocultoSello.color}`,
        sello: ocultoSello,
        tono: ocultoTono,
        tonoNumero: ocultoTono.numero,
        rol: "Poder Oculto • Tesoro Subconsciente",
        descripcion: `Regalo subconsciente: desde las profundidades despierta ${ocultoSello.poder} para iluminar tu camino.`
      }
    }
  };
}

function calculateMayaKin(date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  const parts = formatter.formatToParts(date);
  const p = {};
  parts.forEach(part => { p[part.type] = parseInt(part.value, 10); });
  
  const targetUtc = Date.UTC(p.year, p.month - 1, p.day);
  const baseUtc = Date.UTC(2026, 9, 15); // 15 de Octubre de 2026 = Kin 50
  const diffDays = Math.round((targetUtc - baseUtc) / 86400000);
  
  const kinNumero = ((50 - 1 + diffDays) % 260 + 260) % 260 + 1;
  return getKinDataByNumber(kinNumero, kinNumero);
}

function getFormattedFechaTexto(date) {
  const formatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const parts = formatter.format(date);
  const formatted = parts.charAt(0).toUpperCase() + parts.slice(1);
  return formatted.replace(/\bde ([a-z])/g, (m, letter) => `de ${letter.toUpperCase()}`);
}

function getEnergiaDelDia(customData = {}, targetDate = new Date()) {
  const fechaTexto = customData.fechaTexto || getFormattedFechaTexto(targetDate);
  const sol = { ...calculateSunPosition(targetDate), ...(customData.sol || {}) };
  const luna = { ...calculateMoonPosition(targetDate), ...(customData.luna || {}) };

  const customMaya = customData.maya || {};
  const baseMaya = customMaya.kinNumero 
    ? getKinDataByNumber(customMaya.kinNumero, customMaya.kinNumero) 
    : calculateMayaKin(targetDate);

  const customOraculo = customMaya.oraculo || {};
  const oraculo = {
    destino: { ...(baseMaya.oraculo?.destino || {}), ...(customOraculo.destino || {}) },
    guia: { ...(baseMaya.oraculo?.guia || {}), ...(customOraculo.guia || {}) },
    analogo: { ...(baseMaya.oraculo?.analogo || {}), ...(customOraculo.analogo || {}) },
    antipoda: { ...(baseMaya.oraculo?.antipoda || {}), ...(customOraculo.antipoda || {}) },
    oculto: { ...(baseMaya.oraculo?.oculto || {}), ...(customOraculo.oculto || {}) }
  };

  ['destino', 'guia', 'analogo', 'antipoda', 'oculto'].forEach((pos) => {
    if (baseMaya.oraculo?.[pos]) {
      if (!oraculo[pos].sello || !oraculo[pos].sello.icono) {
        oraculo[pos].sello = baseMaya.oraculo[pos].sello;
      }
      if (!oraculo[pos].tono) {
        oraculo[pos].tono = baseMaya.oraculo[pos].tono;
      }
      if (typeof oraculo[pos].tonoNumero !== 'number') {
        oraculo[pos].tonoNumero = baseMaya.oraculo[pos].tonoNumero;
      }
      if (!oraculo[pos].kinNumero) {
        oraculo[pos].kinNumero = baseMaya.oraculo[pos].kinNumero;
      }
      if (!oraculo[pos].nombre) {
        oraculo[pos].nombre = baseMaya.oraculo[pos].nombre;
      }
      if (!oraculo[pos].descripcion) {
        oraculo[pos].descripcion = baseMaya.oraculo[pos].descripcion;
      }
    }
  });

  const maya = {
    ...baseMaya,
    ...customMaya,
    castillo: baseMaya.castillo,
    kinesOnda: baseMaya.kinesOnda,
    oraculo
  };

  const sintoniaLomaVerde = {
    titulo: "Sintonía Comunitaria para Hoy en Loma Verde",
    bajada: "¿Cómo resuena esta frecuencia en nuestro barrio y con la tierra?",
    reflexion: `Hoy, ${fechaTexto}, el cielo y la tierra se entrelazan en Loma Verde. Con el Sol en ${sol.signo} ${sol.simbolo} transitamos la energía de ${sol.arquetipo.toLowerCase()}, mientras que la Luna en ${luna.signo} ${luna.simbolo} (${luna.fase?.name || 'Fase activa'} al ${luna.fase?.illumination || 50}%) inspira ${luna.descripcion.toLowerCase()} En el sincronario sagrado 13:20, el ${maya.kinCodigo} (${maya.kinNombre}) pulsa la ${maya.ondaEncantada}: una frecuencia sagrada para ${maya.tonoAccion.toLowerCase()} y desplegar ${maya.selloPoder.toLowerCase()}. En nuestro barrio, es un día propicio para cultivar la fraternidad cotidiana, compartir saberes en la huerta y fortalecer los lazos de reciprocidad entre vecinos y emprendedores.`,
    claves: [
      `🌿 Sintonía Solar: ${sol.lema}`,
      `🌙 Clima Emocional: ${luna.lema}`,
      `🌀 Frecuencia 13:20: ${maya.selloAccion} bajo el llamado de ${maya.tonoAccion.toLowerCase()}.`,
      `✨ Pregunta Oracular: "${maya.tonoPregunta}"`
    ],
    ...(customData.sintoniaLomaVerde || {})
  };

  const transitosPlanetarios = {
    titulo: "Clima Cósmico & Tránsitos Mayores",
    eventoEstelar: {
      titulo: "Hito Cósmico: Plutón despierta y arranca DIRECTO en Acuario",
      signo: "Acuario",
      simbolo: "♒",
      posicion: "03° 14' Acuario",
      estado: "Estación Directa (Fin de 5 meses de retrogradación)",
      icono: "⚡",
      resumen: "Tras 5 meses de retrogradación, Plutón se estaciona directo en Acuario. La transformación profunda se convierte en acción concreta en el mundo: liberación colectiva, soberanía comunitaria y empoderamiento de las redes vecinales horizontales.",
      impacto: "Un espaldarazo cósmico a la autonomía de Loma Verde: el poder reside en la red humana viva y en la reciprocidad fraterna."
    },
    aspectos: [
      {
        id: "sol-jupiter",
        titulo: "Sol en Libra sextil Júpiter",
        aspecto: "Sextil Armónico",
        planetas: "Sol ♎ • Júpiter",
        icono: "✨",
        categoria: "Oportunidad y Vínculos",
        descripcion: "Favorece acuerdos justos, benevolencia social y sinergias artísticas y colaborativas."
      },
      {
        id: "trigono-fuego",
        titulo: "Vitalidad y Fuego Creador",
        aspecto: "Trígono Fluido",
        planetas: "Marte • Júpiter",
        icono: "🔥",
        categoria: "Vitalidad y Coraje",
        descripcion: "Impulso para emprender, defender causas justas y celebrar sin miedo el arte comunitario."
      },
      {
        id: "mercurio-escorpio",
        titulo: "Mercurio en Escorpio",
        aspecto: "Tránsito Directo",
        planetas: "Mercurio ♏",
        icono: "🦅",
        categoria: "Mente Perceptiva & Agudeza",
        descripcion: "Capacidad para ver lo no dicho, investigar la verdad y conversar con honestidad total."
      },
      {
        id: "saturno-aries",
        titulo: "Saturno retrógrado en Aries",
        aspecto: "Revisión Cardinal",
        planetas: "Saturno ♈ Rx",
        icono: "🛡️",
        categoria: "Madurez e Iniciativa Consciente",
        descripcion: "Madurar el liderazgo personal con paciencia y propósito firme."
      },
      {
        id: "urano-geminis",
        titulo: "Urano en Géminis",
        aspecto: "Evolución Tecnológica & Social",
        planetas: "Urano ♊",
        icono: "🌐",
        categoria: "Redes y Telecomunicaciones Libres",
        descripcion: "Cuestionamiento a modelos tradicionales de conectividad. Fomento de tecnologías éticas y redes barriales."
      }
    ],
    ...(customData.transitosPlanetarios || {})
  };

  return {
    fechaTexto,
    sol,
    luna,
    maya,
    sintoniaLomaVerde,
    transitosPlanetarios
  };
}

module.exports = {
  LUNAR_CALENDAR,
  getAutoLunarCycle,
  getUpcomingMoons,
  getAllLunarCycles,
  getLunarCycleByName,
  getEnergiaDelDia,
  calculateMayaKin,
  getKinDataByNumber,
  CASTILLOS,
  PALABRAS_CLAVE_TONOS
};
