FROM node:14

ENV IP=0.0.0.0
ENV PORT=8080
ENV JWT_KEYS_FOLDER=/app/keys

WORKDIR /app
COPY package*.json /app/
COPY .npmrc /app/

RUN npm ci --only=production

COPY src /app/

EXPOSE 8080

ENTRYPOINT [ "node", "server.js" ]
