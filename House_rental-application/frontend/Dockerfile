# ==========================================
# Stage 1: Build React Production Bundle
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Set production API URL (Relative path prevents CORS issues)
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy source code and build static assets
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve with Hardened Nginx
# ==========================================
FROM nginx:1.25-alpine AS runner

# Remove default "Welcome to Nginx" page
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom Nginx configuration (with the try_files rule!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY compiled React assets from Stage 1 into Nginx's web folder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

# Run Nginx in the foreground (PID 1)
CMD ["nginx", "-g", "daemon off;"]
