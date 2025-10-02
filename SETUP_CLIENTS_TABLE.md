# Configuración de la Tabla de Clientes

## 🚨 IMPORTANTE: Ejecutar este SQL en Supabase

Para que funcione la gestión de clientes, necesitas ejecutar el siguiente SQL en tu base de datos de Supabase:

### 📋 Pasos:

1. **Ve a tu proyecto de Supabase**
2. **Abre el SQL Editor**
3. **Copia y pega el contenido del archivo `create-clients-table.sql`**
4. **Ejecuta el SQL**

### 🔧 Alternativa: Ejecutar SQL completo

Si prefieres, también puedes ejecutar todo el esquema actualizado desde `supabase-schema.sql` que ya incluye la tabla de clientes.

### ✅ Verificación

Después de ejecutar el SQL, deberías ver:
- ✅ Tabla `clients` creada
- ✅ Índices creados
- ✅ Políticas RLS configuradas
- ✅ Trigger para `updated_at`

### 🐛 Si hay errores

Si ves errores al ejecutar el SQL, probablemente sea porque:
1. **La función `update_updated_at_column()` no existe** - Ejecuta primero el SQL completo del esquema
2. **La tabla `users` no existe** - Asegúrate de que el esquema base esté ejecutado
3. **Permisos** - Verifica que tengas permisos de administrador en Supabase

### 📞 Soporte

Si tienes problemas, revisa:
1. **Logs de la consola del navegador** - Para ver errores específicos
2. **Logs del servidor** - En la terminal donde corre Next.js
3. **Supabase Dashboard** - Para ver si la tabla se creó correctamente
