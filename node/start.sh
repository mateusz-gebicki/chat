#!/bin/bash

npm install

cp .env.example .env

if [ -f /laravel/.env ]; then
  jwt=$(grep '^JWT_SECRET=' /laravel/.env | cut -d '=' -f2- | tr -d '\r')
  [ -n "$jwt" ] && sed -i '/^JWT_SECRET=/d' .env && echo "JWT_SECRET=$jwt" >> .env
fi

exec node server.js
