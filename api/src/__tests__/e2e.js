const { server } = require( '../' )
const gql = require( 'graphql-tag' )

const { startTestServer, toPromise } = require( './__utils' )

const LAUNCH_LIST_QUERY = gql`
   query myLaunches( $pageSize: Int, $after: String ) {
      launches( pageSize: $pageSize, after: $after ) {
         cursor
         launches {
            mission {
               name
               missionPatch
            }
         }
      }
   }
`

const GET_LAUNCH = gql`
   query launch( $id: ID ) {
      launch( id: $id ) {
         id
         isBooked
         rocket { type }
         mission { name }
      }
   }
`

describe('Server - e2e', () => {
   let stop, grapphql

   beforeEach( async() => {
      const testServer = await startTestServer( server )
      stop = testServer.stop
      graphql = testServer.graphql
   })

   afterEach( () => stop() )

   it('gets list of launches', async () => {
      const response = await toPromise(
         graphql({
            query: LAUNCH_LIST_QUERY,
            variables: { pageSize: 1, after: '1517949900' }
         })
      )

      expect( response ).toMatchSnapshot()
   })

   it('gets a single launch', async () => {
      const response = await toPromise(
         graphql( { query: GET_LAUNCH, variables: { id: 30 } } )
      )

      expect( response ).toMatchSnapshot()
   })
})
