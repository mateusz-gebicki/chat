#!/bin/bash

composer install --no-interaction --prefer-dist --optimize-autoloader

cp .env.example .env

chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

php artisan jwt:secret

if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    chmod 666 database/database.sqlite
fi

php artisan migrate --force
php artisan db:seed --force
