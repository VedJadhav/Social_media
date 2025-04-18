# Use Node.js v16 to build the frontend
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend files and build the app
COPY . .
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the build files from the build stage to Nginx's HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to serve the frontend
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
