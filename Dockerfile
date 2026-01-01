FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port used by "npm run start" (configured to 8080 in package.json)
EXPOSE 8080

# Start command
CMD ["npm", "run", "start"]
