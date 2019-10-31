## Dev

> Prerequisite: Docker

Start local api  
$ `./npm run dev` 

Publish GraphQL to Apollo engine  
> While running the local api. 179.19.0.1 is the container's network gateway
$ `./npx apollo service:push --endpoint=http://172.19.0.1:4000`

> Run tests
$ `./npm run test` 
