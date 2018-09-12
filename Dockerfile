FROM php:7.2-apache
RUN docker-php-ext-install pdo pdo_mysql

RUN a2enmod rewrite

RUN touch .env

COPY . /var/www/html

MAINTAINER tec_itb@km.itb.ac.id
