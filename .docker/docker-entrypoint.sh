#!/bin/sh
set -eu

: "${API_BASE_URL:=__MOCK__}"
: "${APP_ENV:=production}"

envsubst '$API_BASE_URL $APP_ENV' \
  < /usr/share/nginx/html/env.template.js \
  > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'
