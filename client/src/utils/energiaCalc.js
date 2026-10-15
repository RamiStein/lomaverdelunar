// Motor de Cálculo y Arquetipos para la Energía del Día en Loma Verde Lunar
// Integra: Tránsitos Astrológicos (Sol & Luna) + Sincronario Maya 13:20 (Tzolkin)

import { getLunarPhase } from './lunarCalc';

export const ENERGIA_DEFAULT = {
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
    selloColor: "Blanco (Refina y Purifica el Sentir)",
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

/**
 * Devuelve la energía del día combinando los datos dinámicos de config y el cálculo lunar
 */
export function getEnergiaDelDia(config) {
  const custom = config?.energiaDelDia || {};
  const moonPhase = getLunarPhase(new Date());

  return {
    ...ENERGIA_DEFAULT,
    ...custom,
    sol: {
      ...ENERGIA_DEFAULT.sol,
      ...(custom.sol || {})
    },
    luna: {
      ...ENERGIA_DEFAULT.luna,
      ...(custom.luna || {}),
      fase: moonPhase
    },
    maya: {
      ...ENERGIA_DEFAULT.maya,
      ...(custom.maya || {}),
      oraculo: {
        ...ENERGIA_DEFAULT.maya.oraculo,
        ...(custom.maya?.oraculo || {})
      }
    },
    sintoniaLomaVerde: {
      ...ENERGIA_DEFAULT.sintoniaLomaVerde,
      ...(custom.sintoniaLomaVerde || {})
    }
  };
}

/**
 * Genera el texto formateado para compartir por WhatsApp
 */
export function generarMensajeWhatsAppEnergia(energia) {
  return `✨ *LA ENERGÍA DE HOY • LOMA VERDE LUNAR 13:20* ✨%0A` +
    `🗓️ *${energia.fechaTexto}*%0A%0A` +
    `☀️ *SOL EN ${energia.sol.signo.toUpperCase()} ${energia.sol.simbolo}* (${energia.sol.elemento})%0A` +
    `_«${energia.sol.lema}»_%0A` +
    `• Enfoque: ${energia.sol.arquetipo}. Búsqueda de equilibrio, belleza y acuerdos justos en nuestras relaciones.%0A%0A` +
    `🌙 *LUNA EN ${energia.luna.signo.toUpperCase()} ${energia.luna.simbolo}* (${energia.luna.elemento})%0A` +
    `_«${energia.luna.lema}»_%0A` +
    `• Fase: ${energia.luna.fase?.emoji || '🌕'} ${energia.luna.fase?.name || 'Fase activa'} (${energia.luna.fase?.illumination || 80}%). Entusiasmo, optimismo y ganas de expandir saberes.%0A%0A` +
    `🐾 *SINCRONARIO MAYA 13:20: ${energia.maya.kinNombre.toUpperCase()}* (${energia.maya.kinCodigo})%0A` +
    `🌀 *Onda Encantada:* ${energia.maya.ondaEncantada}%0A` +
    `• Sello: ${energia.maya.selloNombre} → ${energia.maya.selloPoder}.%0A` +
    `• Tono: ${energia.maya.tonoNombre} → ${energia.maya.tonoPoder}.%0A%0A` +
    `📜 *AFIRMACIÓN DEL KIN:*%0A` +
    `_${energia.maya.afirmacion.replace(/\n/g, '%0A_')}_%0A%0A` +
    `🌿 *CLAVE PARA LOMA VERDE:*%0A` +
    `${energia.sintoniaLomaVerde.reflexion}%0A%0A` +
    `🌐 *Leelo completo en:* https://lomaverdelunar.online/energia`;
}
