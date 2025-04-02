# frontend/Dockerfile (para desarrollo)
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias primero (para mejor caché de Docker)
COPY package.json pnpm-lock.yaml* ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm && \
    pnpm install

# Copiar el resto de los archivos
COPY . .

# Puerto de Next.js
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["pnpm", "run", "dev"]