import { Strings } from './Strings'

describe('Strings', () => {
    it('replacer', async () => {
        const result = Strings.replacer('My name is ${name.toUpperCase()}', {
            name: 'Bob',
        })
        expect(result).toEqual('My name is BOB')
    })

    it('capitalize', async () => {
        const result = Strings.capitalize('hello frank')
        expect(result).toEqual('Hello frank')
    })

    it('plural', async () => {
        const result = Strings.plural('account')
        expect(result).toEqual('accounts')
    })

    it('singular', async () => {
        const result = Strings.singular('accounts')
        expect(result).toEqual('account')
    })

    it.each([
        ['Hello World', 'hello-world'],
        ['  Hello   World  ', 'hello-world'],
        ["Bob's Burgers", 'bobs-burgers'],
        ['Crème Brûlée', 'creme-brulee'],
        ['100% real 🚀', '100-real'],
        ['already--slug__here', 'already-slug-here'],
        ['', ''],
    ])('slug: %s', async (input, expected) => {
        const result = Strings.slug(input)
        expect(result).toEqual(expected)
    })
})
