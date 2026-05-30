# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (caching layer)
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate the public Supabase configuration .env file for Vite at build time
RUN echo "VITE_SUPABASE_URL=https://wcwufsyroraeirgeoaes.supabase.co" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3Vmc3lyb3JhZWlyZ2VvYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTcxOTMsImV4cCI6MjA5NTM3MzE5M30.ryvNqpXNxykBW154kpXSGQOURzlWYVcrKMfeiXxXBAk" >> .env

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
