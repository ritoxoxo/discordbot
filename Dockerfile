# Use official Node.js 18 image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files to container
COPY . .

# Expose port (not really needed for Discord bot, but good practice)
EXPOSE 8080

# Run the bot
CMD ["npm", "start"]
