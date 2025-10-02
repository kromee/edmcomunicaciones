# 🚀 Guía de Instalación Completa - EDM Comunicaciones

## 📋 Resumen del Sistema

Sistema completo de gestión para EDM Comunicaciones que incluye:
- ✅ Sitio web público (Landing, Servicios, Proyectos, Nosotros, Contacto)
- ✅ Sistema de autenticación (Login/Logout)
- ✅ Cotizador con generación de PDFs
- ✅ Dashboard administrativo
- ✅ Gestión de contactos del formulario
- ✅ Envío de emails con EmailJS

## 🔧 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase (gratuita)
- Cuenta de EmailJS (gratuita)
- Git (opcional)

## 📦 Paso 1: Configurar EmailJS

### 1.1 Crear cuenta
1. Ve a [https://emailjs.com](https://emailjs.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 1.2 Configurar servicio de email
1. Dashboard → **Email Services** → **Add New Service**
2. Selecciona tu proveedor (Gmail, Outlook, etc.)
3. Conecta tu cuenta
4. Anota el **Service ID**

### 1.3 Crear templates

**Template 1: Contacto (template_contacto)**
```
To Email: edm_comunicaciones@hotmail.com
Subject: Nuevo mensaje de contacto - {{name}}

Nombre: {{name}}
Email: {{email}}
Teléfono: {{phone}}
Empresa: {{company}}
Servicio: {{service}}

Mensaje:
{{message}}
```

**Template 2: Cotización (template_cotizacion)**
```
To Email: {{to_email}}
Subject: Cotización {{quote_number}} - EDM Comunicaciones

Estimado/a {{client_name}}:

Adjunto encontrará la cotización {{quote_number}} por un total de {{total_amount}}.

Saludos,
EDM Comunicaciones
```

### 1.4 Obtener credenciales
1. Account → General
2. Copia tu **Public Key**

## 🗄️ Paso 2: Configurar Supabase

### 2.1 Crear proyecto
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta y nuevo proyecto
3. Nombre: `EDM Comunicaciones`
4. Región: US East (para México)
5. Guarda la contraseña de BD

### 2.2 Ejecutar schema
1. SQL Editor → New query
2. Copia todo el contenido de `supabase-schema.sql`
3. Ejecuta (Run)
4. Verifica que no haya errores

### 2.3 Crear usuario admin
1. SQL Editor → New query
2. Ejecuta:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (email, name, role, password_hash)
VALUES (
  'admin@edmcomunicaciones.com',
  'Administrador EDM',
  'admin',
  crypt('admin123', gen_salt('bf'))
);
```

### 2.4 Actualizar hash de contraseña
1. En tu terminal local, ejecuta:
```bash
node scripts/generate-password-hash.js
```
2. Copia el SQL generado
3. Ejecútalo en Supabase SQL Editor

### 2.5 Configurar políticas RLS
1. SQL Editor → New query
2. Ejecuta:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow login" ON users;
CREATE POLICY "Allow login" ON users
  FOR SELECT USING (true);
```

### 2.6 Obtener credenciales
1. Settings → API
2. Copia:
   - **Project URL**
   - **anon public key**
   - **service_role key** (¡SECRETO!)

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo `.env.local`
En la raíz del proyecto, crea `.env.local` con:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=edm_comunicaciones@hotmail.com
NEXT_PUBLIC_CONTACT_PHONE=+52 55 3035 8478
NEXT_PUBLIC_CONTACT_WHATSAPP=+52 55 5031 7183
NEXT_PUBLIC_CONTACT_EMAIL_CC=renixedu@gmail.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 3.2 Reemplazar valores reales
Usa los valores que obtuviste de EmailJS y Supabase

## 🚀 Paso 4: Ejecutar el Proyecto

### 4.1 Instalar dependencias
```bash
npm install
```

### 4.2 Iniciar servidor de desarrollo
```bash
npm run dev
```

### 4.3 Abrir en navegador
```
http://localhost:3000
```

## 🧪 Paso 5: Probar el Sistema

### 5.1 Probar el Login
1. Ve a: `http://localhost:3000/login`
2. Email: `admin@edmcomunicaciones.com`
3. Password: `admin123`
4. Click "Iniciar Sesión"

### 5.2 Probar el Cotizador
1. Desde el Dashboard, click en "Nueva Cotización"
2. Llena los datos del cliente
3. Agrega items (con unidad PZA o SERV)
4. Click "Crear Cotización y Generar PDF"
5. Verifica que se cree el PDF

### 5.3 Probar Formulario de Contacto
1. Ve a: `http://localhost:3000/contacto`
2. Llena el formulario
3. Envía el mensaje
4. Verifica que llegue el email
5. Ve a Dashboard → Contactos
6. Deberías ver el mensaje guardado

## 📊 Funcionalidades del Sistema

### Sitio Público
- ✅ Landing page con hero y servicios
- ✅ Página de servicios detallada con comentarios
- ✅ Página de proyectos con modal de imágenes
- ✅ Página nosotros con valores
- ✅ Formulario de contacto con EmailJS + Supabase

### Panel Admin
- ✅ Login seguro con bcrypt
- ✅ Dashboard con estadísticas
- ✅ Cotizador completo
- ✅ Generación automática de PDFs
- ✅ Gestión de cotizaciones
- ✅ Gestión de contactos

### Base de Datos
- ✅ PostgreSQL con Supabase
- ✅ Row Level Security (RLS)
- ✅ Generación automática de números de cotización
- ✅ Campo `unit` (PZA/SERV) en items

## 🔒 Credenciales por Defecto

**Admin:**
- Email: admin@edmcomunicaciones.com
- Password: admin123

**⚠️ IMPORTANTE:** Cambia esta contraseña después del primer login

## 🌐 Despliegue en Vercel

### Configurar variables de entorno en Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega todas las variables de `.env.local`
4. Guarda y redeploy

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa la consola del servidor (terminal)
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de que Supabase esté activo

## 🎯 Próximos Pasos Recomendados

1. Cambiar contraseña de admin
2. Personalizar templates de email
3. Agregar más usuarios admin si es necesario
4. Configurar dominio personalizado
5. Configurar Supabase Storage para PDFs
