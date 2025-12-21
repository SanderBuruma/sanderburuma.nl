#!/bin/bash
set -e

echo "Starting deployment..."

cd /var/www/sanderburuma.nl

# Fix git ownership issue
git config --global --add safe.directory /var/www/sanderburuma.nl

echo "Pulling latest changes from GitHub..."
git pull origin main

echo "Setting proper permissions..."
chown -R www-data:www-data /var/www/sanderburuma.nl

echo "Deployment completed successfully!"
