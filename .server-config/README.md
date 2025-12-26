# Server Configuration for Cache Headers

This directory contains cache header configurations for your VPS web server.

## Which file to use?

Run this command on your VPS to check which web server you're using:

```bash
# Check for nginx
systemctl status nginx

# Check for Apache
systemctl status apache2
```

## For Nginx

1. SSH into your VPS: `ssh root@45.76.20.122`
2. Edit your site config: `sudo nano /etc/nginx/sites-available/sanderburuma.nl`
3. Copy the contents of `nginx-cache.conf` into your `server {}` block
4. Test config: `sudo nginx -t`
5. Reload nginx: `sudo systemctl reload nginx`

## For Apache

**Option 1: Using .htaccess (easier)**

1. Copy `apache-cache.conf` to `/var/www/sanderburuma.nl/.htaccess`:
   ```bash
   scp .server-config/apache-cache.conf root@45.76.20.122:/var/www/sanderburuma.nl/.htaccess
   ```

**Option 2: Using VirtualHost config (more efficient)**

1. SSH into your VPS: `ssh root@45.76.20.122`
2. Edit your site config: `sudo nano /etc/apache2/sites-available/sanderburuma.nl.conf`
3. Copy the contents of `apache-cache.conf` into your `<VirtualHost>` block
4. Enable required modules:
   ```bash
   sudo a2enmod expires headers deflate
   ```
5. Test config: `sudo apache2ctl configtest`
6. Reload Apache: `sudo systemctl reload apache2`

## Testing Cache Headers

After applying the config, test it with:

```bash
curl -I https://sanderburuma.nl/assets/index-*.js
```

Look for the `Cache-Control` header in the response.
