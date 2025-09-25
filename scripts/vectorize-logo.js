const { Potrace } = require('potrace');
const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '..', 'public', 'logo-edm.png');
const outputPath = path.resolve(__dirname, '..', 'public', 'logo-edm.svg');

if (!fs.existsSync(inputPath)) {
	console.error('No se encontró public/logo-edm.png');
	process.exit(1);
}

const tracer = new Potrace({
	turnPolicy: Potrace.TURNPOLICY_MINORITY,
	threshold: 200,
	color: '#14365C',
	background: undefined,
});

tracer.loadImage(inputPath, (err) => {
	if (err) {
		console.error('Error cargando la imagen:', err);
		process.exit(1);
	}
	tracer.getSVG((err2, svg) => {
		if (err2) {
			console.error('Error generando SVG:', err2);
			process.exit(1);
		}
		fs.writeFileSync(outputPath, svg, 'utf8');
		console.log('SVG generado en', outputPath);
	});
});
