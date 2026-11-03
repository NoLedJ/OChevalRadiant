#!/usr/bin/env bash
# CI-only Apache recipe for Ubuntu. No production credentials or server access.
set -euo pipefail

seo_apache_dir="$(mktemp -d "${RUNNER_TEMP:-/tmp}/ocheval-seo-apache.XXXXXX")"
seo_document_root="$(pwd)/dist/ocheval-radiant/browser"
seo_apache_conf="$seo_apache_dir/httpd.conf"

openssl req -x509 -newkey rsa:2048 -nodes -days 1 \
  -subj '/CN=localhost' \
  -addext 'subjectAltName=IP:127.0.0.1,DNS:localhost,DNS:ochevalradiant.com,DNS:www.ochevalradiant.com' \
  -keyout "$seo_apache_dir/localhost.key" -out "$seo_apache_dir/localhost.crt" 2>/dev/null

cat > "$seo_apache_conf" <<EOF
ServerRoot /etc/apache2
ServerName localhost
User $(id -un)
Group $(id -gn)
DefaultRuntimeDir "$seo_apache_dir"
PidFile "$seo_apache_dir/httpd.pid"
ErrorLog "$seo_apache_dir/error.log"
LogLevel warn
Listen 127.0.0.1:4390
Listen 127.0.0.1:4391
Listen 127.0.0.1:4392
LoadModule mpm_event_module /usr/lib/apache2/modules/mod_mpm_event.so
LoadModule authz_core_module /usr/lib/apache2/modules/mod_authz_core.so
LoadModule authz_host_module /usr/lib/apache2/modules/mod_authz_host.so
LoadModule dir_module /usr/lib/apache2/modules/mod_dir.so
LoadModule mime_module /usr/lib/apache2/modules/mod_mime.so
LoadModule rewrite_module /usr/lib/apache2/modules/mod_rewrite.so
LoadModule headers_module /usr/lib/apache2/modules/mod_headers.so
LoadModule setenvif_module /usr/lib/apache2/modules/mod_setenvif.so
LoadModule expires_module /usr/lib/apache2/modules/mod_expires.so
LoadModule filter_module /usr/lib/apache2/modules/mod_filter.so
LoadModule deflate_module /usr/lib/apache2/modules/mod_deflate.so
LoadModule socache_shmcb_module /usr/lib/apache2/modules/mod_socache_shmcb.so
LoadModule ssl_module /usr/lib/apache2/modules/mod_ssl.so
TypesConfig /etc/mime.types
DocumentRoot "$seo_document_root"
# Test-only fault injection. No such header/env handling is shipped to Hostinger.
SetEnvIf X-Seo-Test-Redirect-Status "^([0-9]+)$" REDIRECT_STATUS=\$1
Header always set X-Seo-Test-Observed-Status "%{REDIRECT_STATUS}e"
<Directory "$seo_document_root">
  AllowOverride All
  Options FollowSymLinks
  Require all granted
</Directory>
<FilesMatch "^\\.ht">
  Require all denied
</FilesMatch>
<VirtualHost 127.0.0.1:4390>
  ServerName localhost
</VirtualHost>
<VirtualHost 127.0.0.1:4391>
  ServerName localhost
  SSLEngine on
  SSLCertificateFile "$seo_apache_dir/localhost.crt"
  SSLCertificateKeyFile "$seo_apache_dir/localhost.key"
</VirtualHost>
# Approximation of a front HTTPS redirect, NOT an emulation of LiteSpeed/hPanel.
<VirtualHost 127.0.0.1:4392>
  ServerName localhost
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^www\\.ochevalradiant\\.com$ [NC]
  RewriteRule ^ https://www.ochevalradiant.com%{REQUEST_URI} [R=301,L,NE]
  RewriteRule ^ https://ochevalradiant.com%{REQUEST_URI} [R=301,L,NE]
</VirtualHost>
EOF

seo_apache_started=false
seo_apache_cleanup() {
  if [ "$seo_apache_started" = true ]; then apache2 -f "$seo_apache_conf" -k stop; fi
  if [ -f "$seo_apache_dir/error.log" ]; then cat "$seo_apache_dir/error.log"; fi
}
trap seo_apache_cleanup EXIT
apache2 -v
apache2 -t -f "$seo_apache_conf"
apache2 -f "$seo_apache_conf" -k start
seo_apache_started=true
for attempt in {1..20}; do
  if curl --silent --fail http://127.0.0.1:4390/ >/dev/null; then break; fi
  sleep 0.2
done
python3 scripts/check-http-seo.py --http http://127.0.0.1:4390 \
  --https https://127.0.0.1:4391 --ca "$seo_apache_dir/localhost.crt" \
  --front-http http://127.0.0.1:4392 --fixture-env
