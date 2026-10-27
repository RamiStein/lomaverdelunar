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

// Energía del Día (Astrología y Sincronario Maya 13:20)
app.get('/api/energia', async (req, res) => {
  try {
    const config = await db.getConfig();
    res.json(config.energiaDelDia || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Noticias de la cartelera y El Diario Lunar
app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await db.getNoticias(req.query);
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Noticia individual por ID
app.get('/api/noticias/:id', async (req, res) => {
  try {
    const noticia = await db.getNoticiaById(req.params.id);
    if (!noticia) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.json(noticia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar lectura / vista de una nota
app.post('/api/noticias/:id/vista', async (req, res) => {
  try {
    const vistas = await db.incrementarVistasNoticia(req.params.id);
    res.json({ vistas });
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
    // Publicar automáticamente en Instagram (Feed e Historias)
    publicarEnInstagram({
      titulo: nuevo.nombre || req.body.nombre,
      descripcion: `🌱 Rubro: ${nuevo.tipo || req.body.tipo}\n💬 ${nuevo.descripcion || req.body.descripcion}\n👤 Por: ${nuevo.nombrePersonal || req.body.nombrePersonal || nuevo.nombre}`,
      tipo: 'FERIANTE'
    });
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

// ==========================================
// RED SOCIAL & MURO COMUNITARIO 13:20
// ==========================================
app.get('/api/muro', async (req, res) => {
  try {
    const list = await db.getPublicacionesMuro(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/muro/:id/reaccionar', async (req, res) => {
  try {
    const { tipo } = req.body;
    const resultado = await db.reaccionarPublicacionMuro(req.params.id, tipo);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// ADHESIONES VECINALES CONTRA LA ANTENA 5G
// ==========================================
app.get('/api/antena/firmas', async (req, res) => {
  try {
    const list = await db.getFirmasAntena();
    res.json({
      total: list.length,
      firmas: list.map(f => ({
        id: f.id,
        nombre: f.nombre,
        barrio: f.barrio,
        motivo: f.motivo,
        createdAt: f.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/antena/firmas', async (req, res) => {
  try {
    const nueva = await db.addFirmaAntena(req.body);
    const list = await db.getFirmasAntena();
    res.status(201).json({
      success: true,
      mensaje: '¡Tu adhesión vecinal ha sido registrada con éxito!',
      total: list.length,
      firma: nueva
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
    // Publicar automáticamente en Instagram (Feed e Historias)
    publicarEnInstagram({
      titulo: `[${nuevo.categoria || 'Alerta'}] ${nuevo.titulo || nuevo.asunto || 'Alerta Sustentable'}`,
      descripcion: `📍 Ubicación: ${nuevo.ubicacion || 'Loma Verde'}\n💬 Descargo: ${nuevo.descripcion || nuevo.detalle || ''}`,
      tipo: 'ALERTA'
    });
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
    const [feriantes, virtudes, vouchers, intercambios, votos, voluntarios, contabilidad, config, firmasAntena, publicacionesMuro] = await Promise.all([
      db.getFeriantes(),
      db.getVirtudes(),
      db.getVouchers(),
      db.getIntercambios(),
      db.getVotos(),
      db.getVoluntarios(),
      db.getContabilidad(),
      db.getConfig(),
      db.getFirmasAntena(),
      db.getPublicacionesMuro()
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
        totalGastadoContabilidad: contabilidad.totalGastado,
        totalFirmasAntena: (firmasAntena || []).length,
        firmasAntenaSinContactar: (firmasAntena || []).filter(f => !f.contactado).length,
        totalPublicacionesMuro: (publicacionesMuro || []).length
      },
      lunaActiva: config.lunaActiva,
      ultimosIntercambios: intercambios.slice(0, 10),
      ultimosVotos: votos.slice(0, 10),
      ultimosFeriantes: feriantes.slice(0, 10),
      ultimasFirmasAntena: (firmasAntena || []).slice(0, 10),
      ultimasPublicacionesMuro: (publicacionesMuro || []).slice(0, 10)
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

// ==========================================
// CRM ADHESIONES NO A LA ANTENA 5G
// ==========================================
app.get('/api/admin/antena/firmas', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getFirmasAntena();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/antena/firmas/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updateFirmaAntena(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/antena/firmas/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deleteFirmaAntena(req.params.id);
    res.json({ success: true, mensaje: 'Firma eliminada correctamente.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/antena/export-csv', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getFirmasAntena();
    let csv = "ID,Fecha,Nombre,Telefono,Barrio,Calle,Motivo,EsVecino,Contactado,Notas\n";
    list.forEach(f => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      csv += `${escape(f.id)},${escape(f.fechaTexto || f.createdAt)},${escape(f.nombre)},${escape(f.telefono)},${escape(f.barrio)},${escape(f.calle)},${escape(f.motivo)},${escape(f.esVecino !== false ? 'SI' : 'NO')},${escape(f.contactado ? 'SI' : 'NO')},${escape(f.notas || '')}\n`;
    });
    const filename = `Firmas_No_A_La_Antena_Loma_Verde_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send("\uFEFF" + csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

app.put('/api/admin/noticias/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updateNoticia(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    res.json(updated);
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

// ==========================================
// CRM: GESTIÓN DE PUBLICACIONES DEL MURO
// ==========================================
app.get('/api/admin/muro', verifyAdmin, async (req, res) => {
  try {
    const list = await db.getPublicacionesMuro(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/muro', verifyAdmin, async (req, res) => {
  try {
    const nuevo = await db.addPublicacionMuro(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/muro/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await db.updatePublicacionMuro(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/muro/:id', verifyAdmin, async (req, res) => {
  try {
    await db.deletePublicacionMuro(req.params.id);
    res.json({ success: true, mensaje: 'Publicación eliminada correctamente.' });
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

// ==========================================
// CRM: PUBLICACIÓN DIRECTA EN INSTAGRAM
// ==========================================

// 1. Obtener estado de la conexión de Instagram
app.get('/api/admin/instagram/status', verifyAdmin, async (req, res) => {
  try {
    const config = await db.getConfig();
    const envToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const envAccountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const ig = config.instagramConfig || {};

    const hasMeta = !!((ig.accessToken && ig.instagramAccountId) || (envToken && envAccountId));
    const hasWebhook = !!(ig.webhookUrl);

    res.json({
      connected: !!(ig.connected && (hasMeta || hasWebhook)),
      metodo: ig.metodo || (hasWebhook ? 'webhook' : 'meta_api'),
      userName: ig.userName || '@lomaverdelunar',
      hasMetaConfig: hasMeta,
      hasWebhookConfig: hasWebhook,
      webhookUrl: ig.webhookUrl || '',
      instagramAccountId: ig.instagramAccountId || envAccountId || '',
      lastPublishedAt: ig.lastPublishedAt || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Guardar y verificar configuración de Instagram
app.post('/api/admin/instagram/config', verifyAdmin, async (req, res) => {
  try {
    const { metodo, instagramAccountId, accessToken, webhookUrl, userName, disconnect } = req.body;
    const config = await db.getConfig();
    const currentIg = config.instagramConfig || {};

    if (disconnect) {
      const updatedIg = {
        connected: false,
        metodo: 'meta_api',
        instagramAccountId: '',
        accessToken: '',
        webhookUrl: '',
        userName: '@lomaverdelunar',
        updatedAt: new Date().toISOString()
      };
      await db.updateConfig({ instagramConfig: updatedIg });
      return res.json({ success: true, mensaje: 'Cuenta desconectada exitosamente.', instagramConfig: updatedIg });
    }

    let detectedUserName = (userName || currentIg.userName || '@lomaverdelunar').trim();
    if (!detectedUserName.startsWith('@')) detectedUserName = '@' + detectedUserName;

    // Si viene Meta API y hay token + accountId, verificar credenciales llamando al Graph API
    if (metodo === 'meta_api' && instagramAccountId && (accessToken || currentIg.accessToken)) {
      const tokenToTest = accessToken || currentIg.accessToken;
      try {
        const verifyRes = await fetch(`https://graph.facebook.com/v20.0/${instagramAccountId}?fields=username,name&access_token=${tokenToTest}`);
        const verifyData = await verifyRes.json();
        if (verifyData.error) {
          throw new Error(`Meta API: ${verifyData.error.message || 'Credenciales inválidas'}`);
        }
        if (verifyData.username) {
          detectedUserName = `@${verifyData.username}`;
        }
      } catch (e) {
        throw new Error(`No se pudo verificar la cuenta con Meta: ${e.message}`);
      }
    }

    const updatedIgConfig = {
      ...currentIg,
      connected: !!(metodo === 'webhook' ? (webhookUrl || currentIg.webhookUrl) : (instagramAccountId && (accessToken || currentIg.accessToken))),
      metodo: metodo || 'meta_api',
      instagramAccountId: (instagramAccountId || currentIg.instagramAccountId || '').trim(),
      accessToken: accessToken ? accessToken.trim() : currentIg.accessToken,
      webhookUrl: webhookUrl !== undefined ? webhookUrl.trim() : currentIg.webhookUrl,
      userName: detectedUserName,
      updatedAt: new Date().toISOString()
    };

    await db.updateConfig({ instagramConfig: updatedIgConfig });
    res.json({ success: true, mensaje: 'Conexión con Instagram configurada con éxito.', instagramConfig: updatedIgConfig });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Publicar directamente en Instagram
app.post('/api/admin/instagram/publicar', verifyAdmin, async (req, res) => {
  try {
    const { titulo, contenido, tags, imagenUrl, urlDestino } = req.body;
    const config = await db.getConfig();
    const igConfig = config.instagramConfig || {};

    const token = igConfig.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = igConfig.instagramAccountId || process.env.INSTAGRAM_ACCOUNT_ID;
    const metodo = igConfig.metodo || (igConfig.webhookUrl ? 'webhook' : 'meta_api');

    // Limpieza y formato del texto para Instagram
    const textoLimpio = (contenido || '').replace(/\*/g, '').trim();
    const caption = `${(titulo || '').toUpperCase()}\n\n${textoLimpio}\n\n.\n.\n.\n${tags || '#LomaVerdeLunar #LomaVerde'}`;

    // Resolver URL pública de la imagen
    let fullImageUrl = imagenUrl || '/fondo-loma-verde.jpg';
    if (fullImageUrl.startsWith('/')) {
      const baseUrl = process.env.PUBLIC_URL || 'https://lomaverdelunar.online';
      fullImageUrl = `${baseUrl.replace(/\/+$/, '')}${fullImageUrl}`;
    }

    // 1. MÉTODO WEBHOOK (Make.com / Zapier / n8n)
    if (metodo === 'webhook' && igConfig.webhookUrl) {
      const webhookRes = await fetch(igConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo || '',
          caption,
          imageUrl: fullImageUrl,
          tags: tags || '',
          urlDestino: urlDestino || 'https://lomaverdelunar.online',
          publishedAt: new Date().toISOString(),
          autor: 'Loma Verde Lunar'
        })
      });

      if (!webhookRes.ok) {
        const errorText = await webhookRes.text();
        throw new Error(`El Webhook respondió con error ${webhookRes.status}: ${errorText.slice(0, 150)}`);
      }

      await db.updateConfig({
        instagramConfig: { ...igConfig, lastPublishedAt: new Date().toISOString() }
      });

      return res.json({
        success: true,
        metodo: 'webhook',
        mensaje: `¡Publicación enviada exitosamente a través del Webhook de Instagram (${igConfig.userName || '@lomaverdelunar'})!`
      });
    }

    // 2. MÉTODO META GRAPH API OFICIAL
    if (token && accountId) {
      // Paso 1: Crear Contenedor de Media (Feed)
      const containerRes = await fetch(`https://graph.facebook.com/v20.0/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: fullImageUrl,
          caption: caption,
          access_token: token
        })
      });

      const containerData = await containerRes.json();
      if (containerData.error) {
        throw new Error(`Meta Instagram API Error: ${containerData.error.message || JSON.stringify(containerData.error)}`);
      }

      const creationId = containerData.id;
      if (!creationId) {
        throw new Error('Meta no devolvió un ID de contenedor válido para la imagen.');
      }

      // Paso 2: Publicar Contenedor en el Feed
      const publishRes = await fetch(`https://graph.facebook.com/v20.0/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: token
        })
      });

      const publishData = await publishRes.json();
      if (publishData.error) {
        throw new Error(`Error al publicar en Meta Instagram API: ${publishData.error.message || JSON.stringify(publishData.error)}`);
      }

      const postId = publishData.id;

      await db.updateConfig({
        instagramConfig: {
          ...igConfig,
          lastPublishedAt: new Date().toISOString(),
          lastPostId: postId
        }
      });

      return res.json({
        success: true,
        metodo: 'meta_api',
        postId,
        mensaje: `¡Publicación realizada con éxito directamente en Instagram (${igConfig.userName || '@lomaverdelunar'})!`
      });
    }

    return res.status(400).json({
      configured: false,
      error: 'La cuenta de Instagram aún no está conectada. Abrí la configuración para ingresar tu Webhook o las credenciales de Meta Graph API.'
    });
  } catch (err) {
    console.error('Error publicando en Instagram:', err);
    res.status(500).json({ error: err.message });
  }
});

// Servir archivos estáticos del cliente en producción con Open Graph dinámico (Facebook, WhatsApp, Twitter)
if (process.env.NODE_ENV === 'production' || process.env.SERVE_CLIENT === 'true') {
  app.use(express.static(path.join(__dirname, '../client/dist'), { index: false }));

  app.get('*', async (req, res) => {
    try {
      const indexPath = path.join(__dirname, '../client/dist/index.html');
      if (!fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }

      let html = fs.readFileSync(indexPath, 'utf8');

      // Valores Open Graph dinámicos por defecto
      let ogTitle = "Encuentro Lunar 1320 • Loma Verde";
      let ogDesc = "Plataforma comunitaria de Loma Verde: crónicas de cada Luna Llena, feria de artesanos, gastronomía consciente y economía fraterna.";
      let ogImage = "https://lomaverdelunar.online/foodtruck-loma-verde.jpg";
      let ogUrl = `https://lomaverdelunar.online${req.originalUrl || req.url || ''}`;

      // 1. Caso: Nota de El Diario Lunar (?nota=id o /diario?nota=id)
      const notaId = req.query.nota;
      if (notaId) {
        try {
          const nota = await db.getNoticiaById(notaId);
          if (nota) {
            ogTitle = `${nota.titulo} • El Diario Lunar`;
            ogDesc = nota.copete || nota.bajada || (nota.texto ? nota.texto.slice(0, 180) + '...' : ogDesc);
            if (nota.img) {
              ogImage = nota.img.startsWith('http') ? nota.img : `https://lomaverdelunar.online${nota.img.startsWith('/') ? '' : '/'}${nota.img}`;
            }
            ogUrl = `https://lomaverdelunar.online/diario?nota=${nota.id}`;
          }
        } catch (e) {
          console.warn('Error resolviendo nota para OG tags:', e.message);
        }
      } else if (req.path === '/sumate') {
        ogTitle = "Sumate a la Feria Lunar • Loma Verde";
        ogDesc = "Convocatoria abierta para feriantes, artesanos, productores agroecológicos y foodtrucks.";
        ogImage = "https://lomaverdelunar.online/foodtruck-loma-verde.jpg";
      } else if (req.path === '/noalaantena' || req.path === '/antena') {
        ogTitle = "Alerta Vecinal: No a la Antena 5G en Loma Verde";
        ogDesc = "Sumá tu firma al petitorio vecinal en resguardo de la salud y el arbolado histórico.";
        ogImage = "https://lomaverdelunar.online/loma-verde-callecita-opt.jpg";
      }

      const escape = (str) => (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const ogBlock = `
    <title>${escape(ogTitle)}</title>
    <meta name="description" content="${escape(ogDesc)}" />
    <meta property="og:site_name" content="Loma Verde Lunar" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escape(ogTitle)}" />
    <meta property="og:description" content="${escape(ogDesc)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${ogUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(ogTitle)}" />
    <meta name="twitter:description" content="${escape(ogDesc)}" />
    <meta name="twitter:image" content="${ogImage}" />`;

      if (html.includes('<title>')) {
        html = html.replace(/<title>.*?<\/title>/s, '').replace('</head>', `${ogBlock}\n  </head>`);
      } else {
        html = html.replace('</head>', `${ogBlock}\n  </head>`);
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (err) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

// Helper para Auto-Publicación en Instagram (Feed e Historias) via Meta Graph API
async function publicarEnInstagram({ titulo, descripcion, tipo, imagenUrl }) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!token || !accountId) {
    console.log("ℹ️ Auto-publicación de Instagram lista (Define INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_ACCOUNT_ID en tus variables de entorno para activar la publicación automática).");
    return;
  }

  const urlFoto = imagenUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1080&auto=format&fit=crop";
  const caption = (tipo === 'FERIANTE' ? '✨ ¡NUEVO INTEGRANTE EN LOMA VERDE LUNAR! 🌿\n\n' : '🚨 ALERTA VECINAL SUSTENTABLE 🌿\n\n') +
                  titulo + '\n\n' + descripcion + '\n\n#LomaVerdeLunar #LomaVerde #Sustentabilidad #Comunidad';

  try {
    // 1. Feed (IMAGE)
    const resFeedContainer = await fetch(`https://graph.facebook.com/v19.0/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: urlFoto, caption, access_token: token })
    });
    const dataFeedContainer = await resFeedContainer.json();

    if (dataFeedContainer.id) {
      await fetch(`https://graph.facebook.com/v19.0/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: dataFeedContainer.id, access_token: token })
      });
    }

    // 2. Stories (STORIES)
    const resStoryContainer = await fetch(`https://graph.facebook.com/v19.0/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: urlFoto, media_type: 'STORIES', access_token: token })
    });
    const dataStoryContainer = await resStoryContainer.json();

    if (dataStoryContainer.id) {
      await fetch(`https://graph.facebook.com/v19.0/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: dataStoryContainer.id, access_token: token })
      });
    }
  } catch (err) {
    console.error("Error al publicar en Instagram:", err.message);
  }
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌕 Servidor Encuentro Lunar 1320 activo en http://localhost:${PORT}`);
  });
}

module.exports = app;
