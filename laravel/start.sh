#!/bin/bash

chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

composer install --no-interaction --prefer-dist --optimize-autoloader

cp .env.example .env

php artisan jwt:secret --force

if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    chmod 666 database/database.sqlite
fi

php artisan migrate --force
php artisan db:seed --force
