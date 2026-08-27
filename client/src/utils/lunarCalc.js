// Helper para cálculo astronómico aproximado de fase lunar y signo zodiacal

export function getLunarPhase(date = new Date()) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  let a = Math.floor(year / 100);
  let b = Math.floor(a / 4);
  let c = 2 - a + b;
  let e = Math.floor(365.25 * (year + 4716));
  let f = Math.floor(30.6001 * (month + 1));
  let jd = c + day + e + f - 1524.5;

  // Ciclo sinódico lunar = 29.53058770576 días
  let daysSinceNew = (jd - 2451549.5) % 29.53058770576;
  if (daysSinceNew < 0) daysSinceNew += 29.53058770576;

  let phaseIndex = Math.floor((daysSinceNew / 29.53058770576) * 8 + 0.5) % 8;
  let percentage = Math.round(((1 - Math.cos((daysSinceNew / 29.53058770576) * 2 * Math.PI)) / 2) * 100);

  const phases = [
    { name: "Luna Nueva", emoji: "🌑", desc: "Momento de siembra, silencio e intención interior." },
    { name: "Luna Creciente", emoji: "🌒", desc: "El impulso inicial toma fuerza y enraíza." },
    { name: "Cuarto Creciente", emoji: "🌓", desc: "Superando obstáculos y expandiendo la red." },
    { name: "Gibosa Creciente", emoji: "🌔", desc: "Alineando detalles hacia el punto máximo." },
    { name: "Luna Llena", emoji: "🌕", desc: "Plenitud, celebración comunitaria y cosecha de virtudes." },
    { name: "Gibosa Menguante", emoji: "🌖", desc: "Gratitud, compartir saberes y distribución." },
    { name: "Cuarto Menguante", emoji: "🌗", desc: "Soltar lo innecesario y balance de cuentas." },
    { name: "Luna Menguante", emoji: "🌘", desc: "Descanso, reflexión y preparación del nuevo ciclo." }
  ];

  const phase = phases[phaseIndex];
  return {
    ...phase,
    ageDays: Math.round(daysSinceNew * 10) / 10,
    illumination: percentage
  };
}
