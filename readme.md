## SpaceX Explorer using GraphQL - [Specs](https://www.apollographql.com/docs/tutorial/introduction/)

[![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=space-explorer%2FAPI)](https://jenkins.rdok.dev/view/Training/job/space-explorer/job/API/)

[![graphql-playground](https://raw.githubusercontent.com/rdok/space-explorer/master/graphql-playground.png)](https://api.space-explorer.rdok.dev/)]

### GraphQL Requests

```
query GetLaunchIds {
  launches {
    id
    site
    mission {
      name
    }
    rocket {
      id
      name
      type
    }
  }
}

query GetLaunchById($id: ID!) {
  launch(id: $id) {
    id
    rocket {
      id
      type
    }
  }
}


query PaginateLaunches {
  launches(pageSize: 3){
    launches {
      id
      site
    }
  }
}

mutation LoginUser {
  login(email: "r.dokollari@gmail.com")
}

mutation BookTrips {
  bookTrips(launchIds: [67, 68, 69]) {
    success
    message
    launches {
      id
    }
  }
}
```

#### HTTP Headers
```
{
	"authorization" :"****************************"
}
```
