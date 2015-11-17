# Http Proxy

Simple project demonstrating a front-end proxy forwarding a request & setting a hostname to a backend service.

# Use

Install, run, open browser:

```
npm install
npm start
xdg-open http://localhost:8080/package.json
```

Outputs:

```
PROX GET localhost:8080 /package.json ::ffff:127.0.0.1
FILE GET yoyodyne.net /package.json ::ffff:127.0.0.1
```

Proxy got the request, forwarded it to the backend, which sees the request as for a yoyodyne.net resource.
