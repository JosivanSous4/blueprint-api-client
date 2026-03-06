FROM node:18-alpine

WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/routes /app/data

# Copy package files
COPY package*.json ./

# Install dependencies - usando npm install em vez de npm ci
RUN npm install --only=production

# Copy application code
COPY server.js .
COPY routes/ ./routes/

# Ensure routes directory has the api.js file
RUN ls -la /app/routes/

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "server.js"]