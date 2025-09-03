# Dockerfile para Railway deployment
FROM node:18-alpine AS base

# Instalar dependencias para compilación
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY bun.lock* ./

# Instalar dependencias usando --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Imagen de producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=base /app/public ./public
COPY --from=base /app/package*.json ./

# Copiar archivos de build
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
