# Step 1: Build the app
FROM node:22.17.1-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Build React app
RUN npm run build

# Step 2: Use a lightweight Node.js server to serve the static files
FROM node:22.17.1-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy the build output from previous stage
COPY --from=build /app/dist ./dist

# Set environment variable (optional but good for debugging)
ENV NODE_ENV=production

# Set default port for Cloud Run
ENV PORT=5173

# Expose port
EXPOSE 5173

# Serve the static files from the build folder
CMD ["serve", "-s", "dist", "-l", "5173"]
