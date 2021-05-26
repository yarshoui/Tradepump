FROM node:14

WORKDIR /app
COPY package*.json /app/

RUN npm ci --only=production

ADD build /app/

ENTRYPOINT [ "node", "harvester/src/index.js" ]
