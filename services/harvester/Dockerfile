FROM node:14

WORKDIR /app
COPY package*.json /app/
COPY .npmrc /app/

RUN npm ci --only=production

ADD build /app/

ENTRYPOINT [ "node", "index.js" ]
