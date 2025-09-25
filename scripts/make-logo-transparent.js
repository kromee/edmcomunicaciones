const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.resolve(__dirname, '..', 'public', 'logo-edm.svg');
const pngPath = path.resolve(__dirname, '..', 'public', 'logo-edm.png');

(async () => {
	try {
		if (!fs.existsSync(svgPath)) {
			console.error('No se encontró public/logo-edm.svg para convertir.');
			process.exit(1);
		}
		await sharp(svgPath)
			.png({ compressionLevel: 9 })
			.toFile(pngPath);
		console.log('PNG transparente generado en', pngPath);
	} catch (err) {
		console.error('Error al generar PNG transparente:', err);
		process.exit(1);
	}
})();
