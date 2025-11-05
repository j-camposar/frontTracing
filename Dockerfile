# Etapa 1: construir la aplicación
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos
COPY . .
RUN npm run build

# Etapa 2: servir la aplicación con Nginx
FROM nginx:alpine

# Copiamos la build de React al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
