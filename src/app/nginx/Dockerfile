FROM alpine:3.17

LABEL maintainer="btchiman@student.42lausanne.ch"

# Install nginx
RUN apk update && apk upgrade \
	&& apk add --no-cache --quiet --update \
	nginx openssl curl wget

# Expose ports 80 and 443 for Nginx
EXPOSE 80 443 9113

# Generate self-signed SSL certificate
RUN mkdir -p /etc/nginx/ssl/certs && \
	openssl req \
	-x509 \
	-days 60 \
	-newkey rsa:4096 \
	-nodes \
	-keyout /etc/nginx/ssl/certs/transcendence.key \
	-out /etc/nginx/ssl/certs/transcendence.crt \
	-subj "/CN=transcendence.42lausanne.ch/C=CH/ST=GE/L=GENEVA"

# Folder for the server configuration files
RUN mkdir -p /var/run/nginx

# Redirect nginx log output to Docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

# Copy nginx configuration
COPY ./conf/nginx.conf /etc/nginx/http.d/default.conf
COPY ./proxy_params /etc/nginx/

# Install Nginx Prometheus Exporter
RUN wget https://github.com/nginxinc/nginx-prometheus-exporter/releases/download/v1.1.0/nginx-prometheus-exporter_1.1.0_linux_amd64.tar.gz && \
	tar -xzvf nginx-prometheus-exporter_1.1.0_linux_amd64.tar.gz && \
	mv nginx-prometheus-exporter /usr/local/bin/nginx-prometheus-exporter && \
	chmod +x /usr/local/bin/nginx-prometheus-exporter && \
	rm -f nginx-prometheus-exporter_1.1.0_linux_amd64.tar.gz


# Start nginx
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "-c", "nginx -g 'daemon off;' & nginx-prometheus-exporter"]
