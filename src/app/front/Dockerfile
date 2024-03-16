FROM node

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y iputils-ping dnsutils

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "build"]
