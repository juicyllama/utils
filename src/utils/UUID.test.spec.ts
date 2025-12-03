import { UUID } from './UUID'

describe('UUID', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('generates an RFC4122 v4 compliant string', () => {
        const value = UUID.v4()
        expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('uses Math.random driven entropy for each nibble', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0)

        const value = UUID.v4()

        expect(value).toBe('00000000-0000-4000-8000-000000000000')
        expect(randomSpy).toHaveBeenCalledTimes(31)
    })
})
