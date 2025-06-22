# Stage 1
ARG VITE_backend_url=${VITE_backend_url}
ARG VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ARG VITE_domain=${VITE_domain}

FROM node:20-alpine AS react-build
WORKDIR /app
COPY . ./
ENV NODE_OPTIONS="--max-old-space-size=4096"
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_backend_url
ARG VITE_domain
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]