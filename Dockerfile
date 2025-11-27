FROM node:18-alpine AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine

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

# Expose port (Railway sets PORT automatically)
EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
