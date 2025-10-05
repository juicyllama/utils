import { Logger } from './Logger'

describe('Logger', () => {
    let logger: Logger
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        logger = new Logger()
        // Mock console methods to capture output
        consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(console, 'warn').mockImplementation()
        jest.spyOn(console, 'debug').mockImplementation()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('String Messages', () => {
        it('should log a basic string message', () => {
            logger.log('Test message')
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'))
        })

        it('should handle string messages with parameters', () => {
            logger.log('Hello {0}, welcome to {1}!', 'John', 'our app')
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Hello John, welcome to our app!'))
        })
    })

    describe('Non-String Messages', () => {
        it('should handle number messages', () => {
            logger.log(42)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('42'))
        })

        it('should handle boolean messages', () => {
            logger.log(true)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('true'))
        })

        it('should handle object messages', () => {
            const obj = { name: 'test', value: 123 }
            logger.log(obj)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[object Object]'))
        })

        it('should handle null messages', () => {
            logger.log(null)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('null'))
        })

        it('should handle undefined messages', () => {
            logger.log(undefined)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('undefined'))
        })

        it('should handle array messages', () => {
            logger.log([1, 2, 3])
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('1,2,3'))
        })
    })

    describe('Parameter Replacement', () => {
        it('should replace string parameters', () => {
            logger.log('Message: {0}', 'Hello World')
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Message: Hello World'))
        })

        it('should replace number parameters', () => {
            logger.log('Count: {0}', 42)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Count: 42'))
        })

        it('should replace boolean parameters', () => {
            logger.log('Status: {0}', true)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Status: true'))
        })

        it('should replace object parameters with JSON', () => {
            const obj = { key: 'value' }
            logger.log('Data: {0}', obj)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Data: {"key":"value"}'))
        })

        it('should replace null parameters', () => {
            logger.log('Value: {0}', null)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Value: null'))
        })

        it('should replace undefined parameters', () => {
            logger.log('Value: {0}', undefined)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Value: undefined'))
        })

        it('should handle multiple parameters', () => {
            logger.log('User {0} has {1} points and status {2}', 'John', 100, true)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('User John has 100 points and status true'))
        })
    })

    describe('Log Levels', () => {
        beforeEach(() => {
            // Set LOG_LEVEL to 1 (verbose) to test all levels
            process.env.LOG_LEVEL = '1'
        })

        afterEach(() => {
            delete process.env.LOG_LEVEL
        })

        it('should call console.error for error messages', () => {
            const errorSpy = jest.spyOn(console, 'error')
            logger.error('Error message')
            expect(errorSpy).toHaveBeenCalled()
        })

        it('should call console.warn for warning messages', () => {
            const warnSpy = jest.spyOn(console, 'warn')
            logger.warn('Warning message')
            expect(warnSpy).toHaveBeenCalled()
        })

        it('should call console.log for log messages', () => {
            logger.log('Log message')
            expect(consoleSpy).toHaveBeenCalled()
        })

        it('should call console.debug for debug messages', () => {
            const debugSpy = jest.spyOn(console, 'debug')
            logger.debug('Debug message')
            expect(debugSpy).toHaveBeenCalled()
        })

        it('should call console.debug for verbose messages', () => {
            const debugSpy = jest.spyOn(console, 'debug')
            logger.verbose('Verbose message')
            expect(debugSpy).toHaveBeenCalled()
        })
    })

    describe('Color Formatting', () => {
        it('should add red color codes for error messages', () => {
            const errorSpy = jest.spyOn(console, 'error')
            logger.error('Error message')
            expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('\x1b[31m'))
            expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('\x1b[0m'))
        })

        it('should add yellow color codes for warning messages', () => {
            const warnSpy = jest.spyOn(console, 'warn')
            logger.warn('Warning message')
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('\x1b[33m'))
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('\x1b[0m'))
        })

        it('should add green color codes for log messages', () => {
            logger.log('Log message')
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('\x1b[32m'))
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('\x1b[0m'))
        })
    })

    describe('Data Method', () => {
        it('should format key-value pairs correctly', () => {
            const verboseSpy = jest.spyOn(logger, 'verbose')
            logger.data('testKey', 'testValue')
            expect(verboseSpy).toHaveBeenCalledWith('[testKey]=>"testValue"')
        })

        it('should handle object values', () => {
            const verboseSpy = jest.spyOn(logger, 'verbose')
            const obj = { nested: 'value' }
            logger.data('objectKey', obj)
            expect(verboseSpy).toHaveBeenCalledWith('[objectKey]=>{"nested":"value"}')
        })
    })

    describe('Table Method', () => {
        it('should call console.table in development environment', () => {
            const originalEnv = process.env.NODE_ENV
            process.env.NODE_ENV = 'development'

            const tableSpy = jest.spyOn(console, 'table').mockImplementation()
            const testData = [{ name: 'John', age: 30 }]

            logger.table(testData)
            expect(tableSpy).toHaveBeenCalledWith(testData)

            process.env.NODE_ENV = originalEnv
            tableSpy.mockRestore()
        })
    })

    describe('Edge Cases', () => {
        it('should not throw error when message.replace is called on non-string', () => {
            // This test specifically addresses the original error
            expect(() => {
                logger.log(123, 'param1', 'param2')
            }).not.toThrow()
        })

        it('should handle function parameters', () => {
            const testFunction = () => 'test'
            logger.log('Function: {0}', testFunction)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Function: () => 'test'"))
        })

        it('should handle symbol parameters', () => {
            const testSymbol = Symbol('test')
            logger.log('Symbol: {0}', testSymbol)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Symbol: Symbol(test)'))
        })

        it('should handle bigint parameters', () => {
            const testBigInt = BigInt(123456789012345678901234567890n)
            logger.log('BigInt: {0}', testBigInt)
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('BigInt: 123456789012345678901234567890'))
        })
    })
})
