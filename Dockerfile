FROM node:alpine3.16

# # Set Working Directory
WORKDIR /app

# Copy Node Packages Requirement
COPY . .

# Install Node Modules Based On Node Packages Requirement
RUN  npm i -g nodemon \
    && npm i \
    && npm run build


# Run The Application
CMD npm run start