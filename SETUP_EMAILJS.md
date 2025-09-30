# Configuración de EmailJS para EDM Comunicaciones

## 📧 Pasos para configurar el formulario de contacto

### 1. Crear cuenta en EmailJS
1. Ve a [https://emailjs.com](https://emailjs.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar un servicio de email
1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. **Anota el Service ID** que se genera

### 3. Crear un template de email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa este template:

```
Asunto: Nuevo mensaje de contacto - {{from_name}}

Hola,

Has recibido un nuevo mensaje de contacto desde la página web de EDM Comunicaciones:

Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}
Empresa: {{company}}
Servicio de interés: {{service}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de EDM Comunicaciones.
Destinatario: edm_comunicaciones@hotmail.com
```

4. **Anota el Template ID** que se genera

### 4. Obtener la Public Key
1. Ve a **Account** > **General**
2. Copia tu **Public Key**

### 5. Configurar variables de entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega estas variables:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id_aqui
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

3. Reemplaza los valores con tus credenciales reales

### 6. Reiniciar el servidor
```bash
npm run dev
```

## 🔒 Seguridad
- ✅ El archivo `.env.local` está en `.gitignore` y no se subirá a Git
- ✅ Las credenciales están protegidas
- ✅ Solo las variables con `NEXT_PUBLIC_` son accesibles en el cliente

## 📝 Límites gratuitos
- **200 emails por mes** en el plan gratuito
- Suficiente para la mayoría de sitios web pequeños/medianos

## 🚨 Solución de problemas
Si el formulario no funciona:
1. Verifica que las variables de entorno estén configuradas correctamente
2. Asegúrate de que el template tenga las variables correctas
3. Revisa la consola del navegador para errores
4. Verifica que el servicio de email esté activo en EmailJS
