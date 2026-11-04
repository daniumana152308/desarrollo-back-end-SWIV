# Frontend ProductHub

React + TypeScript + Vite. Consulta [las instrucciones de la raíz](../README.md) para preparar SQL Server y arrancar la API.

```powershell
npm ci
npm run dev
```

El servidor usa http://localhost:5173 y la API predeterminada es http://localhost:5001. Puedes copiar `.env.example` a `.env.local` y cambiar `VITE_API_URL`; reinicia Vite después. Esta variable es pública y se incorpora durante el build.

```powershell
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Los tests requieren la API y SQL Server en ejecución. Playwright inicia Vite cuando hace falta. `npm run preview` sirve el build en http://localhost:4173.

Las rutas están en `src/app/App.tsx`; la funcionalidad de productos está en `src/features/products`. Los estados de carga, cancelación y error evitan mostrar respuestas de consultas abandonadas.
