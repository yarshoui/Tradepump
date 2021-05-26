FROM nginx:latest

ENV SERVER_URL http://localhost:8080

COPY build  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.template

ENTRYPOINT [ "/bin/bash", "-c", "envsubst '$SERVER_URL' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'" ]
