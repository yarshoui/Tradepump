FROM node:18

ENV IP=0.0.0.0
ENV PORT=8080
ENV JWT_KEYS_FOLDER=/app/keys

WORKDIR /app

COPY build /app

EXPOSE 8080

ENTRYPOINT [ "node", "server.js" ]
