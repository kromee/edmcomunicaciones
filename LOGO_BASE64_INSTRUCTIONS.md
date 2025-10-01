# Instrucciones para Agregar el Logo al PDF

## Paso 1: Convertir el Logo a Base64

Hay varias formas de convertir tu logo (`public/logo.png`) a base64:

### Opción A: Usando Node.js (Recomendado)

1. Crea un archivo temporal `convert-logo.js` en la raíz del proyecto:

```javascript
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'public', 'logo.png');
const logoBuffer = fs.readFileSync(logoPath);
const base64 = logoBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;

console.log('Copia este valor y pégalo en src/lib/pdf-generator.ts:');
console.log('\n');
console.log(`const LOGO_BASE64 = '${dataUrl}';`);
console.log('\n');
```

2. Ejecuta el script:
```bash
node convert-logo.js
```

3. Copia el output y reemplaza la línea en `src/lib/pdf-generator.ts`:
```typescript
const LOGO_BASE64 = 'data:image/png;base64,...'; // Reemplazar con el valor generado
```

### Opción B: Usando Herramienta Online

1. Ve a: https://www.base64-image.de/ o https://base64.guru/converter/encode/image
2. Sube tu archivo `public/logo.png`
3. Copia el resultado que comienza con `data:image/png;base64,...`
4. Pega el valor completo en `src/lib/pdf-generator.ts`

### Opción C: Usando el Terminal (Linux/Mac)

```bash
cat public/logo.png | base64
```

Luego agregar el prefijo: `data:image/png;base64,` al inicio del resultado.

## Paso 2: Actualizar el Código

Reemplaza esta línea en `src/lib/pdf-generator.ts`:

```typescript
const LOGO_BASE64 = 'data:image/png;base64,'; // Placeholder
```

Por:

```typescript
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'; // Tu base64 completo
```

## Paso 3: Verificar

1. Genera una nueva cotización
2. Descarga el PDF
3. Verifica que el logo aparezca en el header azul del PDF

## Notas Importantes

- El logo debe estar en formato PNG con fondo transparente para verse bien sobre el fondo azul
- Si el logo es muy grande, el base64 será largo (esto es normal)
- El tamaño del logo en el PDF es de 16x16 mm (aproximadamente 60x60 px a 72 DPI)
- Si el logo no carga, el sistema usará "EDM Comunicaciones" como texto de respaldo

## Solución de Problemas

Si el logo no aparece en el PDF:

1. Verifica que el base64 comience con `data:image/png;base64,`
2. Asegúrate de que no haya saltos de línea en el string base64
3. Verifica que el logo sea PNG (no JPG, SVG, etc.)
4. Revisa la consola del navegador por mensajes de error

