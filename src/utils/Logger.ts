import { Api } from './Api'
import { Dates } from './Dates'
import { Env } from './Env'

const DEFAULT_LOG_LEVEL = 3

export class Logger {
    private context: string | string[] | undefined

    constructor(context?: string | string[]) {
        this.context = context
    }

    /**
     * @deprecated The method should not be used, pass values as parameters instead
     */
    data(key: string, value: unknown): void {
        this.verbose(`[${key}]=>${JSON.stringify(value)}`)
    }

    error(
        message: unknown,
        opts?: {
            params?: unknown | unknown[]
            context?: string | string[]
        }
    ): void {
        this.send(5, '\x1b[31m', message, opts) // red message
    }

    warn(
        message: unknown,
        opts?: {
            params?: unknown | unknown[]
            context?: string | string[]
        }
    ): void {
        this.send(4, '\x1b[33m', message, opts) // yellow message
    }

    log(
        message: unknown,
        opts?: {
            params?: unknown | unknown[]
            context?: string | string[]
        }
    ): void {
        this.send(3, '\x1b[32m', message, opts) // green message
    }

    debug(
        message: unknown,
        opts?: {
            params?: unknown | unknown[]
            context?: string | string[]
        }
    ): void {
        this.send(2, '\x1b[35m', message, opts) // magenta message
    }

    verbose(
        message: unknown,
        opts?: {
            params?: unknown | unknown[]
            context?: string | string[]
        }
    ): void {
        this.send(1, '\x1b[36m', message, opts) // cyan message
    }

    status(): void {
        this.log(`--------- Logging Status ---------`)
        this.log(`LOG_LEVEL=${this.getLogLevel()}`)
        this.error(`This is an error`)
        this.warn(`This is a warning`)
        this.log(`This is a log`)
        this.debug(`This is a debug`)
        this.verbose(`This is a verbose`)
        if (process.env.GRAFANA_BEARER_TOKEN) {
            this.log(`Grafana logging is ENABLED with service name: ${process.env.GRAFANA_SERVICE_NAME}`)
        }
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

    private getLogName(level: number): string {
        switch (level) {
            case 1:
                return 'VERBOSE'
            case 2:
                return 'DEBUG'
            case 3:
                return 'LOG'
            case 4:
                return 'WARN'
            case 5:
                return 'ERROR'
            default:
                return 'LOG'
        }
    }

    private send(
        logLevel: number,
        color: string,
        message: unknown,
        opts?: {
            params?: unknown | unknown[] | undefined
            context?: string | string[] | undefined
        }
    ): void {
        let output = ''

        if (this.context) {
            if (Array.isArray(this.context)) {
                output += `\x1b[33m[${this.context.join('][')}]\x1b[0m` // yellow context
            } else {
                output += `\x1b[33m[${this.context}]\x1b[0m ` // yellow context
            }
        }

        if (opts?.context) {
            if (Array.isArray(opts.context)) {
                output += `\x1b[36m[${opts.context.join('][')}]\x1b[0m`
            } else {
                output += `\x1b[36m[${opts.context}]\x1b[0m `
            }
        }

        output += ` ${color}${message}\x1b[0m` // colored message

        if (this.getLogLevel() > logLevel) {
            return
        }

        if (opts?.params === undefined) {
            console.log(output)
        } else {
            console.log(output, opts.params)
        }

        if (process.env.GRAFANA_BEARER_TOKEN && process.env.GRAFANA_SERVICE_NAME) {
            // Send logs to Grafana
            try {
                const contextArray: string[] = []
                if (this.context) {
                    if (Array.isArray(this.context)) {
                        contextArray.push(...this.context)
                    } else {
                        contextArray.push(this.context)
                    }
                }
                if (opts?.context) {
                    if (Array.isArray(opts.context)) {
                        contextArray.push(...opts.context)
                    } else {
                        contextArray.push(opts.context)
                    }
                }

                const timestamp = Dates.utc().getTime() * 1e6 // nanoseconds
                const logLine = {
                    streams: [
                        {
                            stream: {
                                level: this.getLogName(logLevel),
                                context: contextArray.length > 0 ? contextArray.join('.') : 'default',
                                service: process.env.GRAFANA_SERVICE_NAME,
                            },
                            values: [
                                [timestamp.toString(), typeof message === 'string' ? message : JSON.stringify(message)],
                            ],
                        },
                    ],
                }

                const api = new Api()
                api.post<unknown>(
                    'GrafanaLoki',
                    `${process.env.GRAFANA_HOST}/loki/api/v1/push`,
                    logLine,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${process.env.GRAFANA_BEARER_TOKEN}`,
                        },
                    },
                    undefined,
                    true // skipDebugLog
                )

                if (this.getLogLevel() <= 1) {
                    console.log('[Grafana] log queued')
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e)
                console.error(`Failed to send log to Grafana: ${errorMessage}`)
            }
        }

        return

        //TODO support sentry
    }
}
