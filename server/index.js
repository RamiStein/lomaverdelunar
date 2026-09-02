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
const verifyAdmin = async (req, res, next) => {
  try {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    const config = await db.getConfig();
    if (adminKey === config.claveAdmin || adminKey === 'lomaverde') {
      next();
    } else {
      res.status(401).json({ error: 'Acceso no autorizado. Clave lunar incorrecta.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 1. RUTAS PÚBLICAS (PORTADA, FERIA, CARTELERA)
// ==========================================

// Configuración general y Luna activa
app.get('/api/config', async (req, res) => {
  try {
    const config = await db.getConfig();
    const { claveAdmin, ...publicConfig } = config;
    res.json(publicConfig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Noticias de la cartelera
app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await db.getNoticias();
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Directorio agrupado de emprendedores
app.get('/api/directorio', async (req, res) => {
  try {
    const directorio = await db.getDirectorioAgrupado();
    res.json(directorio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inscribir Feriante / Publicar propuesta
app.post('/api/feriantes', async (req, res) => {
  try {
    const nuevo = await db.addFeriante(req.body);
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
app.post('/api/voluntarios', async (req, res) => {
  try {
    const nuevo = await db.addVoluntario(req.body);
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
app.get('/api/presupuesto', async (req, res) => {
  try {
    const data = await db.getPresupuestoData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/proyectos/:id', async (req, res) => {
  try {
    const proyecto = await db.getProyectoById(req.params.id);
    if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(proyecto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar voto de presupuesto
app.post('/api/votos', async (req, res) => {
  try {
    const voto = await db.addVoto(req.body);
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
app.get('/api/contabilidad', async (req, res) => {
  try {
    const data = await db.getContabilidad();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MAPA COMUNITARIO & REPORTES VECINALES
// ==========================================

// Listar puntos del mapa
app.get('/api/mapa/puntos', async (req, res) => {
  try {
    const puntos = await db.getPuntosMapa(req.query);
    res.json(puntos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nuevo punto / reporte vecinal
app.post('/api/mapa/puntos', async (req, res) => {
  try {
    const nuevo = await db.addPuntoMapa(req.body);
    res.status(201).json({
      success: true,
      mensaje: '¡Reporte publicado en el mapa vecinal!',
      punto: nuevo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Agregar comentario a un punto
app.post('/api/mapa/puntos/:id/comentarios', async (req, res) => {
  try {
    const updated = await db.addComentarioPunto(req.params.id, req.body);
    res.status(201).json({
      success: true,
      mensaje: 'Comentario publicado en el hilo.',
      punto: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Marcar como resuelto / pendiente
app.put('/api/mapa/puntos/:id/resolver', async (req, res) => {
  try {
    const updated = await db.toggleResolverPunto(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar punto (Admin)
app.delete('/api/admin/mapa/puntos/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deletePuntoMapa(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 2. RUTAS MERCADO DE VIRTUDES & TROQUELES
// ==========================================

// Catálogo de virtudes
app.get('/api/virtudes', async (req, res) => {
  try {
    const virtudes = await db.getVirtudes();
    res.json(virtudes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publicar virtud (feriante)
app.post('/api/virtudes', async (req, res) => {
  try {
    const nueva = await db.addVirtud(req.body);
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
app.post('/api/vouchers', async (req, res) => {
  try {
    const { nombre, telefono, monto, tipoAporte } = req.body;
    const nuevo = await db.addVoucher(nombre, telefono, monto, tipoAporte);
    res.status(201).json({
      success: true,
      mensaje: '¡Troquel generado con éxito!',
      voucher: nuevo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/vouchers/:idTroquel', async (req, res) => {
  try {
    const voucher = await db.getVoucherByTroquel(req.params.idTroquel);
    if (!voucher) return res.status(404).json({ error: 'Troquel no encontrado' });
    res.json(voucher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Procesar intercambio / canje de virtud con troquel
app.post('/api/intercambios', async (req, res) => {
  try {
    const { idTroquel, idVirtud } = req.body;
    const resultado = await db.procesarIntercambio(idTroquel, idVirtud);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3. RUTAS CRM & PANEL ADMINISTRATIVO
// ==========================================

// Validar login Admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { clave } = req.body;
    const config = await db.getConfig();
    if (clave === config.claveAdmin || clave === 'lomaverde') {
      res.json({
        success: true,
        token: 'admin-session-' + Date.now(),
        adminKey: config.claveAdmin
      });
    } else {
      res.status(401).json({ error: 'Clave lunar incorrecta.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard general con métricas
app.get('/api/admin/dashboard', verifyAdmin, async (req, res) => {
  try {
    const [feriantes, virtudes, vouchers, intercambios, votos, voluntarios, contabilidad, config] = await Promise.all([
      db.getFeriantes(),
      db.getVirtudes(),
      db.getVouchers(),
      db.getIntercambios(),
      db.getVotos(),
      db.getVoluntarios(),
      db.getContabilidad(),
      db.getConfig()
    ]);

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
app.get('/api/admin/feriantes', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getFeriantes(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/feriantes', verifyAdmin, async (req, res) => {
  try {
    const nuevo = await db.addFeriante(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/feriantes/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updateFeriante(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/feriantes/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deleteFeriante(req.params.id);
    res.json({ success: true, mensaje: 'Feriante movido a la papelera de reciclaje.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PAPELERA DE RECICLAJE DE FERIANTES
app.get('/api/admin/feriantes/papelera', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getFeriantesEliminados();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/feriantes/:id/restaurar', verifyAdmin, async (req, res) => {
  try {
    const restored = await db.restoreFeriante(req.params.id);
    res.json({ success: true, mensaje: 'Feriante restaurado exitosamente.', feriante: restored });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/feriantes/:id/definitivo', verifyAdmin, async (req, res) => {
  try {
    await db.deleteFerianteDefinitivo(req.params.id);
    res.json({ success: true, mensaje: 'Feriante eliminado definitivamente.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Voluntarios
app.get('/api/admin/voluntarios', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getVoluntarios();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/voluntarios/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updateVoluntario(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/voluntarios/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deleteVoluntario(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Virtudes & Troqueles
app.get('/api/admin/vouchers', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getVouchers();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/intercambios', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getIntercambios();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/virtudes/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updateVirtud(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/virtudes/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deleteVirtud(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Presupuesto & Votos
app.get('/api/admin/votos', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getVotos();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/proyectos/:id', verifyAdmin, async (req, res) => {
  try {
    const { titulo, desc, presupuestoDetalle, donacion, imagen } = req.body;
    const updated = await db.updateProyecto(req.params.id, titulo, desc, presupuestoDetalle, donacion, imagen);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Contabilidad
app.post('/api/admin/gastos', verifyAdmin, async (req, res) => {
  try {
    const nuevo = await db.addGasto(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/gastos/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deleteGasto(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRM Configuración y Noticias
app.put('/api/admin/config', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updateConfig(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/noticias', verifyAdmin, async (req, res) => {
  try {
    const nueva = await db.addNoticia(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/noticias/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deleteNoticia(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Exportar base de datos a Excel (.xlsx)
app.get('/api/admin/export-excel', verifyAdmin, async (req, res) => {
  try {
    const buffer = await db.exportToExcel();
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌕 Servidor Encuentro Lunar 1320 activo en http://localhost:${PORT}`);
  });
}

module.exports = app;
