import { Errors } from './Errors'

type ErrorCtor = new (message?: string) => Error

const loadNestException = (name: string): ErrorCtor => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nest = require('@nestjs/common') as Record<string, unknown>
        const maybeCtor = nest[name]
        if (typeof maybeCtor === 'function') {
            return maybeCtor as ErrorCtor
        }
    } catch {
        // If NestJS isn't installed, fall back to a minimal Error subclass.
    }

    return class extends Error {
        constructor(message?: string) {
            super(message)
            this.name = name
        }
    }
}

const BadRequestException = loadNestException('BadRequestException')
const ConflictException = loadNestException('ConflictException')

describe('Errors', () => {
    it('returns an existing Error instance', async () => {
        const error = new Error('boom')
        const result = Errors.format(error)
        expect(result).toBe(error)
    })

    it('returns an existing Error subclass instance', async () => {
        const error = new TypeError('bad type')
        const result = Errors.format(error)
        expect(result).toBe(error)
    })

    it('wraps string errors', async () => {
        const result = Errors.format('nope')
        expect(result).toBeInstanceOf(Error)
        expect(result.message).toEqual('nope')
    })

    it('handles NestJS exceptions', async () => {
        const badRequest = new BadRequestException('bad request')
        const conflict = new ConflictException('conflict')

        const badRequestResult = Errors.format(badRequest)
        const conflictResult = Errors.format(conflict)

        expect(badRequestResult).toBe(badRequest)
        expect(conflictResult).toBe(conflict)
    })

    it('falls back to Unknown error for non-error values', async () => {
        const values = [null, undefined, 0, 42, true, false, {}, [], () => 'x', new Date(), Symbol('oops')]

        values.forEach(value => {
            const result = Errors.format(value)
            expect(result).toBeInstanceOf(Error)
            expect(result.message).toEqual('Unknown error')
        })
    })
})
