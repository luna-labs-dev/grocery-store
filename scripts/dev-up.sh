#!/bin/bash

# dev-up.sh: Quick-start development infrastructure
echo "🚀 Starting Grocery Store Infrastructure..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# Spin up containers
docker compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to be healthy..."

# Wait for Postgres
until docker exec grocery-store-backend-postgres pg_isready -p 5433 -U postgres > /dev/null 2>&1; do
  printf "."
  sleep 1
done
echo "✅ Postgres is UP"

# Wait for Valkey
until docker exec grocery-store-valkey valkey-cli ping > /dev/null 2>&1; do
  printf "."
  sleep 1
done
echo "✅ Valkey is UP"

# Wait for Jaeger UI
until curl -s http://localhost:16686 > /dev/null; do
  printf "."
  sleep 1
done
echo "✅ Jaeger UI is UP"

echo "🎉 Infrastructure is ready for development!"
echo "📍 Jaeger UI: http://localhost:16686"
