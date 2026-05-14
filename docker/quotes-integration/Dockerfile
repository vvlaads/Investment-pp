# Build stage for the Go application
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY 6-quotes-receiver/go.mod 6-quotes-receiver/go.sum ./
RUN go mod download
COPY 6-quotes-receiver/main.go .
RUN go build -o quotes-receiver main.go

# Final stage
FROM ubuntu:22.04

# Install build tools and kernel headers
RUN apt-get update && apt-get install -y \
    build-essential \
    linux-headers-generic \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built Go application
COPY --from=builder /app/quotes-receiver .

# Copy the driver source code
COPY 7-linux-driver/ ./driver/

# Create a startup script to load the driver and start the app
COPY <<'EOF' /app/entrypoint.sh
#!/bin/bash
set -e

echo "Building kernel module..."
cd /app/driver
make

echo "Loading kernel module..."
# We use insmod to load the module.
# Note: This requires the container to be run in privileged mode.
insmod financial_quotes.ko

echo "Setting up device permissions..."
chmod 660 /dev/financial_quotes
# Create a group 'financial' if it doesn't exist and assign it
groupadd -r financial || true
chgrp financial /dev/financial_quotes

echo "Enabling quote generation..."
echo "1" > /sys/kernel/financial/control

echo "Starting quotes-receiver..."
cd /app
./quotes-receiver \
    -driver /dev/financial_quotes \
    -port 8080 \
    -interval 100 \
    -rabbitmq "${RABBITMQ_URL:-amqp://guest:guest@localhost:5672/}" \
    -queue "${RABBITMQ_QUOTES_QUEUE:-quotes-queue}"
EOF

RUN chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
