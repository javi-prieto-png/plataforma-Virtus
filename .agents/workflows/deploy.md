---
description: Despliegue de producción del Sistema Antigravity
---

// turbo-all
1. Ejecuta la auditoría crítica de seguridad
```bash
npx.cmd tsx src/scripts/critical-audit.ts
```

2. Verifica las variables de entorno locales (Next.js)
```bash
ls .env.example
```

3. Construye el proyecto localmente para verificar errores de compilación
```bash
npm run build
```

4. Despliega a producción en Vercel
```bash
vercel deploy --prod
```

5. Verifica el estado del despliegue en el panel de Vercel (Manual)
