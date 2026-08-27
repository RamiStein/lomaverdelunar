const fs = require('fs');
const path = require('path');
const firebase = require('../firebase');

async function seedFirestore() {
  console.log('🚀 [Seed Firestore] Iniciando sincronización de datos iniciales...');

  if (!firebase.isFirebaseEnabled()) {
    console.error('❌ [Seed Firestore] Firebase no está configurado. Revisa tu archivo .env o serviceAccountKey.json.');
    process.exit(1);
  }

  const fdb = firebase.getDb();
  const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');

  let data = null;
  if (fs.existsSync(dbJsonPath)) {
    data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
    console.log('📂 Leyendo datos desde server/data/db.json...');
  } else {
    console.error('❌ No se encontró db.json');
    process.exit(1);
  }

  try {
    // 1. Config
    if (data.config) {
      await fdb.collection('config').doc('general').set(data.config);
      console.log('✅ Configuración general guardada en Firestore.');
    }

    // 2. Noticias
    if (Array.isArray(data.noticias)) {
      for (const n of data.noticias) {
        await fdb.collection('noticias').doc(n.id).set(n);
      }
      console.log(`✅ ${data.noticias.length} Noticias subidas a Firestore.`);
    }

    // 3. Feriantes
    if (Array.isArray(data.feriantes)) {
      for (const f of data.feriantes) {
        await fdb.collection('feriantes').doc(f.id).set(f);
      }
      console.log(`✅ ${data.feriantes.length} Feriantes subidos a Firestore.`);
    }

    // 4. Voluntarios
    if (Array.isArray(data.voluntarios)) {
      for (const v of data.voluntarios) {
        await fdb.collection('voluntarios').doc(v.id).set(v);
      }
      console.log(`✅ ${data.voluntarios.length} Voluntarios subidos a Firestore.`);
    }

    // 5. Presupuesto
    if (data.presupuesto) {
      await fdb.collection('presupuesto').doc('general').set(data.presupuesto);
      console.log('✅ Presupuesto participativo y proyectos subidos a Firestore.');
    }

    // 6. Votos
    if (Array.isArray(data.votos)) {
      for (const v of data.votos) {
        await fdb.collection('votos').doc(v.id).set(v);
      }
      console.log(`✅ ${data.votos.length} Votos subidos a Firestore.`);
    }

    // 7. Contabilidad / Gastos
    if (data.contabilidad && Array.isArray(data.contabilidad.gastos)) {
      for (const g of data.contabilidad.gastos) {
        await fdb.collection('gastos').doc(String(g.id)).set(g);
      }
      console.log(`✅ ${data.contabilidad.gastos.length} Gastos contables subidos a Firestore.`);
    }

    // 8. Virtudes
    if (Array.isArray(data.virtudes)) {
      for (const v of data.virtudes) {
        await fdb.collection('virtudes').doc(String(v.id)).set(v);
      }
      console.log(`✅ ${data.virtudes.length} Virtudes subidas al Mercado en Firestore.`);
    }

    // 9. Vouchers / Troqueles
    if (Array.isArray(data.vouchers)) {
      for (const v of data.vouchers) {
        await fdb.collection('vouchers').doc(v.id).set(v);
      }
      console.log(`✅ ${data.vouchers.length} Troqueles/Vouchers subidos a Firestore.`);
    }

    // 10. Intercambios
    if (Array.isArray(data.intercambios)) {
      for (const i of data.intercambios) {
        await fdb.collection('intercambios').doc(i.id).set(i);
      }
      console.log(`✅ ${data.intercambios.length} Intercambios históricos subidos a Firestore.`);
    }

    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA CON ÉXITO! Todos los datos están listos en Firebase Firestore.');
  } catch (error) {
    console.error('❌ Error durante la migración a Firestore:', error);
  }
}

seedFirestore().then(() => process.exit(0));
