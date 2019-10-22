const resolvers = require('../resolvers')

const mockedMission = {
    name: 'foo',
    missionPatchLarge: 'LG',
    missionPatchSmall: 'SM'
}

describe('[Mission.missionPatch]', () => {

    it('chooses the right sized patch', () => {
        const { missionPatch } = resolvers.Mission
        
        const defaultSize = missionPatch( mockedMission )
        const smallSize = missionPatch( mockedMission, { size: 'SMALL' } )
        const largeSize = missionPatch( mockedMission, { size: 'LARGE' } )

        expect( defaultSize ).toEqual( 'LG' )
        expect( smallSize ).toEqual( 'SM' )
        expect( largeSize ).toEqual( 'LG' )
    })

})
