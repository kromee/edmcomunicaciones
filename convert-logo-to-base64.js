const fs = require('fs');
const path = require('path');

console.log('\n🔄 Convirtiendo logo a Base64...\n');

try {
  // Leer el archivo del logo
  const logoPath = path.join(__dirname, 'public', 'logo.png');
  
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Error: No se encontró el archivo public/logo.png');
    console.log('   Asegúrate de que el archivo existe en la ruta correcta.\n');
    process.exit(1);
  }

  const logoBuffer = fs.readFileSync(logoPath);
  const base64 = logoBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;
  
  console.log('✅ Logo convertido exitosamente!\n');
  console.log('📋 Tamaño del archivo:', (logoBuffer.length / 1024).toFixed(2), 'KB');
  console.log('📋 Tamaño del Base64:', (dataUrl.length / 1024).toFixed(2), 'KB\n');
  console.log('━'.repeat(80));
  console.log('\n📝 Copia la siguiente línea y pégala en src/lib/pdf-generator.ts\n');
  console.log('   Reemplaza la línea que dice:');
  console.log('   const LOGO_BASE64 = \'data:image/png;base64,\';\n');
  console.log('   Por:\n');
  console.log('━'.repeat(80));
  console.log(`const LOGO_BASE64 = '${dataUrl}';`);
  console.log('━'.repeat(80));
  console.log('\n✨ Listo! Ahora puedes generar PDFs con el logo de la empresa.\n');

  // Opcionalmente, guardar en un archivo
  const outputPath = path.join(__dirname, 'logo-base64.txt');
  fs.writeFileSync(outputPath, `const LOGO_BASE64 = '${dataUrl}';`);
  console.log(`💾 También se guardó en: ${outputPath}\n`);

} catch (error) {
  console.error('❌ Error al convertir el logo:', error.message);
  console.log('\n');
  process.exit(1);
}

