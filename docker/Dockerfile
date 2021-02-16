ARG PHP_BUILD_VERSION
ARG PHP_TEST_VERSION

FROM php:${PHP_BUILD_VERSION}-cli as build

ARG BUILD_ROOT_PATH

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN echo 'memory_limit = 256M' >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini;

RUN apt-get update
RUN apt-get install -y gnupg apt-transport-https ca-certificates

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update
RUN apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    curl \
    git \
    yarn \
    # These are for extensions
    zlib1g-dev \
    libicu-dev \
    g++ \
    # For installing things from URL
    wget

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/bin --filename=composer --version=1.10.19 && \
    php -r "unlink('composer-setup.php');"

RUN docker-php-ext-install intl json zip && \
    docker-php-ext-enable intl json zip

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs

# Install Phive
RUN wget -O phive.phar "https://phar.io/releases/phive.phar"
RUN wget -O phive.phar.asc "https://phar.io/releases/phive.phar.asc"
RUN gpg --keyserver hkps.pool.sks-keyservers.net --recv-keys 0x9D8A98B29B2D5D79
RUN gpg --verify phive.phar.asc phive.phar
RUN rm phive.phar.asc && \
    chmod +x phive.phar && \
    mv phive.phar /usr/local/bin/phive

WORKDIR ${BUILD_ROOT_PATH}
COPY . ./


FROM php:${PHP_TEST_VERSION}-cli as test

ARG BUILD_ROOT_PATH

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN apt-get update
RUN apt-get install -y \
    zip \
    unzip \
    # These are for extensions
    libzip-dev \
    libicu-dev \
    g++
RUN pecl install xdebug-3.0.2
RUN docker-php-ext-install pcntl posix intl zip pdo_mysql

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs

WORKDIR ${BUILD_ROOT_PATH}
COPY --from=build ${BUILD_ROOT_PATH} ${BUILD_ROOT_PATH}
