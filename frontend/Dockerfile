# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia primero solo package.json y package-lock.json para aprovechar cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Copia el resto de archivos del proyecto (incluido .env si es necesario)
COPY . .

# Compila el proyecto
RUN npm run build

# Expone el puerto por defecto de Next.js
EXPOSE 3000

# Comando para arrancar el servidor en modo producción
CMD ["npm", "start"]
