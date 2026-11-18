# Cierre de exposición de datos y refuerzo del acceso

## Acción prioritaria en Supabase

Ejecutar `scripts/security-lockdown-rls.sql` en el SQL Editor del proyecto de producción. El script habilita RLS, elimina políticas previas de las tablas privadas del cotizador y revoca permisos directos a los roles públicos `anon` y `authenticated`. La aplicación utiliza `SUPABASE_SERVICE_ROLE_KEY` solo en el servidor y no utiliza Supabase Auth para sus usuarios.

**Verificación necesaria inmediatamente después:** con la clave pública `anon`, consultas directas a `clients`, `quotes`, `quote_items`, `contacts`, `users`, `catalog_items` y tablas auxiliares deben devolver 0 registros o un error de permisos. Con la clave de servicio, el panel y las operaciones administrativas deben continuar funcionando. Nunca pegar claves en un PR, ticket o chat.

Si alguna tabla privada adicional se creó después, incluirla también antes de considerar cerrado el problema. Revisar los registros de acceso de Supabase para evaluar si hubo lecturas no previstas; esta auditoría de código no puede demostrar que las haya habido ni descartarlas.

## Despliegue del código

Tras el cambio de permisos, integrar la rama de seguridad y desplegar. Las cookies de sesión antiguas dejarán de ser válidas: los administradores deberán iniciar sesión de nuevo. El cambio de contraseña invalida las sesiones anteriores de esa cuenta en las rutas de servidor.

Comprobar desde una sesión de administrador las tareas habituales: consultar clientes, crear y actualizar una cotización, generar PDF y cerrar sesión. Sin sesión, el dashboard y las APIs privadas deben rechazar el acceso. Probar el rol de consulta antes de habilitar cuentas de ese tipo; ahora las operaciones de escritura requieren administrador.

## Límite persistente del login

Antes de integrar el cambio del login, ejecutar `scripts/security-login-rate-limit.sql` en el SQL Editor de Supabase. Crea un contador compartido entre las instancias de Vercel. La tabla solo es accesible mediante la función con privilegios de servicio; la API no acepta intentos de login si esa función falla o no existe. No requiere una nueva variable de entorno: utiliza `SESSION_SECRET`, que debe estar configurada en producción.

Después del despliegue, comprobar un inicio de sesión correcto y uno con contraseña incorrecta. Más de 8 intentos con la misma cuenta o 30 desde la misma IP durante 15 minutos devuelven HTTP 429 con `Retry-After`; el contador incluye los intentos exitosos. El bloqueo también puede afectar temporalmente a un administrador si alguien intenta entrar repetidamente con su correo. Si la API devuelve HTTP 503, revisar la ejecución del script y los permisos de la función antes de volver a probar.

## Pendientes para cierre completo

- Añadir segundo factor para administradores.
- Actualizar Next.js 14 (fuera de soporte) y jsPDF después de revisar compatibilidad y regresiones del cotizador/PDF.
- Revisar políticas de CSP y protección CSRF de los formularios administrativos.
- Definir monitoreo de intentos fallidos y plan de rotación de credenciales si el historial de accesos lo justifica.
