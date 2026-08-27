const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const SEED_DATA = {
  config: {
    lunaActiva: "Luna Acuario",
    nombreEvento: "Encuentro Vecinal",
    subtitulo: "Luna Llena en Acuario ♒",
    signo: "Acuario",
    fechaEvento: "Sábado 1º de Agosto de 12 a 18hs",
    motto: "Celebramos el Día de la Pachamama 🌿",
    lugar: "Loma Verde - Escobar | Plaza La Misión y Nigromante",
    mistica: "Acuario nos invita a la innovación, al poder de la red y a pensar en el futuro de nuestra comunidad. En este encuentro, unimos esa energía visionaria de aire con nuestras raíces en la tierra, celebrando juntos el Día de la Pachamama. Agradecemos a la tierra que nos sostiene y proyectamos colectivamente el mañana. ♒🌬️🌍",
    quienesSomos: {
      titulo: "Loma Verde Lunar",
      texto: "Tejiendo redes comunitarias, economía fraterna y soberanía barrial en armonía con los ciclos de la naturaleza y la frecuencia 13:20."
    },
    categorias: [
      "Música / Arte",
      "Gastronomía",
      "Artesanías",
      "Huerta / Vivero",
      "Terapias Holísticas",
      "Feria Americana",
      "Productos Naturales"
    ],
    idImagenFondo: "",
    claveAdmin: "lomaverde"
  },
  noticias: [
    {
      id: "noticia-1",
      titulo: "¡Gran Apertura del Mercado de Virtudes!",
      texto: "Lanzamos el sistema de troqueles comunitarios para fomentar el trueque e intercambio fraterno entre vecinos y productores locales.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      fecha: "2026-08-01"
    },
    {
      id: "noticia-2",
      titulo: "Taller de Huerta y Compostaje Comunitario",
      texto: "A las 15hs nos encontramos en el sector verde para aprender a armar composteras domiciliarias y sembrar plantines de estación.",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      fecha: "2026-08-01"
    }
  ],
  feriantes: [
    {
      id: "fer-1",
      lunaId: "Luna Acuario",
      nombre: "Finca El Nogal",
      nombrePersonal: "Marcos Almada",
      contacto: "1144332211",
      tipo: "Gastronomía",
      descripcion: "Miel pura de monte, polen agroecológico, mermeladas caseras sin conservantes y frutos secos.",
      instagram: "@fincaelnogal",
      tienda: "https://fincaelnogal.mitiendanube.com",
      mapa: "https://maps.google.com/?q=Loma+Verde+Escobar",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Sector Gastronomía - Puesto 01",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-2",
      lunaId: "Luna Acuario",
      nombre: "Taller Pachamama",
      nombrePersonal: "Solange Varela",
      contacto: "1155667788",
      tipo: "Artesanías",
      descripcion: "Bolsas de tela estampadas a mano, toallitas de tela reutilizables y almohadillas terapéuticas de semillas.",
      instagram: "@tallerpachamama.eco",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Sector Artesanías - Puesto 05",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-3",
      lunaId: "Luna Acuario",
      nombre: "Huerta Comunitaria La Misión",
      nombrePersonal: "Clara & Pedro",
      contacto: "1166778899",
      tipo: "Huerta / Vivero",
      descripcion: "Plantines orgánicos de albahaca, lechuga morada, tomates reliquia, semillas libres y biofertilizantes.",
      instagram: "@huerta.lamision",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Sector Huerta - Puesto 02",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-4",
      lunaId: "Luna Acuario",
      nombre: "Dúo Raíces del Viento",
      nombrePersonal: "Nahuel & Sofía",
      contacto: "1177889900",
      tipo: "Música / Arte",
      descripcion: "Música acústica folklórica y latinoamericana en vivo. Instrumentos autóctonos y cantos a la tierra.",
      instagram: "@raicesdelviento.musica",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Escenario Acústico",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-5",
      lunaId: "Luna Acuario",
      nombre: "Espacio Armonía y Sonido",
      nombrePersonal: "Mariana Costa",
      contacto: "1133221100",
      tipo: "Terapias Holísticas",
      descripcion: "Masajes sonoros con cuencos tibetanos, lecturas de oráculo maya 13:20 y armonización energética.",
      instagram: "@espacioarmonia1320",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Gazebo de Sanación",
      createdAt: new Date().toISOString()
    }
  ],
  voluntarios: [
    {
      id: "vol-1",
      nombre: "Lucas Benítez",
      telefono: "1123456789",
      areaInteres: "Armado y Logística de Puestos",
      contactado: true,
      notas: "Disponible desde las 09:00hs para descarga de tablones.",
      createdAt: new Date().toISOString()
    },
    {
      id: "vol-2",
      nombre: "Valeria Rossi",
      telefono: "1187654321",
      areaInteres: "Recepción y Troqueles",
      contactado: false,
      notas: "Interesada en coordinar el stand del Mercado de Virtudes.",
      createdAt: new Date().toISOString()
    }
  ],
  presupuesto: {
    monto: "$2.500.000",
    texto: "Este año, la comunidad y el fondo vecinal han destinado un presupuesto especial para el mejoramiento sustentable de los espacios públicos de Loma Verde. ¡Los vecinos decidimos en qué se invierte!",
    lunas: [
      { nombre: "Luna en Capricornio", monto: "$250.000" },
      { nombre: "Luna en Acuario", monto: "$420.000" },
      { nombre: "Luna en Piscis", monto: "Pendiente" },
      { nombre: "Luna en Aries", monto: "Pendiente" },
      { nombre: "Luna en Tauro", monto: "Pendiente" },
      { nombre: "Luna en Géminis", monto: "Pendiente" },
      { nombre: "Luna en Cáncer", monto: "Pendiente" },
      { nombre: "Luna en Leo", monto: "Pendiente" },
      { nombre: "Luna en Virgo", monto: "Pendiente" },
      { nombre: "Luna en Libra", monto: "Pendiente" },
      { nombre: "Luna en Escorpio", monto: "Pendiente" },
      { nombre: "Luna en Sagitario", monto: "Pendiente" }
    ],
    opciones: [
      {
        id: 0,
        titulo: "1. Iluminación Sustentable en Plaza La Misión",
        desc: "Instalación de 15 farolas solares autónomas para mejorar la seguridad y extender el uso de la plaza durante la noche sin consumir energía de red.",
        presupuestoDetalle: "Farolas Solares LED (15 unidades): $1.500.000\nMano de obra instalación y postes: $300.000\nFletes, cables y logística: $50.000",
        donacion: "lomaverde.ilumina.mp",
        imagen: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 1,
        titulo: "2. Construcción de Huerta Comunitaria y Compostera",
        desc: "Cerco perimetral de madera, tierra fértil, cajones de siembra elevados y herramientas para crear un espacio de educación ambiental y soberanía alimentaria.",
        presupuestoDetalle: "Maderas tratadas para cajones y cerco: $200.000\nTierra fértil, compost y abono: $80.000\nHerramientas comunitarias: $150.000\nSemillas libres y plantines: $20.000",
        donacion: "lomaverde.huerta.mp",
        imagen: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        titulo: "3. Refugios Ecológicos para Paradas de Colectivo",
        desc: "Construcción de 3 refugios de espera con techos vivos (plantas autóctonas) y bancos de madera reciclada en las esquinas principales.",
        presupuestoDetalle: "Estructuras de hierro reforzado (3x): $1.200.000\nMaderas para bancos y respaldo: $250.000\nSustrato y plantas para techo vivo: $80.000",
        donacion: "lomaverde.refugios.mp",
        imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  votos: [
    {
      id: "voto-1",
      proyectoId: 0,
      opcion: "1. Iluminación Sustentable en Plaza La Misión",
      nombre: "Martín Gómez",
      telefono: "1133445566",
      partido: "Escobar",
      localidad: "Loma Verde",
      calles: "Calle Los Nogales 450",
      justificacion: "La plaza queda muy oscura al atardecer y las farolas solares van a permitir que las familias se queden más tiempo.",
      createdAt: new Date().toISOString()
    },
    {
      id: "voto-2",
      proyectoId: 1,
      opcion: "2. Construcción de Huerta Comunitaria y Compostera",
      nombre: "Carla Silveira",
      telefono: "1177665544",
      partido: "Escobar",
      localidad: "Loma Verde",
      calles: "La Misión y Nigromante",
      justificacion: "Es fundamental para que los niños del barrio aprendan de dónde viene la comida y cuidemos la tierra.",
      createdAt: new Date().toISOString()
    }
  ],
  contabilidad: {
    gastos: [
      {
        id: 1,
        fecha: "15/07/2026",
        detalle: "Sonido y micrófonos para escenario acústico",
        montoNum: 85000,
        montoStr: "85.000",
        comprobante: "",
        categoria: "Cultura y Sonido",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        fecha: "22/07/2026",
        detalle: "Bolsas de compost y plantines para taller vecinal",
        montoNum: 32000,
        montoStr: "32.000",
        comprobante: "",
        categoria: "Talleres y Huerta",
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        fecha: "28/07/2026",
        detalle: "Impresión de cartelería y banderines reciclados",
        montoNum: 24500,
        montoStr: "24.500",
        comprobante: "",
        categoria: "Ambientación",
        createdAt: new Date().toISOString()
      }
    ]
  },
  virtudes: [
    {
      id: 101,
      oferente: "Finca El Nogal",
      descripcion: "Miel Orgánica de Monte (500g)",
      valor: 5000,
      stock: 5,
      estado: "Disponible",
      categoria: "Gastronomía",
      imagenUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 102,
      oferente: "Taller Pachamama",
      descripcion: "Bolsa de Tela Estampada a Mano con Tintes Naturales",
      valor: 4000,
      stock: 3,
      estado: "Disponible",
      categoria: "Artesanías",
      imagenUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 103,
      oferente: "Huerta Comunitaria",
      descripcion: "Plantín de Albahaca Orgánica y Romero",
      valor: 2500,
      stock: 8,
      estado: "Disponible",
      categoria: "Huerta",
      imagenUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 104,
      oferente: "Panadería Artesanal La Espiga",
      descripcion: "Pan de Masamadre Multicereal Horneado a Leña",
      valor: 3500,
      stock: 0,
      estado: "Intercambiada",
      categoria: "Gastronomía",
      imagenUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 105,
      oferente: "Espacio Armonía 1320",
      descripcion: "Sesión de Armonización Sonora con Cuencos (30 min)",
      valor: 6000,
      stock: 4,
      estado: "Disponible",
      categoria: "Terapias Holísticas",
      imagenUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 106,
      oferente: "Cerámica Nativa",
      descripcion: "Cuenco de barro quemado en pozo a cielo abierto",
      valor: 4500,
      stock: 2,
      estado: "Disponible",
      categoria: "Artesanías",
      imagenUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=500&q=80"
    }
  ],
  vouchers: [
    {
      id: "vouch-1",
      idTroquel: "136901",
      compradorNombre: "Familia García Gómez",
      telefono: "1144556677",
      montoInicial: 20000,
      saldoActual: 15000,
      tipoAporte: "Aporte Brote",
      createdAt: new Date().toISOString()
    },
    {
      id: "vouch-2",
      idTroquel: "136902",
      compradorNombre: "Mariano Morales",
      telefono: "1188990011",
      montoInicial: 10000,
      saldoActual: 10000,
      tipoAporte: "Aporte Semilla",
      createdAt: new Date().toISOString()
    }
  ],
  intercambios: [
    {
      id: "int-1",
      idTroquel: "136901",
      idVirtud: 101,
      virtudDescripcion: "Miel Orgánica de Monte (500g)",
      oferente: "Finca El Nogal",
      compradorNombre: "Familia García Gómez",
      valor: 5000,
      saldoRestante: 15000,
      createdAt: new Date().toISOString()
    }
  ]
};

class Database {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
        this.save();
      }
    } catch (err) {
      console.error("Error reading database, restoring seed data:", err);
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
      this.save();
    }
  }

  save() {
    try {
      const json = JSON.stringify(this.data, null, 2);
      const tmpFile = DB_FILE + '.tmp';
      fs.writeFileSync(tmpFile, json, 'utf8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error("Error saving database:", err);
    }
  }

  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(this.data, null, 2), 'utf8');
    return backupFile;
  }

  // --- CONFIG / LUNA ---
  getConfig() {
    return this.data.config;
  }

  updateConfig(newConfig) {
    this.data.config = { ...this.data.config, ...newConfig };
    this.save();
    return this.data.config;
  }

  // --- NOTICIAS ---
  getNoticias() {
    return this.data.noticias || [];
  }

  addNoticia(noticia) {
    const newNoticia = {
      id: "noticia-" + Date.now(),
      titulo: noticia.titulo || "",
      texto: noticia.texto || "",
      img: noticia.img || "",
      fecha: new Date().toISOString().split('T')[0]
    };
    this.data.noticias.unshift(newNoticia);
    this.save();
    return newNoticia;
  }

  deleteNoticia(id) {
    this.data.noticias = this.data.noticias.filter(n => n.id !== id);
    this.save();
    return true;
  }

  // --- FERIANTES / EMPRENDEDORES ---
  getFeriantes(filtro = {}) {
    let list = this.data.feriantes || [];
    if (filtro.estado) {
      list = list.filter(f => f.estado === filtro.estado);
    }
    if (filtro.rubro) {
      list = list.filter(f => f.tipo.toLowerCase().includes(filtro.rubro.toLowerCase()));
    }
    if (filtro.lunaId) {
      list = list.filter(f => f.lunaId === filtro.lunaId);
    }
    return list;
  }

  addFeriante(f) {
    const id = "fer-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    const nuevo = {
      id,
      lunaId: f.lunaId || this.data.config.lunaActiva || "Luna Acuario",
      nombre: String(f.nombre || "").trim(),
      nombrePersonal: String(f.nombrePersonal || "").trim(),
      contacto: String(f.contacto || "").trim(),
      tipo: String(f.tipo || "Varios").trim(),
      descripcion: String(f.descripcion || "").trim(),
      instagram: String(f.instagram || "").trim(),
      tienda: String(f.tienda || "").trim(),
      mapa: String(f.mapa || "").trim(),
      imagenBase64: f.imagenBase64 || "",
      flyerUrl: f.flyerUrl || "",
      estado: f.estado || "aprobado", // 'pendiente', 'aprobado', 'confirmado', 'rechazado'
      puestoAsignado: f.puestoAsignado || "Sin asignar",
      createdAt: new Date().toISOString()
    };
    this.data.feriantes.unshift(nuevo);
    this.save();
    return nuevo;
  }

  updateFeriante(id, updates) {
    const idx = this.data.feriantes.findIndex(f => f.id === id);
    if (idx === -1) throw new Error("Feriante no encontrado");
    this.data.feriantes[idx] = { ...this.data.feriantes[idx], ...updates };
    this.save();
    return this.data.feriantes[idx];
  }

  deleteFeriante(id) {
    this.data.feriantes = this.data.feriantes.filter(f => f.id !== id);
    this.save();
    return true;
  }

  getDirectorioAgrupado() {
    const directorio = {};
    const feriantesAprobados = this.data.feriantes.filter(f => f.estado === 'aprobado' || f.estado === 'confirmado');
    
    feriantesAprobados.forEach(f => {
      let cat = this.normalizarCategoria(f.tipo);
      if (!directorio[cat]) directorio[cat] = [];
      directorio[cat].push(f);
    });

    for (let c in directorio) {
      directorio[c].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return directorio;
  }

  normalizarCategoria(cat) {
    let c = String(cat || "Varios").trim();
    const l = c.toLowerCase();
    if (l.includes('música') || l.includes('musica') || l.includes('arte')) return 'Música / Arte';
    if (l.includes('gastro') || l.includes('comida') || l.includes('alimento')) return 'Gastronomía';
    if (l.includes('artesan')) return 'Artesanías';
    if (l.includes('huert') || l.includes('viver') || l.includes('plant')) return 'Huerta / Vivero';
    if (l.includes('holist') || l.includes('holíst') || l.includes('terapia')) return 'Terapias Holísticas';
    if (l.includes('americana') || l.includes('ropa') || l.includes('indumentaria')) return 'Feria Americana';
    if (l.includes('natural') || l.includes('cosmetica') || l.includes('cosmética')) return 'Productos Naturales';
    return c;
  }

  // --- VOLUNTARIOS ---
  getVoluntarios() {
    return this.data.voluntarios || [];
  }

  addVoluntario(v) {
    const nuevo = {
      id: "vol-" + Date.now(),
      nombre: String(v.nombre || "").trim(),
      telefono: String(v.telefono || "").trim(),
      areaInteres: v.areaInteres || "General",
      contactado: false,
      notas: v.notas || "",
      createdAt: new Date().toISOString()
    };
    this.data.voluntarios.unshift(nuevo);
    this.save();
    return nuevo;
  }

  updateVoluntario(id, updates) {
    const idx = this.data.voluntarios.findIndex(v => v.id === id);
    if (idx === -1) throw new Error("Voluntario no encontrado");
    this.data.voluntarios[idx] = { ...this.data.voluntarios[idx], ...updates };
    this.save();
    return this.data.voluntarios[idx];
  }

  deleteVoluntario(id) {
    this.data.voluntarios = this.data.voluntarios.filter(v => v.id !== id);
    this.save();
    return true;
  }

  // --- PRESUPUESTO & PROYECTOS ---
  getPresupuestoData() {
    const p = this.data.presupuesto;
    // Calculate live votes per project
    const votosPorProyecto = {};
    (this.data.votos || []).forEach(v => {
      votosPorProyecto[v.proyectoId] = (votosPorProyecto[v.proyectoId] || 0) + 1;
    });

    const opcionesConVotos = p.opciones.map(op => ({
      ...op,
      votosCount: votosPorProyecto[op.id] || 0
    }));

    return {
      monto: p.monto,
      texto: p.texto,
      lunas: p.lunas,
      opciones: opcionesConVotos,
      totalVotos: (this.data.votos || []).length
    };
  }

  getProyectoById(id) {
    const numId = parseInt(id, 10);
    const p = this.data.presupuesto.opciones.find(o => o.id === numId);
    if (!p) return null;
    const votos = (this.data.votos || []).filter(v => v.proyectoId === numId).length;
    return { ...p, votosCount: votos };
  }

  updateProyecto(id, titulo, desc, presupuestoDetalle, donacion, imagen) {
    const numId = parseInt(id, 10);
    const idx = this.data.presupuesto.opciones.findIndex(o => o.id === numId);
    if (idx === -1) throw new Error("Proyecto no encontrado");
    
    this.data.presupuesto.opciones[idx] = {
      ...this.data.presupuesto.opciones[idx],
      titulo: titulo || this.data.presupuesto.opciones[idx].titulo,
      desc: desc || this.data.presupuesto.opciones[idx].desc,
      presupuestoDetalle: presupuestoDetalle !== undefined ? presupuestoDetalle : this.data.presupuesto.opciones[idx].presupuestoDetalle,
      donacion: donacion !== undefined ? donacion : this.data.presupuesto.opciones[idx].donacion,
      imagen: imagen !== undefined ? imagen : this.data.presupuesto.opciones[idx].imagen
    };
    this.save();
    return this.data.presupuesto.opciones[idx];
  }

  addVoto(datos) {
    const id = "voto-" + Date.now();
    const proyecto = this.data.presupuesto.opciones.find(o => o.titulo === datos.opcion || o.id === datos.proyectoId);
    const proyectoId = proyecto ? proyecto.id : 0;
    const opcionTitulo = proyecto ? proyecto.titulo : datos.opcion;

    const nuevoVoto = {
      id,
      proyectoId,
      opcion: opcionTitulo,
      nombre: String(datos.nombre || "").trim(),
      telefono: String(datos.telefono || "").trim(),
      partido: String(datos.partido || "Escobar").trim(),
      localidad: String(datos.localidad || "Loma Verde").trim(),
      calles: String(datos.calles || "").trim(),
      justificacion: String(datos.justificacion || "").trim(),
      createdAt: new Date().toISOString()
    };
    this.data.votos.unshift(nuevoVoto);
    this.save();
    return nuevoVoto;
  }

  getVotos() {
    return this.data.votos || [];
  }

  // --- CONTABILIDAD ---
  getContabilidad() {
    const gastos = this.data.contabilidad.gastos || [];
    let totalGastado = 0;
    gastos.forEach(g => {
      totalGastado += g.montoNum || 0;
    });
    return {
      gastos,
      totalGastado
    };
  }

  addGasto(g) {
    const id = Date.now();
    const montoNum = parseFloat(String(g.monto).replace(/[^0-9.-]+/g, "")) || 0;
    const nuevo = {
      id,
      fecha: g.fecha || new Date().toLocaleDateString('es-AR'),
      detalle: String(g.detalle || "").trim(),
      montoNum,
      montoStr: montoNum.toLocaleString('es-AR'),
      comprobante: g.comprobante || "",
      categoria: g.categoria || "General",
      createdAt: new Date().toISOString()
    };
    this.data.contabilidad.gastos.unshift(nuevo);
    this.save();
    return nuevo;
  }

  deleteGasto(id) {
    this.data.contabilidad.gastos = this.data.contabilidad.gastos.filter(g => g.id !== parseInt(id, 10));
    this.save();
    return true;
  }

  // --- VIRTUDES & TROQUELES (MERCADO) ---
  getVirtudes() {
    return this.data.virtudes || [];
  }

  addVirtud(v) {
    const lastId = this.data.virtudes.reduce((max, cur) => Math.max(max, cur.id || 0), 100);
    const nuevo = {
      id: lastId + 1,
      oferente: String(v.oferente || "Feriante Anónimo").trim(),
      descripcion: String(v.descripcion || "").trim(),
      valor: parseFloat(v.valor) || 0,
      stock: parseInt(v.stock, 10) || 1,
      estado: (parseInt(v.stock, 10) || 1) > 0 ? "Disponible" : "Intercambiada",
      categoria: v.categoria || "General",
      imagenUrl: v.imagenUrl || ""
    };
    this.data.virtudes.unshift(nuevo);
    this.save();
    return nuevo;
  }

  updateVirtud(id, updates) {
    const numId = parseInt(id, 10);
    const idx = this.data.virtudes.findIndex(v => v.id === numId);
    if (idx === -1) throw new Error("Virtud no encontrada");
    this.data.virtudes[idx] = { ...this.data.virtudes[idx], ...updates };
    if (this.data.virtudes[idx].stock <= 0) {
      this.data.virtudes[idx].estado = "Intercambiada";
    } else if (this.data.virtudes[idx].estado === "Intercambiada" && this.data.virtudes[idx].stock > 0) {
      this.data.virtudes[idx].estado = "Disponible";
    }
    this.save();
    return this.data.virtudes[idx];
  }

  deleteVirtud(id) {
    const numId = parseInt(id, 10);
    this.data.virtudes = this.data.virtudes.filter(v => v.id !== numId);
    this.save();
    return true;
  }

  getVouchers() {
    return this.data.vouchers || [];
  }

  getVoucherByTroquel(idTroquel) {
    const buscado = String(idTroquel).trim();
    return (this.data.vouchers || []).find(v => String(v.idTroquel).trim() === buscado);
  }

  addVoucher(nombre, telefono, monto, tipoAporte) {
    const montoNum = parseFloat(monto) || 10000;
    const lastVoucher = this.data.vouchers[0];
    let nextIdTroquel = 136901;
    if (this.data.vouchers.length > 0) {
      const maxTroquel = this.data.vouchers.reduce((max, v) => Math.max(max, parseInt(v.idTroquel, 10) || 0), 136900);
      nextIdTroquel = maxTroquel + Math.floor(Math.random() * 4) + 1;
    }

    const nuevo = {
      id: "vouch-" + Date.now(),
      idTroquel: String(nextIdTroquel),
      compradorNombre: String(nombre || "Aportante Vecinal").trim(),
      telefono: String(telefono || "").trim(),
      montoInicial: montoNum,
      saldoActual: montoNum,
      tipoAporte: tipoAporte || "Aporte Fraterno",
      createdAt: new Date().toISOString()
    };
    this.data.vouchers.unshift(nuevo);
    this.save();
    return nuevo;
  }

  procesarIntercambio(idTroquel, idVirtud) {
    const buscadoTroquel = String(idTroquel).trim();
    const numVirtudId = parseInt(idVirtud, 10);

    const virtud = this.data.virtudes.find(v => v.id === numVirtudId);
    if (!virtud || virtud.stock <= 0 || virtud.estado !== "Disponible") {
      throw new Error("Esa virtud ya fue intercambiada en su totalidad o no está disponible.");
    }

    const voucher = this.data.vouchers.find(v => String(v.idTroquel).trim() === buscadoTroquel);
    if (!voucher) {
      throw new Error(`No encontramos el número de troquel ${buscadoTroquel}. Por favor revisa el código o genera uno nuevo.`);
    }

    if (voucher.saldoActual < virtud.valor) {
      throw new Error(`Tu troquel no tiene saldo suficiente. Saldo actual: $${voucher.saldoActual.toLocaleString('es-AR')}, Valor requerido: $${virtud.valor.toLocaleString('es-AR')}`);
    }

    // Process exchange atomically
    voucher.saldoActual -= virtud.valor;
    virtud.stock -= 1;
    if (virtud.stock <= 0) {
      virtud.estado = "Intercambiada";
    }

    const nuevoIntercambio = {
      id: "int-" + Date.now(),
      idTroquel: buscadoTroquel,
      idVirtud: virtud.id,
      virtudDescripcion: virtud.descripcion,
      oferente: virtud.oferente,
      compradorNombre: voucher.compradorNombre,
      valor: virtud.valor,
      saldoRestante: voucher.saldoActual,
      createdAt: new Date().toISOString()
    };
    this.data.intercambios.unshift(nuevoIntercambio);
    this.save();

    return {
      exito: true,
      mensaje: `¡Éxito! Has apoyado la economía fraterna. Te quedan $${voucher.saldoActual.toLocaleString('es-AR')} de saldo.`,
      saldoRestante: voucher.saldoActual,
      virtud,
      voucher,
      intercambio: nuevoIntercambio
    };
  }

  getIntercambios() {
    return this.data.intercambios || [];
  }

  // --- EXPORT TO EXCEL ---
  exportToExcel() {
    const wb = xlsx.utils.book_new();

    // Sheet: Feriantes
    const feriantesData = (this.data.feriantes || []).map(f => ({
      Fecha: f.createdAt,
      Emprendimiento: f.nombre,
      Responsable: f.nombrePersonal,
      Telefono: f.contacto,
      Rubro: f.tipo,
      Descripcion: f.descripcion,
      Instagram: f.instagram,
      Tienda: f.tienda,
      Estado: f.estado,
      Puesto: f.puestoAsignado
    }));
    const wsFeriantes = xlsx.utils.json_to_sheet(feriantesData);
    xlsx.utils.book_append_sheet(wb, wsFeriantes, "Feriantes");

    // Sheet: Virtudes
    const virtudesData = (this.data.virtudes || []).map(v => ({
      ID: v.id,
      Oferente: v.oferente,
      Descripcion: v.descripcion,
      Valor: v.valor,
      Stock: v.stock,
      Estado: v.estado,
      Categoria: v.categoria
    }));
    const wsVirtudes = xlsx.utils.json_to_sheet(virtudesData);
    xlsx.utils.book_append_sheet(wb, wsVirtudes, "Virtudes");

    // Sheet: Vouchers / Troqueles
    const vouchersData = (this.data.vouchers || []).map(v => ({
      ID_Troquel: v.idTroquel,
      Comprador: v.compradorNombre,
      Telefono: v.telefono,
      TipoAporte: v.tipoAporte,
      MontoInicial: v.montoInicial,
      SaldoActual: v.saldoActual,
      Fecha: v.createdAt
    }));
    const wsVouchers = xlsx.utils.json_to_sheet(vouchersData);
    xlsx.utils.book_append_sheet(wb, wsVouchers, "Troqueles");

    // Sheet: Intercambios
    const intercambiosData = (this.data.intercambios || []).map(i => ({
      Fecha: i.createdAt,
      ID_Troquel: i.idTroquel,
      Comprador: i.compradorNombre,
      ID_Virtud: i.idVirtud,
      Virtud: i.virtudDescripcion,
      Oferente: i.oferente,
      Valor: i.valor,
      SaldoRestante: i.saldoRestante
    }));
    const wsIntercambios = xlsx.utils.json_to_sheet(intercambiosData);
    xlsx.utils.book_append_sheet(wb, wsIntercambios, "Intercambios");

    // Sheet: Votos
    const votosData = (this.data.votos || []).map(v => ({
      Fecha: v.createdAt,
      Nombre: v.nombre,
      Telefono: v.telefono,
      Partido: v.partido,
      Localidad: v.localidad,
      Calles: v.calles,
      OpcionVotada: v.opcion,
      Justificacion: v.justificacion
    }));
    const wsVotos = xlsx.utils.json_to_sheet(votosData);
    xlsx.utils.book_append_sheet(wb, wsVotos, "Votos Presupuesto");

    // Sheet: Voluntarios
    const voluntariosData = (this.data.voluntarios || []).map(v => ({
      Fecha: v.createdAt,
      Nombre: v.nombre,
      Telefono: v.telefono,
      AreaInteres: v.areaInteres,
      Contactado: v.contactado ? "SI" : "NO",
      Notas: v.notas
    }));
    const wsVoluntarios = xlsx.utils.json_to_sheet(voluntariosData);
    xlsx.utils.book_append_sheet(wb, wsVoluntarios, "Voluntarios");

    // Sheet: Contabilidad
    const contabilidadData = (this.data.contabilidad.gastos || []).map(g => ({
      Fecha: g.fecha,
      Detalle: g.detalle,
      Monto: g.montoNum,
      Categoria: g.categoria,
      Comprobante: g.comprobante
    }));
    const wsContabilidad = xlsx.utils.json_to_sheet(contabilidadData);
    xlsx.utils.book_append_sheet(wb, wsContabilidad, "Contabilidad");

    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}

const db = new Database();
module.exports = db;
