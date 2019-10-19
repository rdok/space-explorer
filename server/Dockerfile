FROM node:12-alpine

COPY src /app

WORKDIR /app

RUN npm install --production

ENTRYPOINT ["npm", "run", "production"]
