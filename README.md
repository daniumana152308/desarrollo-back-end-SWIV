# ProductHub

Aplicación para listar, crear, consultar y eliminar productos. Frontend React + TypeScript + Vite; API ASP.NET Core 10; persistencia SQL Server mediante Entity Framework Core.

## Estructura

- `product-app/src/app`: rutas y composición de la aplicación.
- `product-app/src/features/products`: páginas, tabla, modelos HTTP y cliente de la API.
- `product-app/src/features/shared`: navegación, layout y página 404.
- `product-app/src/config`: URL de la API; acepta `VITE_API_URL`.
- `product-app/e2e`: pruebas de integración HTTP y de navegador con Playwright.
- `StoreBackend/src/StoreBackend.Api`: controladores, validación HTTP, CORS y manejo de errores.
- `StoreBackend.Facade`: coordinación, conversión a DTO y confirmación de cambios.
- `StoreBackend.DomainService`: operaciones de productos.
- `StoreBackend.Infrastructure`: DbContext y repositorios.
- `StoreBackend.Domain`, `StoreBackend.Dto`, `StoreBackend.Exceptions`: entidades, contratos internos y excepciones.
- `StoreBackend/database/setup.sql`: preparación explícita e idempotente de la base de datos.

El flujo de escritura es controlador → facade → servicio → repositorio; la facade llama a `SaveChangesAsync`. No debe eliminarse esa confirmación: el repositorio solo agrega o marca entidades para borrar. La estructura actual es una arquitectura por capas; servicio y facade dependen de Infrastructure, por lo que no implementa una arquitectura de dominio completamente independiente de EF.

## Requisitos

- .NET SDK 10.
- Node.js compatible con Vite: `^20.19.0 || >=22.12.0`; revisión ejecutada con Node 24.
- SQL Server accesible y una cuenta con permisos sobre la base `Store`.
- `sqlcmd` para ejecutar el script SQL, o ejecutar el mismo script desde una herramienta SQL.

## Preparación local

En este equipo la conexión verificada usa el contenedor `sqlserver`, con puerto del host **1434** y puerto del contenedor **1433**. No son intercambiables. La conexión ya está guardada en user-secrets para este usuario.

Para otra máquina, ajustar servidor, puerto, usuario y contraseña reales:

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1434;Database=Store;User Id=USUARIO;Password=CONTRASENA;TrustServerCertificate=True" --project StoreBackend/src/StoreBackend.Api
sqlcmd -S localhost,1434 -U USUARIO -C -b -i StoreBackend/database/setup.sql
```

`sqlcmd` solicita la contraseña. El script crea la base/tabla si no existen y agrega un índice único a `ProductResourceId`; conserva los productos existentes. Si encuentra identificadores duplicados, se detiene sin borrarlos. La API no modifica el esquema automáticamente.

No hay migraciones EF en este proyecto: la preparación inicial se realiza con ese script. Si se introducen migraciones después, debe establecerse primero una línea base del esquema existente.

## Arranque

Desde la raíz, en una terminal:

```powershell
dotnet restore StoreBackend/StoreBackend.slnx
dotnet run --project StoreBackend/src/StoreBackend.Api --launch-profile http
```

En otra terminal:

```powershell
cd product-app
npm ci
npm run dev
```

- Aplicación: http://localhost:5173 (la ruta inicial redirige a `/products`).
- API: http://localhost:5001/api/products.
- OpenAPI en Development: http://localhost:5001/openapi/v1.json.

El perfil `https` usa https://localhost:7074; requiere certificado de desarrollo y configurar `VITE_API_URL` con esa dirección. Para el flujo local documentado, usar el perfil `http`. Vite utiliza un puerto fijo: si 5173 está ocupado, hay que liberar ese puerto o ajustar tanto Vite como los orígenes CORS.

## Contrato de productos

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/api/products` | 200, lista |
| GET | `/api/products/{guid}` | 200 o 404 |
| POST | `/api/products` | 201 y cabecera Location |
| DELETE | `/api/products/{guid}` | 204 o 404 |

POST recibe `{"name":"Frijoles"}`. La API recorta espacios y exige de 2 a 50 caracteres. Genera un GUID; también acepta un `productResourceId` explícito por compatibilidad. Un GUID vacío o inválido produce 400; un identificador duplicado produce 409, incluso ante solicitudes concurrentes. Los errores se devuelven como ProblemDetails sin exponer trazas internas.

## Verificación

Con SQL Server y la API en ejecución:

```powershell
dotnet build StoreBackend/StoreBackend.slnx --configuration Release
cd product-app
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright inicia Vite si no estaba ejecutándose. Las pruebas crean productos propios y los eliminan al terminar; no borran productos preexistentes. Cubren persistencia, concurrencia, límites de validación, CORS, creación/detalle/borrado en Chromium, recarga de rutas, fallos de red y formulario móvil. `E2E_API_URL` permite cambiar la URL de los tests HTTP; la aplicación debe apuntar al mismo backend mediante `VITE_API_URL`.

Auditoría de dependencias:

```powershell
dotnet list StoreBackend/StoreBackend.slnx package --vulnerable --include-transitive
cd product-app
npm audit
```

## Configuración fuera de desarrollo

- Configurar `ConnectionStrings__DefaultConnection` en el entorno del backend. User-secrets se carga en Development.
- Configurar `Cors__AllowedOrigins__0`, etc., con los orígenes HTTPS reales del frontend.
- Establecer `VITE_API_URL` **antes** de `npm run build`; queda incorporada al JavaScript y no debe contener secretos. Se admite un valor vacío si la API se publica en el mismo origen.
- Publicar `product-app/dist` y configurar el servidor web para devolver `index.html` en las rutas del frontend, excluyendo `/api` y los archivos estáticos.
- Mantener HTTPS y usar un usuario de base de datos con permisos mínimos en producción.

**Límites actuales:** no hay autenticación ni autorización de productos; cualquier cliente con acceso a la API puede crear y eliminar. CORS no sustituye la autenticación. No hay edición ni paginación implementadas. Las comprobaciones locales no validan un despliegue de producción ni otros navegadores.

Se retiró la contraseña de la configuración de código, pero puede seguir presente en el historial de Git: debe rotarse antes de compartir o desplegar. Agregar archivos a `.gitignore` no elimina secretos del historial.
