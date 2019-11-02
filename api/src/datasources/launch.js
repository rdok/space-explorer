const { RESTDataSource } = require('apollo-datasource-rest')

class LaunchAPI extends RESTDataSource {

    constructor() {
        super()
        this.baseURL = 'https://api.spacexdata.com/v2/'
    }

    async getAll() {
        const response = await this.get('launches')

        return Array.isArray(response)
            ? response.map(launch => this.transform(launch))
            : []
    }

    async getById( { launchId } ) {
        const response = await this
            .get('launches', { flight_number: launchId } )

        return this.transform(response[0])
    }

    async getByIds( { launchIds } ) {
        return Promise.all( 
            launchIds.map(launchId => this.getById({ launchId }) )
        )
    }

    transform(launch) {

        return {

            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            }
        }
    }
}

module.exports = LaunchAPI
