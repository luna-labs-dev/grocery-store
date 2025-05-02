# Stage 1
ARG VITE_apiKey=${VITE_apiKey}
ARG VITE_authDomain=${VITE_authDomain}
ARG VITE_projectId=${VITE_projectId}
ARG VITE_storageBucket=${VITE_storageBucket}
ARG VITE_messagingSenderId=${VITE_messagingSenderId}
ARG VITE_appId=${VITE_appId}
ARG VITE_measurementId=${VITE_measurementId}
ARG VITE_backend_url=${VITE_backend_url}

FROM node:20-alpine AS react-build
WORKDIR /app
COPY . ./
ENV NODE_OPTIONS="--max-old-space-size=4096"
ARG VITE_apiKey
ARG VITE_authDomain
ARG VITE_projectId
ARG VITE_storageBucket
ARG VITE_messagingSenderId
ARG VITE_appId
ARG VITE_measurementId
ARG VITE_backend_url
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]