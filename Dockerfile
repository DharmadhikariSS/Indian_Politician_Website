# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (caching layer)
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Pass build arguments (Supabase variables are needed at build time by Vite)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set them as environment variables during the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the project
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080 (Google Cloud Run default port requirement)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
