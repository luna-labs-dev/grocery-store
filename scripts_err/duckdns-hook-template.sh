#!/bin/bash
# Replace with your actual DuckDNS Token
TOKEN="YOUR_DUCK_DNS_TOKEN_HERE"
DOMAIN="your-dns.duckdns.org"

if [ -z "$CERTBOT_AUTH_OUTPUT" ]; then
    # AUTH PHASE: Set the TXT record
    # Certbot provides $CERTBOT_VALIDATION automatically
    curl -s "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&txt=$CERTBOT_VALIDATION"
    # Wait for DuckDNS to propagate
    sleep 60
else
    # CLEANUP PHASE: Clear the TXT record
    curl -s "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&txt=removed&clear=true"
fi

# Duplicate this folder and rename it to .scripts (So it doesn't get committed to the repo)
# Rename the file to duckdns-hook.sh
# Replace the TOKEN and DOMAIN with your actual values
# Make the script executable: chmod +x duckdns-hook.sh
# Check the docs/local-dns.md for more information