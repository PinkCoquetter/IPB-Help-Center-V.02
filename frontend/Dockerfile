# Dockerfile for the Vite React frontend
# -------------------------------------------------
# Stage 1: Build the React app using Node
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy the rest of the source code
COPY . ./

# Build the production assets
RUN npm run build

# Stage 2: Serve the built assets with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: copy custom nginx config if exists (fallback to default)
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
