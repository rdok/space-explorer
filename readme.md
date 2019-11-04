## SpaceX Explorer using GraphQL - [Specs](https://www.apollographql.com/docs/tutorial/introduction/)

API - https://api.space-explorer.rdok.dev/ [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=space-explorer%2FAPI)](https://jenkins.rdok.dev/view/Training/job/space-explorer/job/API/) 

React - https://space-explorer.rdok.dev/ [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=space-explorer%2Freact)](https://jenkins.rdok.dev/job/space-explorer/job/react/)

***

[![graphql-playground](https://raw.githubusercontent.com/rdok/space-explorer/master/graphql-playground.png)](https://api.space-explorer.rdok.dev/)]


### GraphQL Requests

```
query PaginateLaunches {
  launches(pageSize: 3){
    launches {
      id
      site
      mission { name } 
      rocket { id name type }
    }
  }
}
```
