import { Dates } from './Dates'

describe('Dates', () => {
    describe('Now', () => {
        it('Now', () => {
            const now = Dates.now()
            expect(now).toBeInstanceOf(Date)
            expect(now.getTime()).toBeLessThanOrEqual(Date.now())
        })
    })

    describe('Format', () => {
        it('YYYY-MM-DD', () => {
            const format = Dates.format(new Date('2020-01-01'), 'YYYY-MM-DD')
            expect(format).toEqual('2020-01-01')
        })

        it('YYYY-MM-DD HH:mm:ss', () => {
            const format = Dates.format(new Date('2020-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss')
            expect(format).toEqual('2020-01-01 00:00:00')
        })

        it('MMM DDDo YYYY', () => {
            const format = Dates.format(new Date('2020-01-01'), 'MMM Do YYYY')
            expect(format).toEqual('Jan 1st 2020')
        })

        it('ISO', () => {
            const format = Dates.format(new Date('2020-01-01'), 'iso')
            expect(format).toEqual('2020-01-01T00:00:00.000Z')
        })
    })

    describe('Mins Ago', () => {
        it('5 Mins Ago', () => {
            const ago = Dates.minutesAgo(5)
            const now = new Date()
            expect(Dates.format(ago, 'datetime')).toEqual(Dates.format(new Date(now.getTime() - 5 * 60000), 'datetime'))
        })
    })

    describe('Ahead', () => {
        it('0.25 seconds', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 0.25)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('1 second')
        })

        it('30 seconds', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 30)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('30 seconds')
        })

        it('1 minute', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 60)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('1 minute')
        })

        it('5 minutes', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 60 * 5)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('5.00 minutes')
        })

        it('1 hour', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 3600)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('1 hour')
        })

        it('2 hours', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 3600 * 2)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('2.00 hours')
        })

        it('2 1/2 hours', () => {
            const future = new Date()
            future.setSeconds(future.getSeconds() + 3600 * 2.5)
            const ahead = Dates.ahead(future)
            expect(ahead).toEqual('2.50 hours')
        })
    })

    describe('Diff', () => {
        it('0.25 seconds', () => {
            const start = new Date('2020-01-01T00:00:00.000Z')
            const end = new Date('2020-01-01T00:00:00.250Z')
            const diff = Dates.diff(start, end)
            expect(diff).toEqual('1 second')
        })

        it('30 seconds', () => {
            const start = new Date('2020-01-01T00:00:00.000Z')
            const end = new Date('2020-01-01T00:00:30.000Z')
            const diff = Dates.diff(start, end)
            expect(diff).toEqual('30 seconds')
        })

        it('1 minute', () => {
            const start = new Date('2020-01-01T00:00:00.000Z')
            const end = new Date('2020-01-01T00:01:00.000Z')
            const diff = Dates.diff(start, end)
            expect(diff).toEqual('1 minute')
        })

        it('5 minutes', () => {
            const start = new Date('2020-01-01T00:00:00.000Z')
            const end = new Date('2020-01-01T00:05:00.000Z')
            const diff = Dates.diff(start, end)
            expect(diff).toEqual('5.00 minutes')
        })

        it('2 hours', () => {
            const start = new Date('2020-01-01T00:00:00.000Z')
            const end = new Date('2020-01-01T02:00:00.000Z')
            const diff = Dates.diff(start, end)
            expect(diff).toEqual('2.00 hours')
        })
    })
})
