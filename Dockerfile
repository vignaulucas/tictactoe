FROM node:latest

WORKDIR /usr/app

COPY . .

RUN npm install

RUN npm install -g serve

RUN npm run build

EXPOSE 3000

CMD ["server", "-s", "build"]
