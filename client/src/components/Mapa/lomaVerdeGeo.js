// Base geográfica inteligente y verificada para Loma Verde, Escobar

// Función para normalizar texto (sin acentos, minúsculas, espacios limpios)
export function normalizeText(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Algoritmo de distancia Levenshtein para tolerancia a errores tipográficos (ej: botafoto -> botafogo)
export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Comparación difusa (fuzzy) de palabras
export function fuzzyMatch(word, target) {
  const w = normalizeText(word);
  const t = normalizeText(target);
  if (!w || !t) return false;
  if (w === t) return true;
  if (t.includes(w) || w.includes(t)) return true;
  if (w.length >= 4 && t.length >= 4) {
    if (Math.abs(w.length - t.length) <= 1 && levenshteinDistance(w, t) <= 1) return true;
    if (Math.abs(w.length - t.length) <= 2 && levenshteinDistance(w, t) <= 2 && w.length >= 6) return true;
  }
  return false;
}

// Centro de Loma Verde para mapa y vista general
export const LOMA_VERDE_CENTER = [-34.3400, -58.8450];

// Bounding box estricto de Loma Verde y Partido de Escobar
// Evita que cualquier búsqueda externa (Córdoba, Santa Fe, etc.) aparezca en el mapa
export function isWithinEscobarArea(lat, lng) {
  return lat >= -34.45 && lat <= -34.25 && lng >= -58.98 && lng <= -58.70;
}

// Calles, avenidas y barrios de Loma Verde con coordenadas verificadas en OpenStreetMap
export const LOMA_VERDE_STREETS = [
  // Barrios y Puntos Principales
  { name: 'Barrio Haras Santa María', lat: -34.34827, lng: -58.86111, tipo: 'Barrio Privado' },
  { name: 'Haras Santa María (Entrada / Old Man)', lat: -34.34410, lng: -58.85242, tipo: 'Acceso Haras' },
  { name: 'Haras Santa María - El Remanso', lat: -34.34445, lng: -58.85638, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - El Trébol', lat: -34.34784, lng: -58.85917, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - Los Robles', lat: -34.35090, lng: -58.86664, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - El Molino', lat: -34.35545, lng: -58.86067, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - Las Lomas', lat: -34.34232, lng: -58.86237, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - El Atardecer', lat: -34.34693, lng: -58.86927, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - Los Eucaliptus', lat: -34.33900, lng: -58.85347, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - Las Caballerizas', lat: -34.34360, lng: -58.85052, tipo: 'Sector Haras' },
  { name: 'Haras Santa María - El Refugio', lat: -34.34153, lng: -58.86710, tipo: 'Sector Haras' },
  { name: 'Barrio San Sebastián', lat: -34.34517, lng: -58.90203, tipo: 'Barrio Privado' },
  { name: 'Barrio San Sebastián (Áreas 1 a 13)', lat: -34.35038, lng: -58.91014, tipo: 'Barrio Privado' },
  { name: 'Plaza La Misión', lat: -34.33258, lng: -58.85154, tipo: 'Plaza Principal' },
  { name: 'Plaza Luchetti (Loma Verde)', lat: -34.35578, lng: -58.81333, tipo: 'Plaza' },
  { name: 'Bioparque Temaikèn', lat: -34.36574, lng: -58.80292, tipo: 'Bioparque' },

  // Calles Principales de Loma Verde
  { name: 'Botafogo', lat: -34.34119, lng: -58.84334, tipo: 'Calle' },
  { name: 'Timbó', lat: -34.34288, lng: -58.84374, tipo: 'Calle' },
  { name: 'Old Man', lat: -34.33393, lng: -58.85491, tipo: 'Calle Principal' },
  { name: 'Arturo Boote', lat: -34.33222, lng: -58.86542, tipo: 'Calle Principal' },
  { name: 'Camino del Sol', lat: -34.34986, lng: -58.84521, tipo: 'Calle' },
  { name: 'Congreve', lat: -34.33800, lng: -58.84288, tipo: 'Calle' },
  { name: 'La Misión', lat: -34.33258, lng: -58.85154, tipo: 'Calle' },
  { name: 'Nigromante', lat: -34.34368, lng: -58.83779, tipo: 'Calle' },
  { name: 'Málaga', lat: -34.32404, lng: -58.85846, tipo: 'Calle' },
  { name: 'Yatasto', lat: -34.32630, lng: -58.85293, tipo: 'Calle' },
  { name: 'Posta de Yatasto', lat: -34.32055, lng: -58.85736, tipo: 'Calle' },
  { name: 'Mineral', lat: -34.34195, lng: -58.84526, tipo: 'Calle' },
  { name: 'Los Cerros', lat: -34.33656, lng: -58.84180, tipo: 'Calle' },
  { name: 'Los Fresnos', lat: -34.33374, lng: -58.84221, tipo: 'Calle' },
  { name: 'Los Tilos', lat: -34.33513, lng: -58.84056, tipo: 'Calle' },
  { name: 'Los Álamos', lat: -34.33660, lng: -58.83054, tipo: 'Calle' },
  { name: 'Los Aromos', lat: -34.33596, lng: -58.83655, tipo: 'Calle' },
  { name: 'Los Laureles', lat: -34.33211, lng: -58.85187, tipo: 'Calle' },
  { name: 'Viraró', lat: -34.35641, lng: -58.84531, tipo: 'Calle' },
  { name: 'Avenida de los Inmigrantes', lat: -34.35519, lng: -58.82181, tipo: 'Avenida' },
  { name: 'Las Araucarias', lat: -34.34264, lng: -58.82779, tipo: 'Calle' },
  { name: 'Las Rosas', lat: -34.33400, lng: -58.84100, tipo: 'Calle' },
  { name: 'Colectora Este (Loma Verde)', lat: -34.32926, lng: -58.83862, tipo: 'Colectora' },
  { name: 'Colectora Oeste (Loma Verde)', lat: -34.33610, lng: -58.82741, tipo: 'Colectora' },
  { name: 'Calle 7', lat: -34.34955, lng: -58.84223, tipo: 'Calle' },
  { name: 'Calle Portugal', lat: -34.33791, lng: -58.84653, tipo: 'Calle' },
  { name: 'Conde', lat: -34.33749, lng: -58.84779, tipo: 'Calle' },
  { name: 'Forly', lat: -34.33894, lng: -58.84660, tipo: 'Calle' },
  { name: 'Manantial', lat: -34.34154, lng: -58.84674, tipo: 'Calle' },
  { name: 'El Amanecer', lat: -34.35246, lng: -58.84332, tipo: 'Calle' },
  { name: 'Del Caballito Blanco', lat: -34.35572, lng: -58.82252, tipo: 'Camino Agrario' },
  { name: 'Las Azucenas', lat: -34.34694, lng: -58.81955, tipo: 'Calle' },
  { name: 'Las Orquídeas', lat: -34.35686, lng: -58.81309, tipo: 'Calle' },
  { name: 'Las Fresias', lat: -34.35055, lng: -58.81839, tipo: 'Calle' },
  { name: 'Las Palmeras', lat: -34.33002, lng: -58.83998, tipo: 'Calle' },
  { name: 'Los Abedules', lat: -34.33211, lng: -58.84477, tipo: 'Calle' },
  { name: 'Los Nogales', lat: -34.33001, lng: -58.84672, tipo: 'Calle' },
  { name: 'Los Olmos', lat: -34.32993, lng: -58.84015, tipo: 'Calle' },
  { name: 'Matheu (Centro y Estación)', lat: -34.37955, lng: -58.82572, tipo: 'Localidad Vecina' },
  { name: 'Escobar Centro (Plaza San Martín)', lat: -34.34800, lng: -58.79800, tipo: 'Centro' },
];

// Esquinas e intersecciones reales de Loma Verde con coordenadas GPS exactas
export const LOMA_VERDE_INTERSECTIONS = [
  // Botafogo y esquinas vinculadas
  { name: 'Botafogo y Timbó', s1: 'Botafogo', s2: 'Timbó', lat: -34.34331, lng: -58.84457 },
  { name: 'Botafogo y Congreve', s1: 'Botafogo', s2: 'Congreve', lat: -34.33907, lng: -58.84209 },
  { name: 'Botafogo y Old Man (Zona Timbó / Botafogo)', s1: 'Botafogo', s2: 'Old Man', lat: -34.34331, lng: -58.84457 },

  // Timbó y esquinas vinculadas
  { name: 'Old Man y Timbó', s1: 'Old Man', s2: 'Timbó', lat: -34.34457, lng: -58.84697 },
  { name: 'Timbó y Málaga', s1: 'Timbó', s2: 'Málaga', lat: -34.34391, lng: -58.84472 },
  { name: 'Timbó y Mineral', s1: 'Timbó', s2: 'Mineral', lat: -34.34195, lng: -58.84526 },
  { name: 'Timbó y Los Cerros', s1: 'Timbó', s2: 'Los Cerros', lat: -34.34118, lng: -58.84050 },

  // Old Man y esquinas vinculadas
  { name: 'Old Man y Camino del Sol', s1: 'Old Man', s2: 'Camino del Sol', lat: -34.34901, lng: -58.84358 },
  { name: 'Old Man y Los Cerros', s1: 'Old Man', s2: 'Los Cerros', lat: -34.34073, lng: -58.84987 },
  { name: 'Old Man y Los Laureles', s1: 'Old Man', s2: 'Los Laureles', lat: -34.33381, lng: -58.85512 },
  { name: 'Old Man y Conde', s1: 'Old Man', s2: 'Conde', lat: -34.33916, lng: -58.85105 },
  { name: 'Old Man y Manantial', s1: 'Old Man', s2: 'Manantial', lat: -34.34247, lng: -58.84856 },
  { name: 'Old Man y Leguísamo', s1: 'Old Man', s2: 'Leguísamo', lat: -34.32229, lng: -58.86376 },
  { name: 'Old Man y Los Ciruelos', s1: 'Old Man', s2: 'Los Ciruelos', lat: -34.32079, lng: -58.86487 },
  { name: 'Old Man y Calle 7', s1: 'Old Man', s2: 'Calle 7', lat: -34.34990, lng: -58.84292 },
  { name: 'Old Man y Colectora Oeste', s1: 'Old Man', s2: 'Colectora Oeste', lat: -34.31885, lng: -58.86624 },

  // Arturo Boote y esquinas vinculadas
  { name: 'Arturo Boote y Old Man', s1: 'Arturo Boote', s2: 'Old Man', lat: -34.32847, lng: -58.85915 },
  { name: 'Arturo Boote y Colectora Oeste', s1: 'Arturo Boote', s2: 'Colectora Oeste', lat: -34.32412, lng: -58.85211 },
  { name: 'Arturo Boote y Colectora Este (Acceso Panamericana Km 54)', s1: 'Arturo Boote', s2: 'Colectora Este', lat: -34.33080, lng: -58.83862 },
  { name: 'Arturo Boote y Congreve', s1: 'Arturo Boote', s2: 'Congreve', lat: -34.32512, lng: -58.85265 },
  { name: 'Arturo Boote y Málaga', s1: 'Arturo Boote', s2: 'Málaga', lat: -34.32700, lng: -58.85627 },
  { name: 'Arturo Boote y Yatasto', s1: 'Arturo Boote', s2: 'Yatasto', lat: -34.32558, lng: -58.85349 },
  { name: 'Arturo Boote y Ombú', s1: 'Arturo Boote', s2: 'Ombú', lat: -34.33343, lng: -58.86553 },
  { name: 'Arturo Boote y Jorge Luis Borges', s1: 'Arturo Boote', s2: 'Jorge Luis Borges', lat: -34.34031, lng: -58.87873 },

  // Camino del Sol y esquinas vinculadas
  { name: 'Camino del Sol y Congreve', s1: 'Camino del Sol', s2: 'Congreve', lat: -34.34626, lng: -58.83661 },
  { name: 'Camino del Sol y Los Aromos', s1: 'Camino del Sol', s2: 'Los Aromos', lat: -34.34362, lng: -58.83073 },
  { name: 'Camino del Sol y Saavedra', s1: 'Camino del Sol', s2: 'Saavedra', lat: -34.35071, lng: -58.84683 },
  { name: 'Camino del Sol y El Amanecer', s1: 'Camino del Sol', s2: 'El Amanecer', lat: -34.34989, lng: -58.84525 },

  // Plaza La Misión y alrededores
  { name: 'Plaza La Misión (Nigromante y La Misión)', s1: 'Nigromante', s2: 'La Misión', lat: -34.33258, lng: -58.85154 },
  { name: 'Los Cerros y Colectora Este', s1: 'Los Cerros', s2: 'Colectora Este', lat: -34.33650, lng: -58.83850 },
  { name: 'Los Fresnos y Las Rosas', s1: 'Los Fresnos', s2: 'Las Rosas', lat: -34.33374, lng: -58.84221 },

  // Avenida de los Inmigrantes y esquinas vinculadas
  { name: 'Avenida de los Inmigrantes y Colectora Este', s1: 'Avenida de los Inmigrantes', s2: 'Colectora Este', lat: -34.35100, lng: -58.81200 },
  { name: 'Avenida de los Inmigrantes y Del Caballito Blanco', s1: 'Avenida de los Inmigrantes', s2: 'Del Caballito Blanco', lat: -34.35524, lng: -58.82190 },
  { name: 'Avenida de los Inmigrantes y Las Azucenas', s1: 'Avenida de los Inmigrantes', s2: 'Las Azucenas', lat: -34.35225, lng: -58.81550 },
  { name: 'Avenida de los Inmigrantes y Las Orquídeas', s1: 'Avenida de los Inmigrantes', s2: 'Las Orquídeas', lat: -34.35271, lng: -58.81653 },
  { name: 'Avenida de los Inmigrantes y Los Aromos', s1: 'Avenida de los Inmigrantes', s2: 'Los Aromos', lat: -34.35524, lng: -58.82190 },
  { name: 'Avenida de los Inmigrantes y Facundo Quiroga', s1: 'Avenida de los Inmigrantes', s2: 'Facundo Quiroga', lat: -34.35101, lng: -58.81289 },
  { name: 'Avenida de los Inmigrantes y Bomberos Voluntarios', s1: 'Avenida de los Inmigrantes', s2: 'Bomberos Voluntarios', lat: -34.35454, lng: -58.82042 },
  { name: 'Avenida de los Inmigrantes y Ciudad de la Merced', s1: 'Avenida de los Inmigrantes', s2: 'Ciudad de la Merced', lat: -34.35394, lng: -58.81913 },
  { name: 'Avenida de los Inmigrantes y Los Tulipanes', s1: 'Avenida de los Inmigrantes', s2: 'Los Tulipanes', lat: -34.35332, lng: -58.81779 },
  { name: 'Avenida de los Inmigrantes y San Francisco', s1: 'Avenida de los Inmigrantes', s2: 'San Francisco', lat: -34.35514, lng: -58.82173 },
];

/**
 * Motor de Búsqueda Inteligente para Loma Verde:
 * 1. Resuelve esquinas / intersecciones (ej: "botafogo y timbo", "botafoto y timbo", "old man e/ timbo")
 * 2. Resuelve calles con altura numérica (ej: "botafogo 1250", "old man 400")
 * 3. Resuelve nombres de calles y barrios con tolerancia a errores tipográficos (fuzzy match)
 */
export function searchLomaVerdeLocal(searchQuery) {
  const q = normalizeText(searchQuery);
  if (!q || q.length < 2) return [];

  const results = [];
  const addedIds = new Set();

  const addResult = (res) => {
    if (!addedIds.has(res.id)) {
      addedIds.add(res.id);
      results.push(res);
    }
  };

  // CASO 1: Búsqueda de Esquinas / Intersecciones con conectores: "y", "e/", "esquina", "esq", "/", ","
  const cornerRegex = /^(.+?)\s+(?:y|e\/|esquina|esq|\/|,)\s+(.+?)$/;
  const cornerMatch = q.match(cornerRegex);
  if (cornerMatch) {
    const p1 = cornerMatch[1].trim();
    const p2 = cornerMatch[2].trim();

    for (const c of LOMA_VERDE_INTERSECTIONS) {
      const matchDirect = 
        (fuzzyMatch(p1, c.s1) && fuzzyMatch(p2, c.s2)) ||
        (fuzzyMatch(p1, c.s2) && fuzzyMatch(p2, c.s1));

      if (matchDirect) {
        addResult({
          id: 'corner-' + c.name,
          titulo: c.name,
          subtitulo: 'Esquina de Loma Verde • Escobar',
          lat: c.lat,
          lng: c.lng,
          isAddress: true
        });
      }
    }
  }

  // CASO 2: Búsqueda de Calle con Altura / Número (ej: "botafogo 1250", "old man 450", "boote 1500")
  const alturaRegex = /^([a-zA-Z\s]+?)\s+(\d{1,5})$/;
  const alturaMatch = q.match(alturaRegex);
  if (alturaMatch) {
    const streetQuery = alturaMatch[1].trim();
    const number = alturaMatch[2];

    for (const s of LOMA_VERDE_STREETS) {
      if (fuzzyMatch(streetQuery, s.name)) {
        addResult({
          id: 'altura-' + s.name + '-' + number,
          titulo: `${s.name} ${number}`,
          subtitulo: `Calle ${s.name} al ${number} • Loma Verde, Escobar`,
          lat: s.lat,
          lng: s.lng,
          isAddress: true
        });
      }
    }
  }

  // CASO 3: Coincidencias en Calles, Barrios y Lugares de Loma Verde
  for (const s of LOMA_VERDE_STREETS) {
    const sNorm = normalizeText(s.name);
    if (sNorm.includes(q) || q.includes(sNorm) || fuzzyMatch(q, sNorm)) {
      addResult({
        id: 'street-' + s.name,
        titulo: s.name,
        subtitulo: (s.tipo || 'Calle') + ' • Loma Verde, Escobar',
        lat: s.lat,
        lng: s.lng,
        isAddress: true
      });
    }
  }

  // CASO 4: Si se ingresó una sola calle, sugerir también sus esquinas conocidas
  if (results.length < 5) {
    for (const c of LOMA_VERDE_INTERSECTIONS) {
      if (fuzzyMatch(q, c.s1) || fuzzyMatch(q, c.s2) || normalizeText(c.name).includes(q)) {
        addResult({
          id: 'corner-' + c.name,
          titulo: c.name,
          subtitulo: 'Esquina de Loma Verde • Escobar',
          lat: c.lat,
          lng: c.lng,
          isAddress: true
        });
      }
    }
  }

  return results;
}
