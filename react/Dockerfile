FROM node:12-alpine

COPY . /app

WORKDIR /app

RUN npm install --production

ENTRYPOINT ["npm", "run", "production"]
