# Use official Node.js 18 image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port for Cloud Run health checks (optional)
EXPOSE 8080

# Start the bot
CMD ["npm", "start"]
