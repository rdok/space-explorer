const { DataSource } = require('apollo-datasource')
const isEmail = require('isemail')

class UserAPI extends DataSource {

    constructor({ store }) {
        super()
        this.store = store
    }

    initialize(config) {
        this.context = config.context
    }

    async findOrCreateUser({ email: emailArg } = {}) {
        const email = this.context && this.context.user 
            ? this.context.user.email : emailArg

        if( ! email || ! isEmail.validate(email) ) return null

        const users = await this.store.users.findOrCreate({where: { email } })

        return users && users[0] ? users[0] : null
    }

    async bookTrips({ launchIds }) {
        const userId = this.context.user.id

        if( ! userId ) { return }

        let results = []

        for (const launchId of launchIds) {

            const response = await this.bookTrip({ launchId })

            if ( response ) {
                results.push(response)
            }
        }

        return results
    }

    async bookTrip({ launchId }) {
        const userId = this.context.user.id
        const response = await this.store.trips.findOrCreate({
            where: { userId, launchId }
        })

        return response && response.length ? response[0].get() : false
    }

    async cancelTrip({ launchId }) {
        const userId = this.context.user.id

        return !!this.store.trips.destroy({ where: {userId, launchId} })
    }

    async getLaunchIdsByUser() {
        const userId = this.context.user.id
        const launches = await this.store.trips.findAll({ where: { userId } })

        if( ! launches || ! launches.length ) {
            return []
        }

        return launches.map(launch => launch.dataValues.launchId)
            .filter(launch => !!launch)
    }
}

module.exports = UserAPI
