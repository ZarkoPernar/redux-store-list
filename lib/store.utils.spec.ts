import { createTrackingFunction } from './store.utils'

const entity = {
    _id: 1,
}
let getEntityId
describe('createTrackingFunction', () => {
    beforeEach(() => {
        getEntityId = createTrackingFunction('_id')
    })

    it('creates a function', () => {
        expect(getEntityId).toBeInstanceOf(Function)
    })

    it('resulting function returns a string or a number', () => {
        expect(getEntityId(entity)).toBe(1)
    })
})
