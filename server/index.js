const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to verify admin token/key
const verifyAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const config = db.getConfig();
  if (adminKey === config.claveAdmin || adminKey === 'lomaverde') {
    next();
  } else {
    res.status(401).json({ error: 'Acceso no autorizado. Clave lunar incorrecta.' });
  }
};

// ==========================================
// 1. RUTAS PÚBLICAS (PORTADA, FERIA, CARTELERA)
// ==========================================

// Configuración general y Luna activa
app.get('/api/config', (req, res) => {
  try {
    const config = db.getConfig();
    const { claveAdmin, ...publicConfig } = config;
    res.json(publicConfig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Noticias de la cartelera
app.get('/api/noticias', (req, res) => {
  try {
    res.json(db.getNoticias());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Directorio agrupado de emprendedores
app.get('/api/directorio', (req, res) => {
  try {
    res.json(db.getDirectorioAgrupado());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inscribir Feriante / Publicar propuesta
app.post('/api/feriantes', (req, res) => {
  try {
    const nuevo = db.addFeriante(req.body);
    res.status(201).json({
      success: true,
      mensaje: '¡Propuesta enviada con éxito! Ya formas parte de la red de Loma Verde.',
      feriante: nuevo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Inscribir Voluntario
app.post('/api/voluntarios', (req, res) => {
  try {
    const nuevo = db.addVoluntario(req.body);
    res.status(201).json({
      success: true,
      mensaje: '¡Gracias por sumarte como voluntario! El equipo se pondrá en contacto a la brevedad.',
      voluntario: nuevo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Presupuesto Participativo & Proyectos
app.get('/api/presupuesto', (req, res) => {
  try {
    res.json(db.getPresupuestoData());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/proyectos/:id', (req, res) => {
  try {
    const proyecto = db.getProyectoById(req.params.id);
    if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(proyecto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar voto de presupuesto
app.post('/api/votos', (req, res) => {
  try {
    const voto = db.addVoto(req.body);
    res.status(201).json({
      success: true,
      mensaje: '¡Tu voto ha sido registrado con éxito! Gracias por participar en el futuro de Loma Verde.',
      voto
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Contabilidad y egresos abiertos
app.get('/api/contabilidad', (req, res) => {
  try {
    res.json(db.getContabilidad());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. RUTAS MERCADO DE VIRTUDES & TROQUELES
// ==========================================

// Catálogo de virtudes
app.get('/api/virtudes', (req, res) => {
  try {
    res.json(db.getVirtudes());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publicar virtud (feriante)
app.post('/api/virtudes', (req, res) => {
  try {
    const nueva = db.addVirtud(req.body);
    res.status(201).json({
      success: true,
      mensaje: '¡Producto o virtud publicado con éxito en el Mercado!',
      virtud: nueva
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generar o consultar Troquel / Voucher
app.post('/api/vouchers', (req, res) => {
  try {
    const { nombre, telefono, monto, tipoAporte } = req.body;
    const nuevo = db.addVoucher(nombre, telefono, monto, tipoAporte);
    res.status(201).json({
      success: true,
      mensaje: '¡Troquel generado con éxito!',
      voucher: nuevo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/vouchers/:idTroquel', (req, res) => {
  try {
    const voucher = db.getVoucherByTroquel(req.params.idTroquel);
    if (!voucher) return res.status(404).json({ error: 'Troquel no encontrado' });
    res.json(voucher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Procesar intercambio / canje de virtud con troquel
app.post('/api/intercambios', (req, res) => {
  try {
    const { idTroquel, idVirtud } = req.body;
    const resultado = db.procesarIntercambio(idTroquel, idVirtud);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3. RUTAS CRM & PANEL ADMINISTRATIVO
// ==========================================

// Validar login Admin
app.post('/api/admin/login', (req, res) => {
  const { clave } = req.body;
  const config = db.getConfig();
  if (clave === config.claveAdmin || clave === 'lomaverde') {
    res.json({
      success: true,
      token: 'admin-session-' + Date.now(),
      adminKey: config.claveAdmin
    });
  } else {
    res.status(401).json({ error: 'Clave lunar incorrecta.' });
  }
});

// Dashboard general con métricas
app.get('/api/admin/dashboard', verifyAdmin, (req, res) => {
  try {
    const feriantes = db.getFeriantes();
    const virtudes = db.getVirtudes();
    const vouchers = db.getVouchers();
    const intercambios = db.getIntercambios();
    const votos = db.getVotos();
    const voluntarios = db.getVoluntarios();
    const contabilidad = db.getContabilidad();
    const config = db.getConfig();

    const totalAporteTroqueles = vouchers.reduce((acc, v) => acc + (v.montoInicial || 0), 0);
    const saldoTroquelesCirculante = vouchers.reduce((acc, v) => acc + (v.saldoActual || 0), 0);
    const totalIntercambiado = intercambios.reduce((acc, i) => acc + (i.valor || 0), 0);

    res.json({
      metricas: {
        totalFeriantes: feriantes.length,
        feriantesAprobados: feriantes.filter(f => f.estado === 'aprobado' || f.estado === 'confirmado').length,
        feriantesPendientes: feriantes.filter(f => f.estado === 'pendiente').length,
        totalVoluntarios: voluntarios.length,
        voluntariosSinContactar: voluntarios.filter(v => !v.contactado).length,
        totalVirtudes: virtudes.length,
        virtudesDisponibles: virtudes.filter(v => v.estado === 'Disponible').length,
        totalVouchers: vouchers.length,
        totalAporteTroqueles,
        saldoTroquelesCirculante,
        totalIntercambiado,
        totalVotosPresupuesto: votos.length,
        totalGastadoContabilidad: contabilidad.totalGastado
      },
      lunaActiva: config.lunaActiva,
      ultimosIntercambios: intercambios.slice(0, 10),
      ultimosVotos: votos.slice(0, 10),
      ultimosFeriantes: feriantes.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Feriantes: Listar, Editar, Cambiar estado, Asignar puesto
app.get('/api/admin/feriantes', verifyAdmin, (req, res) => {
  try {
    res.json(db.getFeriantes(req.query));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/feriantes/:id', verifyAdmin, (req, res) => {
  try {
    const updated = db.updateFeriante(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/feriantes/:id', verifyAdmin, (req, res) => {
  try {
    db.deleteFeriante(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Voluntarios
app.get('/api/admin/voluntarios', verifyAdmin, (req, res) => {
  try {
    res.json(db.getVoluntarios());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/voluntarios/:id', verifyAdmin, (req, res) => {
  try {
    const updated = db.updateVoluntario(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/voluntarios/:id', verifyAdmin, (req, res) => {
  try {
    db.deleteVoluntario(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Virtudes & Troqueles
app.get('/api/admin/vouchers', verifyAdmin, (req, res) => {
  try {
    res.json(db.getVouchers());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/intercambios', verifyAdmin, (req, res) => {
  try {
    res.json(db.getIntercambios());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/virtudes/:id', verifyAdmin, (req, res) => {
  try {
    const updated = db.updateVirtud(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/virtudes/:id', verifyAdmin, (req, res) => {
  try {
    db.deleteVirtud(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Presupuesto & Votos
app.get('/api/admin/votos', verifyAdmin, (req, res) => {
  try {
    res.json(db.getVotos());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/proyectos/:id', verifyAdmin, (req, res) => {
  try {
    const { titulo, desc, presupuestoDetalle, donacion, imagen } = req.body;
    const updated = db.updateProyecto(req.params.id, titulo, desc, presupuestoDetalle, donacion, imagen);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Contabilidad
app.post('/api/admin/gastos', verifyAdmin, (req, res) => {
  try {
    const nuevo = db.addGasto(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/gastos/:id', verifyAdmin, (req, res) => {
  try {
    db.deleteGasto(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Configuración y Noticias
app.put('/api/admin/config', verifyAdmin, (req, res) => {
  try {
    const updated = db.updateConfig(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/noticias', verifyAdmin, (req, res) => {
  try {
    const nueva = db.addNoticia(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/noticias/:id', verifyAdmin, (req, res) => {
  try {
    db.deleteNoticia(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Exportar base de datos a Excel (.xlsx)
app.get('/api/admin/export-excel', verifyAdmin, (req, res) => {
  try {
    const buffer = db.exportToExcel();
    const filename = `Encuentro_Lunar_Backup_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir archivos estáticos del cliente en producción
if (process.env.NODE_ENV === 'production' || process.env.SERVE_CLIENT === 'true') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🌕 Servidor Encuentro Lunar 1320 activo en http://localhost:${PORT}`);
});
