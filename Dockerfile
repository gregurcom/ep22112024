# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY app/package*.json ./
RUN npm install

# Copy application source code
COPY app/ .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
