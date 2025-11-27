FROM node:20-alpine AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Copy frontend build to be served by backend
COPY --from=frontend-build /frontend/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV DB_TYPE=postgres
ENV DB_HOST=postgres.railway.internal
ENV DB_PORT=5432
ENV DB_NAME=railway
ENV DB_USER=postgres
ENV DB_PASSWORD=urdMPVCJSMqnZhnNJUNVOfhlVfRuDovY
ENV JWT_SECRET=snsu-secret-key-2024-production
ENV JWT_EXPIRES_IN=7d
ENV CORS_ORIGIN=*

# Start the server
CMD ["node", "dist/server.js"]
