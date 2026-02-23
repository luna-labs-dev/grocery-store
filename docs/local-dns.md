# 🚀 Local HTTPS Development Setup (Debian 13)

This configuration enables a professional local environment using a single domain with path-based routing. This ensures **SSL trust** on mobile devices and **seamless cookie transport** between frontend and backend by keeping them on the same origin.

---

### 1. DNS Configuration
* **DuckDNS**: Create a subdomain (e.g., `lunalabs-local.duckdns.org`).
* **Technitium DNS**: Point an **A Record** for `lunalabs-local.duckdns.org` to your local machine IP (e.g., `192.168.x.x`). This ensures traffic stays within your home network.

---

### 2. SSL Generation (DNS-01 Challenge)
Since public authorities cannot verify local IPs via HTTP, we use a DNS hook to prove ownership of the DuckDNS domain.

#### A. Create the Hook Script (`~/duckdns-hook.sh`)
```bash
#!/bin/bash
# Your DuckDNS Token from the dashboard
TOKEN="YOUR_DUCKDNS_TOKEN"
DOMAIN="lunalabs-local"

if [ -z "$CERTBOT_AUTH_OUTPUT" ]; then
    # AUTH PHASE: Set TXT record
    curl -s "[https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&txt=$CERTBOT_VALIDATION](https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&txt=$CERTBOT_VALIDATION)"
    echo "TXT record set. Waiting 60s..."
    sleep 60
else
    # CLEANUP PHASE: Clear TXT record
    curl -s "[https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&txt=removed&clear=true](https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&txt=removed&clear=true)"
    echo "TXT record cleared."
fi
```
**Permissions:** `chmod +x ~/duckdns-hook.sh`

#### B. Generate the Certificate
```bash
sudo certbot certonly --manual \
  --preferred-challenges dns \
  --manual-auth-hook ~/duckdns-hook.sh \
  --manual-cleanup-hook ~/duckdns-hook.sh \
  -d "*.lunalabs-local.duckdns.org"
```

---

### 3. Caddy Reverse Proxy Setup
Caddy handles SSL termination and routes traffic to your Vite and Node.js processes.

#### A. Install Caddy
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf '[https://dl.cloudsmith.io/public/caddy/stable/gpg.key](https://dl.cloudsmith.io/public/caddy/stable/gpg.key)' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf '[https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt](https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt)' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

#### B. Configure `/etc/caddy/Caddyfile`
Replace the content of `/etc/caddy/Caddyfile` with:
```caddy
lunalabs-local.duckdns.org {
    # 1. Route /api requests to Backend (preserves /api prefix)
    handle /api/* {
        reverse_proxy localhost:8000
    }

    # 2. Route all other requests to Vite Frontend
    handle {
        reverse_proxy localhost:3030
    }

    # 3. SSL Configuration (Paths from Certbot)
    tls /etc/letsencrypt/live/lunalabs-local.duckdns.org/fullchain.pem /etc/letsencrypt/live/lunalabs-local.duckdns.org/privkey.pem
}
```

---

### 4. Permissions & Activation
Caddy must have permission to read the Let's Encrypt files.

```bash
# Set ownership for Caddy user
sudo chown -R caddy:caddy /etc/letsencrypt/live/
sudo chown -R caddy:caddy /etc/letsencrypt/archive/

# Set directory and file permissions
sudo find /etc/letsencrypt/live -type d -exec chmod 755 {} +
sudo find /etc/letsencrypt/archive -type d -exec chmod 755 {} +
sudo find /etc/letsencrypt/live -type f -exec chmod 644 {} +

# Validate and Restart
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

---

### 5. Troubleshooting & Architecture
* **Cookie Issues**: Since the domain is the same for both app and api, cookies are treated as "Same-Origin." 
* **Mobile Trust**: Ensure your mobile phone is using your **Technitium DNS** server IP in its network settings.
* **Renewal**: Certbot stores the hook script path. Running `sudo certbot renew` will automatically update the DNS record and refresh the certs.