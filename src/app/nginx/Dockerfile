FROM alpine:3.17

LABEL maintainer="btchiman@student.42lausanne.ch"


# Install nginx
RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update \
    	   nginx openssl curl

# Expose port 443
EXPOSE 443

# Generate self-signed SSL certificate
RUN mkdir -p /etc/nginx/ssl/certs && \
	openssl req \
	# Generate a new certificate instead of a certificate request
	-x509 \
	# Days of validity
	-days 60 \
	# Algorithm of key
	-newkey rsa:4096 \
	# no encryption of private key (also no prompt). Should use -noenc instead
	-nodes \
	# Output file of the private key
	-keyout /etc/nginx/ssl/certs/transcendence.key \
	# Outut file of the public key
	-out /etc/nginx/ssl/certs/transcendence.crt \
	# Certificate details
	-subj "/CN=transcendence.42lausanne.ch/C=CH/ST=GE/L=GENEVA"

# Folder for the server configuration files
RUN mkdir -p /var/run/nginx

# Redirect nginx log output to Docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log


# Copy nginx configuration
COPY ./conf/nginx.conf /etc/nginx/http.d/default.conf
COPY ./proxy_params /etc/nginx/


# Start nginx
CMD ["nginx", "-g", "daemon off;"]