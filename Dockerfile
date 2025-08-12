# Use official Node.js 18 image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if exists
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port (for HTTP server)
EXPOSE 8080

# Start the bot
CMD ["npm", "start"]
