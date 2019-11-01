const resolvers = require('../resolvers')

const mockMission = {
    name: 'foo',
    missionPatchLarge: 'LG',
    missionPatchSmall: 'SM',
}

describe('[Mission.missionPatch]', () => {
    it('chooses the right sized patch',() => {
        
        const { missionPatch } = resolvers.Mission

        const defaultResponse = missionPatch(mockMission)
        expect( defaultResponse ).toEqual('LG')

        const smallResponse = missionPatch(mockMission, { size: 'SMALL' } )
        expect( smallResponse ).toEqual('SM')

        const largeResponse = missionPatch(mockMission, { size: 'LARGE' } )
        expect( largeResponse ).toEqual('LG')
    })
})

