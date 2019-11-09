FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . /app

RUN yarn install --production

RUN npm run build

ENTRYPOINT ["yarn", "run", "production"]
