# Tradepump UI

Client facing application on react

## Developing

Using npm:
```sh
npm start
```

### Docker container

Docker container is built against nginx web server. It's doing static serving and also proxying API request for API Server

`nginx.conf` file is basically a virtual host configuration file describing it. It's used as a template in the container.

`SERVER_URL` environment variable is used to define runtime proxy_pass url for API server. By default it is `http://localhost:8080`
