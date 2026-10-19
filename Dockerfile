# ---------- Etapa 1: build ----------
# Compila la SPA de React (Vite) a archivos estáticos (dist/).
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite "hornea" las variables VITE_* dentro del build en este momento, no en
# tiempo de ejecución — por eso se reciben como build-arg y no como variable
# de entorno del contenedor final.
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Etapa 2: runtime ----------
# Sirve los archivos estáticos con Nginx, mucho más liviano que dejar Node
# corriendo solo para servir HTML/JS/CSS.
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
