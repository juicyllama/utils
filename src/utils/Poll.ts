import axios, { AxiosRequestConfig } from 'axios'

import { Logger } from './Logger'

const logger = new Logger(['@juicyllama/utils', 'Poll'])

export class Poll {
    /**
     * Runs a poll request and returns the result once successful
     *
     * @param {function} validate
     * @param {string} url
     * @param {AxiosRequestConfig} config
     * @param {int} [interval] seconds defaults to 2000
     * @param {int} [max_attempts] number of attempts before exiting defaults to 10
     * @param {string} [domain]
     * @param {string} [uuid]
     * @return object
     */

    async url<T>(
        validate: (data: T) => boolean,
        url: string,
        config?: AxiosRequestConfig,
        interval = 2000,
        max_attempts = 10,
        domain?: string,
        uuid?: string
    ): Promise<T> {
        const context = ['url']
        if (domain) context.push(domain)
        if (uuid) context.push(uuid)

        const poll = () => {
            let attempts = 0
            const executePoll = async (resolve: (value: T) => void, reject: (reason?: string) => void) => {
                logger.debug(`#${String(attempts + 1)}`, {
                    context: context,
                    params: {
                        url,
                        interval: `${String(interval)}ms`,
                        max_attempts: max_attempts,
                        attempt: attempts + 1,
                    },
                })
                let result

                try {
                    result = await axios.get(url, config)
                } catch (e: unknown) {
                    const error = e as Error // Type assertion to specify the type of 'e' as 'Error'
                    logger.warn(`Error: ${error.message}`, {
                        context: context,
                        params: {
                            error: {
                                message: error.message,
                                stack: error.stack,
                            },
                        },
                    })
                }

                logger.debug(`#${String(attempts + 1)}: Response (${String(result?.status)})`, {
                    context: context,
                    params: {
                        attempt: attempts + 1,
                        result: result?.data,
                        validate: validate.toString(),
                    },
                })
                attempts++

                if (validate(result?.data as T)) {
                    resolve(result?.data as T)
                    return
                } else if (attempts === max_attempts) {
                    reject('Exceeded max attempts')
                    return
                } else {
                    setTimeout(() => executePoll(resolve, reject), interval)
                }
            }
            return new Promise(executePoll)
        }

        return poll()
            .then(result => {
                return result
            })
            .catch((error: unknown) => {
                throw new Error((error as Error).message)
            })
    }

    /**
     * Runs a poll request on a function
     *
     * @param {function} validate
     * @param {function} func
     * @param {int} [interval] seconds defaults to 2000
     * @param {int} [max_attempts] number of attempts before exiting defaults to 10
     * @param {string} [domain]
     * @param {string} [uuid]
     * @return object
     */

    async function<T>(
        validate: (data: T) => boolean,
        func: () => Promise<T>,
        interval = 2000,
        max_attempts = 10,
        domain?: string,
        uuid?: string
    ): Promise<T> {
        const context = ['function']
        if (domain) context.push(domain)
        if (uuid) context.push(uuid)

        const poll = () => {
            let attempts = 0
            const executePoll = async (resolve: (value: T) => void, reject: (reason?: string) => void) => {
                logger.debug(`#${String(attempts + 1)}`, {
                    context: context,
                    params: {
                        func: func.toString(),
                        interval: `${String(interval)}ms`,
                        max_attempts: max_attempts,
                    },
                })

                let result

                try {
                    result = await func()
                } catch (e: unknown) {
                    const error = e as Error // Type assertion to specify the type of 'e' as 'Error'
                    logger.warn(`POLL Error: ${error.message}`, {
                        context: context,
                        params: {
                            error: {
                                message: error.message,
                                stack: error.stack,
                            },
                        },
                    })
                }

                logger.debug(`POLL #${String(attempts + 1)}: Response`, {
                    context: context,
                    params: {
                        result: result,
                        validate: validate.toString(),
                    },
                })

                attempts++

                if (validate(result as T)) {
                    resolve(result as T)
                    return
                } else if (attempts === max_attempts) {
                    reject('Exceeded max attempts')
                    return
                } else {
                    setTimeout(() => executePoll(resolve, reject), interval)
                }
            }
            return new Promise(executePoll)
        }

        return poll()
            .then(result => {
                return result
            })
            .catch((e: unknown) => {
                const error = e as Error
                logger.warn(`POLL Error: ${error.message}`, {
                    context: context,
                    params: {
                        error: {
                            message: error.message,
                            stack: error.stack,
                        },
                    },
                })
                throw new Error(error.message)
            })
    }
}
