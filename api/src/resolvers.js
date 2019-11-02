const { paginateResults } = require('./utils')

module.exports = {
    Query: {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAll();

            allLaunches.reverse();

            const launches = paginateResults({
                after, pageSize, results: allLaunches
            });

           let cursor = null
           let hasMore = false 

           if( launches.length ) {
              cursor =  launches[launches.length - 1].cursor 
              hasMore = launches[launches.length - 1].cursor !== 
                 allLaunches[allLaunches.length - 1].cursor          
           }

            return { launches, cursor: cursor, hasMore: hasMore }
        },
       launch: (_, { id }, { dataSources }) => 
         dataSources.launchAPI.getById({ launchId: id }),
       me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreate()
    },
    Mission: {
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL' 
              ? mission.missionPatchSmall 
              : mission.missionPatchLarge
        }
    },
    Launch: {
        isBooked: async (launch, _, { dataSources }) =>
            dataSources.userAPI.hasTrip({ launchId: launch.id })
    },
    User: {
        trips: async (_, __, { dataSources }) => {
            const launchIds = await dataSources.userAPI.getLaunchIds()

            if ( ! launchIds.length ) return []

            return dataSources.launchAPI.getByIds({ launchIds }) || []
        }
    },
    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreate({ email })
            if ( user ) return Buffer.from(email).toString('base64')
        },
        bookTrips: async (_, { launchIds }, { dataSources }) => {
            const results = await dataSources.userAPI.bookTrips({ launchIds })
            const launches = await dataSources.launchAPI.getByIds({
                launchIds
            })

            return {
                success: results && results.length === launchIds.length,
                message: results.length === launchIds.length
                    ? 'trips booked successfully'
                    : `the following launches couldn't be booked: ${launchIds.filter( id => !results.includes(id) )}`,
                launches
            }
        },
        cancelTrip: async (_, { launchId }, { dataSources }) => {
            const result = await dataSources.userAPI.cancelTrip({ launchId })

            if( ! result ) {
                return {
                    success: false,
                    message: 'failed to cancel trip'
                }
            }

            const launch = await dataSources.launchAPI.getById({ launchId })
            
            return {
                success: true,
                message: 'trip canceled',
                launches: [launch]
            }
        }
    }
}
