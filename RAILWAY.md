# Railway Deployment

Este proyecto está configurado para desplegarse automáticamente en Railway.

## Configuración para Railway

### 1. Variables de entorno necesarias (si las tienes):
- `NODE_ENV=production`
- Cualquier otra variable específica de tu aplicación

### 2. Archivos de configuración incluidos:
- `Dockerfile` - Imagen Docker optimizada para Next.js
- `.dockerignore` - Archivos a ignorar en el build
- `next.config.ts` - Configurado con output: 'standalone'

### 3. Comandos importantes:
```bash
# Build local para probar
npm run build

# Para desarrollo local con peer deps
npm install --legacy-peer-deps
```

### 4. Deploy en Railway:
1. Conecta tu repositorio de GitHub
2. Railway detectará automáticamente el Dockerfile
3. El deploy se hará automáticamente en cada push a main

### 5. Notas técnicas:
- Se usa `--legacy-peer-deps` para resolver conflictos de dependencias
- Next.js configurado en modo `standalone` para Docker
- Puerto 3000 expuesto para Railway
- Imagen Alpine de Node.js para menor tamaño
