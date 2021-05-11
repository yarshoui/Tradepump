FROM node:14

ENV IP=0.0.0.0
ENV PORT=8080
ENV JWT_KEYS_FOLDER=/app/keys

WORKDIR /app
COPY package*.json /app/

RUN npm ci --only=production

COPY server /app/server
COPY build /app/build

EXPOSE 8080

ENTRYPOINT [ "node", "server/server.js" ]