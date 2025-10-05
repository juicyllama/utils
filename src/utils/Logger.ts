import { Env } from './Env'

const DEFAULT_LOG_LEVEL = 3

export class Logger {
    data(key: string, value: unknown): void {
        this.verbose(`[${key}]=>${JSON.stringify(value)}`)
    }

    error(message: unknown, ...optionalParams: unknown[]): void {
        let colored = `\x1b[31m`
        let messageStr = typeof message === 'string' ? message : String(message)
        if (optionalParams.length > 0) {
            messageStr = this.processParams(messageStr, optionalParams)
        }
        colored += `${messageStr}\x1b[0m`

        if (this.getLogLevel() <= 5) {
            console.error(colored)
        }
    }

    warn(message: unknown, ...optionalParams: unknown[]): void {
        let colored = `\x1b[33m`
        let messageStr = typeof message === 'string' ? message : String(message)
        if (optionalParams.length > 0) {
            messageStr = this.processParams(messageStr, optionalParams)
        }
        colored += `${messageStr}\x1b[0m`

        if (this.getLogLevel() <= 4) {
            console.warn(colored)
        }
    }

    log(message: unknown, ...optionalParams: unknown[]): void {
        let colored = `\x1b[32m`
        let messageStr = typeof message === 'string' ? message : String(message)
        if (optionalParams.length > 0) {
            messageStr = this.processParams(messageStr, optionalParams)
        }
        colored += `${messageStr}\x1b[0m`

        if (this.getLogLevel() <= 3) {
            console.log(colored)
        }
    }

    debug(message: unknown, ...optionalParams: unknown[]): void {
        let colored = `\x1b[35m`
        let messageStr = typeof message === 'string' ? message : String(message)
        if (optionalParams.length > 0) {
            messageStr = this.processParams(messageStr, optionalParams)
        }
        colored += `${messageStr}\x1b[0m`

        if (this.getLogLevel() <= 2) {
            console.debug(colored)
        }
    }

    verbose(message: unknown, ...optionalParams: unknown[]): void {
        let colored = `\x1b[36m`
        let messageStr = typeof message === 'string' ? message : String(message)
        if (optionalParams.length > 0) {
            messageStr = this.processParams(messageStr, optionalParams)
        }
        colored += `${messageStr}\x1b[0m`

        if (this.getLogLevel() <= 1) {
            console.debug(colored)
        }
    }

    status(): void {
        this.log(`--------- Logging Status ---------`)
        this.log(`LOG_LEVEL=${this.getLogLevel()}`)
        this.error(`This is an error`)
        this.warn(`This is a warning`)
        this.log(`This is a log`)
        this.debug(`This is a debug`)
        this.verbose(`This is a verbose`)
        this.log(`------- Logging Status End -------`)
    }

    table(data: unknown): void {
        if (Env.IsDev()) {
            console.table(data)
        }
    }
    private getLogLevel(): number {
        return process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : DEFAULT_LOG_LEVEL
    }

    private processParams(message: string, optionalParams: unknown[]): string {
        optionalParams.forEach((param, index) => {
            if (typeof param === 'string') {
                message = message.replace(`{${index}}`, param)
            } else if (
                typeof param === 'number' ||
                typeof param === 'boolean' ||
                typeof param === 'bigint' ||
                typeof param === 'symbol' ||
                typeof param === 'function'
            ) {
                message = message.replace(`{${index}}`, String(param))
            } else if (typeof param === 'object' && param !== null) {
                message = message.replace(`{${index}}`, JSON.stringify(param))
            } else if (param === null) {
                message = message.replace(`{${index}}`, 'null')
            } else if (param === undefined) {
                message = message.replace(`{${index}}`, 'undefined')
            }
        })
        return message
    }
}
