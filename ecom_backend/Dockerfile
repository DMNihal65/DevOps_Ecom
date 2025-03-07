FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies based on environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm install

# Copy app source
COPY . .

# Default environment variables
ENV PORT=3000
ENV LOG_LEVEL=info

EXPOSE 3000

# Use different commands for dev and prod
CMD if [ "$NODE_ENV" = "production" ]; then \
      npm start; \
    else \
      npm run dev; \
    fi 