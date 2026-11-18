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

Las operaciones de escritura del portal requieren el encabezado `Origin` del mismo origen que el sitio. Después de desplegar, verificar desde el navegador que se pueden crear y editar clientes y cotizaciones y cambiar la contraseña; una solicitud con `Origin` ajeno o ausente debe devolver HTTP 403. Los clientes de API externos, si se incorporan más adelante, necesitarán un mecanismo de autenticación distinto de la cookie del navegador.

El middleware debe permanecer en `src/middleware.ts`, junto a `src/app`. En la raíz del proyecto Next.js no lo compilaba, por lo que las verificaciones de sesión anticipadas y el bloqueo de rutas de depuración no se ejecutaban. Los handlers privados ya validaban la sesión por su cuenta; tras este cambio, la protección adicional también opera en el borde.

## Pendientes para cierre completo

- Añadir segundo factor para administradores.
- Integrar y publicar la migración a Next.js 16, React 19 y Node.js 22 de la rama `feature/security-next16`. En local pasaron `npm ci`, `npm run build`, las rutas públicas, la redirección del panel sin sesión y el bloqueo de escritura desde otro origen. Antes de integrarla, comprobar en la vista previa de Vercel un inicio de sesión real, el listado y la edición de clientes, el flujo de cotización y la generación de PDF. Tras publicar, repetir esos flujos en producción.
- Resolver las advertencias preexistentes del linter de forma gradual. La migración deja `npm run lint` ejecutable con 0 errores y 51 advertencias; las reglas nuevas que ya detectan código previo se mantienen como advertencias.
- Revisar 3 avisos moderados en dependencias de desarrollo (`glob` y `minimatch` de Tailwind/Sucrase). `npm audit --omit=dev` no reporta avisos en dependencias de producción con esta migración.
- Validar visualmente una cotización PDF real tras publicar la actualización de jsPDF 4.2.1; la generación con datos ficticios y la compilación ya se comprobaron en local.
- Revisar la política de CSP y valorar un token CSRF adicional si se habilitan integraciones o nuevos dominios.
- Definir monitoreo de intentos fallidos y plan de rotación de credenciales si el historial de accesos lo justifica.
