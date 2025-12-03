import { Env } from './Env'
import { Logger } from './Logger'

describe('Logger', () => {
    const originalEnv = { ...process.env }
    let logger: Logger
    let consoleLogSpy: jest.SpyInstance
    let consoleTableSpy: jest.SpyInstance

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'error').mockImplementation(() => {})
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        consoleTableSpy = jest.spyOn(console, 'table').mockImplementation(() => {})

        process.env = { ...originalEnv }
        delete process.env.LOG_LEVEL
        delete process.env.GRAFANA_BEARER_TOKEN
        delete process.env.GRAFANA_SERVICE_NAME
        delete process.env.GRAFANA_HOST

        logger = new Logger()
    })

    afterEach(() => {
        jest.restoreAllMocks()
        process.env = { ...originalEnv }
    })

    describe('log levels', () => {
        it('logs colored output when severity is allowed by the configured level', () => {
            logger.log('Test message')

            const [output, params] = consoleLogSpy.mock.calls[0]
            expect(output).toContain('Test message')
            expect(output).toContain('\x1b[32m')
            expect(output).toContain('\x1b[0m')
            expect(params).toBeUndefined()
        })

        it('skips entries when the severity is lower than the configured level', () => {
            process.env.LOG_LEVEL = '4'
            logger = new Logger()

            logger.debug('Hidden debug entry')
            expect(consoleLogSpy).not.toHaveBeenCalled()
        })
    })

    describe('contexts and params', () => {
        it('renders constructor context together with call context arrays', () => {
            const contextualLogger = new Logger(['Service', 'Worker'])

            contextualLogger.error('Failed request', { context: ['job', '42'] })

            const [output] = consoleLogSpy.mock.calls[0]
            expect(output).toContain('\x1b[33m[Service][Worker]\x1b[0m')
            expect(output).toContain('\x1b[36m[job][42]\x1b[0m')
            expect(output).toContain('\x1b[31mFailed request\x1b[0m')
        })

        it('passes params straight through to console.log', () => {
            const payload = { foo: 'bar' }
            logger.warn('Something happened', { params: ['user-123', payload] })

            const [, params] = consoleLogSpy.mock.calls[0]
            expect(params).toEqual(['user-123', payload])
        })

        it('applies per-call context strings when provided', () => {
            logger.log('User authenticated', { context: 'AuthController' })

            const [output] = consoleLogSpy.mock.calls[0]
            expect(output).toContain('\x1b[36m[AuthController]\x1b[0m')
        })
    })

    describe('helpers', () => {
        it('formats data entries using verbose()', () => {
            const verboseSpy = jest.spyOn(logger, 'verbose')
            logger.data('user', { id: 42 })

            expect(verboseSpy).toHaveBeenCalledWith('[user]=>{"id":42}')
        })

        it('shows sample output for every log level via status()', () => {
            process.env.LOG_LEVEL = '1'
            logger = new Logger('HealthCheck')

            logger.status()

            const messages = consoleLogSpy.mock.calls.map(call => call[0])
            expect(messages).toEqual(
                expect.arrayContaining([
                    expect.stringContaining('Logging Status'),
                    expect.stringContaining('LOG_LEVEL=1'),
                    expect.stringContaining('This is an error'),
                    expect.stringContaining('This is a warning'),
                    expect.stringContaining('This is a log'),
                    expect.stringContaining('This is a debug'),
                    expect.stringContaining('This is a verbose'),
                    expect.stringContaining('Logging Status End'),
                ])
            )
        })
    })

    describe('table output', () => {
        it('writes table output when running in development', () => {
            jest.spyOn(Env, 'IsDev').mockReturnValue(true)
            const tableData = [{ id: 1 }]

            logger.table(tableData)
            expect(consoleTableSpy).toHaveBeenCalledWith(tableData)
        })

        it('avoids console.table when outside of development', () => {
            jest.spyOn(Env, 'IsDev').mockReturnValue(false)

            logger.table([{ id: 1 }])
            expect(consoleTableSpy).not.toHaveBeenCalled()
        })
    })
})
