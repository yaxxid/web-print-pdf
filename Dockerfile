# Use a Node.js base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install system dependencies required for Chromium
# This list is exhaustive and necessary to fix the 'ENOENT' error by installing 
# both Chromium itself and all its runtime dependencies.
# The 'chromium' package is what provides the /usr/bin/chromium executable.
RUN apt-get update && \
    apt-get install -y \
    chromium \
    gconf-service \
    libappindicator1 \
    libasound2 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libfontconfig1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libicu-dev \
    libjpeg-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libssl-dev \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxshmfence-dev \
    libsqlite3-0 \
    libgbm-dev \
    libnss3 \
    libnspr4 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of your application code
COPY . .

# Expose the port (Render handles mapping this)
EXPOSE 3000

# Command to run your application when the container starts
CMD ["npm", "start"]
