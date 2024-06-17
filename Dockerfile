FROM node

WORKDIR /contact-app

COPY . /contact-app

RUN npm install

EXPOSE 8080

CMD ['node','server']