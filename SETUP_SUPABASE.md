# Configuración de Supabase para EDM Comunicaciones

## 📋 Pasos para configurar Supabase

### 1. Crear cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Crear un nuevo proyecto
1. Haz clic en **"New Project"**
2. Nombre del proyecto: `EDM Comunicaciones`
3. Contraseña de la base de datos: **Guárdala de forma segura**
4. Región: Elige la más cercana (US East recomendado para México)
5. Plan: **Free** (suficiente para empezar)
6. Haz clic en **"Create new project"**
7. Espera 2-3 minutos mientras se crea el proyecto

### 3. Ejecutar el schema SQL
1. En el proyecto, ve a **SQL Editor** (menú izquierdo)
2. Haz clic en **"New query"**
3. Copia y pega el contenido completo de `supabase-schema.sql`
4. Haz clic en **"Run"** (o presiona Ctrl+Enter)
5. Verifica que no haya errores en la consola

### 4. Obtener las credenciales
1. Ve a **Settings** > **API** (menú izquierdo)
2. Copia los siguientes valores:

**Project URL:**
```
https://tu-proyecto.supabase.co
```

**Project API keys > anon public:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Project API keys > service_role (¡SECRETO!):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Configurar variables de entorno
1. Crea o actualiza el archivo `.env.local` en la raíz del proyecto
2. Agrega estas variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

3. **IMPORTANTE:** Reemplaza los valores con tus credenciales reales

### 6. Crear usuario admin inicial
1. Ve a **SQL Editor** en Supabase
2. Ejecuta este comando para crear el hash de la contraseña:

```sql
-- Primero, habilita la extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crea el usuario admin con contraseña 'admin123'
INSERT INTO users (email, name, role, password_hash)
VALUES (
  'admin@edmcomunicaciones.com',
  'Administrador EDM',
  'admin',
  crypt('admin123', gen_salt('bf'))
)
ON CONFLICT (email) DO NOTHING;
```

3. **IMPORTANTE:** Cambia la contraseña después del primer login

### 7. Configurar políticas de seguridad (RLS)
Las políticas de Row Level Security ya están incluidas en el schema.
Para verificar:

1. Ve a **Authentication** > **Policies**
2. Deberías ver políticas para:
   - `users`
   - `quotes`
   - `quote_items`
   - `contacts`

### 8. Configurar Storage para PDFs (Opcional)
1. Ve a **Storage** (menú izquierdo)
2. Crea un nuevo bucket: `quote-pdfs`
3. Configura como **Public** (para que los PDFs sean descargables)
4. Políticas recomendadas:
   - SELECT: Público (para descargar)
   - INSERT: Solo usuarios autenticados
   - UPDATE: Solo usuarios autenticados
   - DELETE: Solo admins

### 9. Verificar la instalación
Ejecuta estas queries para verificar:

```sql
-- Verificar que las tablas existan
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar el usuario admin
SELECT email, name, role, created_at 
FROM users 
WHERE role = 'admin';

-- Probar la función de número de cotización
SELECT generate_quote_number();
```

### 10. Reiniciar el servidor de desarrollo
```bash
npm run dev
```

## 🔒 Seguridad

### Variables de entorno
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Pública, se puede exponer
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Pública, se puede exponer (protegida por RLS)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - **SECRETA**, nunca expongas en el cliente

### Credenciales de login por defecto
- **Email:** admin@edmcomunicaciones.com
- **Password:** admin123
- **IMPORTANTE:** Cambia esta contraseña inmediatamente después del primer login

## 📊 Estructura de la Base de Datos

### Tablas creadas:
1. **users** - Usuarios administradores
2. **quotes** - Cotizaciones
3. **quote_items** - Items de cotización (con campo `unit` para PZA o SERV)
4. **contacts** - Contactos del formulario

### Funciones:
- `generate_quote_number()` - Genera números de cotización automáticos (formato: COT-YYYYMM-0001)
- `update_updated_at_column()` - Actualiza el campo `updated_at` automáticamente

## 🚀 Próximos Pasos

Una vez configurado Supabase:
1. Prueba el login con las credenciales por defecto
2. Cambia la contraseña del admin
3. Crea cotizaciones de prueba
4. Verifica que los PDFs se generen correctamente

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Reinicia el servidor de desarrollo

### Error: "RLS policy violation"
- Verifica que las políticas de RLS estén habilitadas
- Asegúrate de estar autenticado

### Error: "Function not found"
- Verifica que el schema SQL se haya ejecutado completamente
- Ejecuta las funciones manualmente si es necesario

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth con Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
