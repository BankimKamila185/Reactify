FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install for better npm version compatibility)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
