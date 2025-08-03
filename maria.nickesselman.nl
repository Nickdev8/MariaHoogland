# Upgrade/websocket helper
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    if ($host = maria.nickesselman.nl) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name maria.nickesselman.nl;
    return 301 https://$host$request_uri;


}

server {
    listen 443 ssl http2;
    server_name maria.nickesselman.nl;

    # SSL (Let’s Encrypt example; certbot will fill these in)
    ssl_certificate /etc/letsencrypt/live/nickesselman.nl-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nickesselman.nl-0001/privkey.pem;

    # Optional: serve built static assets directly (fast!)
    # They live in build/client
    location /client/ {
        alias /var/www/maria.nickesselman.nl/app/build/client/;
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Everything else -> Node server
    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # Optional timeouts for long responses/SSE
        proxy_read_timeout 300;
        proxy_send_timeout 300;
    }

    # (optional) increase upload size
    client_max_body_size 20M;

}
