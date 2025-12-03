import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer el logo original
const logoPath = join(__dirname, 'src', 'assets', 'Voyage Logo.png');

try {
  const logoBuffer = readFileSync(logoPath);
  
  // Copiar el logo como apple-touch-icon (180x180 es el tamaño estándar)
  // Nota: Este script solo copia el archivo. Para redimensionar necesitarías sharp o jimp
  // Por ahora, copiamos el logo completo y el navegador lo escalará
  
  // Para producción, sería mejor usar sharp para redimensionar:
  // npm install sharp
  // const sharp = require('sharp');
  // await sharp(logoPath).resize(192, 192).toFile(join(__dirname, 'public', 'favicon-192x192.png'));
  
  console.log('✅ Logo encontrado en:', logoPath);
  console.log('');
  console.log('📝 INSTRUCCIONES:');
  console.log('1. Copia manualmente "Voyage Logo.png" a la carpeta public/');
  console.log('2. Renómbralo a: apple-touch-icon.png');
  console.log('3. Para crear los otros tamaños, usa una herramienta online:');
  console.log('   - https://realfavicongenerator.net/');
  console.log('   - Sube tu logo y descarga todos los tamaños');
  console.log('   - Coloca los archivos en public/');
  console.log('');
  console.log('O instala sharp y ejecuta: npm install sharp');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('');
  console.log('💡 Alternativa:');
  console.log('1. Abre "src/assets/Voyage Logo.png" en un editor');
  console.log('2. Exporta en estos tamaños:');
  console.log('   - favicon-32x32.png (32x32)');
  console.log('   - favicon-96x96.png (96x96)');
  console.log('   - favicon-192x192.png (192x192)');
  console.log('   - apple-touch-icon.png (180x180)');
  console.log('3. Coloca todos en public/');
}

