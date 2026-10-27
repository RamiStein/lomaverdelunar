const fs = require('fs');
const path = require('path');

const distHtml = path.join(__dirname, '../../client/dist/index.html');
const targetHtml = path.join(__dirname, '../index-template.html');

try {
  if (fs.existsSync(distHtml)) {
    fs.copyFileSync(distHtml, targetHtml);
    console.log('✅ Template HTML copiado exitosamente a server/index-template.html para SSR en Vercel.');
  } else {
    console.warn('⚠️ client/dist/index.html no existe aún.');
  }
} catch (err) {
  console.error('Error copiando index-template.html:', err);
}
