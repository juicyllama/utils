import axios, { AxiosError, InternalAxiosRequestConfig, RawAxiosRequestConfig } from 'axios'

import { Logger } from './Logger'

const logger = new Logger()

export class Api {
    /**
     * Performs the get command when expecting an object response
     *
     * @param {string} domain
     * @param {string} url
     * @param {RawAxiosRequestConfig} [config]
     * @param {string} [uuid]
     * @param {any} [interceptor]
     * @return object
     */

    async get<T>(
        domain: string,
        url: string,
        config?: RawAxiosRequestConfig,
        uuid?: string,
        interceptor?: (
            value: InternalAxiosRequestConfig
        ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
    ): Promise<T> {
        config ??= this.defaultConfig()

        try {
            logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (GET): ${url}`)

            let response
            if (interceptor) {
                const client = axios.create()
                client.interceptors.request.use(interceptor)
                response = await client.get<T>(url, config)
            } else {
                response = await axios.get<T>(url, config)
            }

            const responseLength = Array.isArray(response.data) ? response.data.length : 1
            logger.debug(
                `[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status.toString()} length=${responseLength.toString()}`
            )
            logger.verbose(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response data`, response.data)

            return response.data
        } catch (e) {
            return this.processError(e, 'GET', url, domain, config, undefined, uuid)
        }
    }

    /**
     * Performs the post command when expecting an object response
     *
     * @param {string} domain
     * @param {string} url
     * @param {object} [data]
     * @param {RawAxiosRequestConfig} [config]
     * @param {string} [uuid]
     * @return object
     */

    async post<T>(
        domain: string,
        url: string,
        data?: object,
        config?: RawAxiosRequestConfig,
        uuid?: string
    ): Promise<T> {
        config ??= this.defaultConfig()

        try {
            logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Request (POST): ${url}`, data)
            const response = await axios.post<T>(url, data, config)
            logger.debug(
                `[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status.toString()}`,
                response.data
            )
            return response.data
        } catch (e) {
            return this.processError(e, 'POST', url, domain, config, data, uuid)
        }
    }

    /**
     * Performs the patch command when expecting an object response
     *
     * @param {string} domain
     * @param {string} url
     * @param {object} [data]
     * @param {RawAxiosRequestConfig} [config]
     * @param {string} [uuid]
     * @return object
     */

    async patch<T>(
        domain: string,
        url: string,
        data?: object,
        config?: RawAxiosRequestConfig,
        uuid?: string
    ): Promise<T> {
        config ??= this.defaultConfig()

        try {
            logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (PATCH): ${url}`, data)
            const response = await axios.patch<T>(url, data, config)
            logger.debug(
                `[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status.toString()}`,
                response.data
            )
            return response.data
        } catch (e) {
            return this.processError(e, 'PATCH', url, domain, config, data, uuid)
        }
    }

    /**
     * Performs the put command when expecting an object response
     *
     * @param {string} domain
     * @param {string} url
     * @param {object} [data]
     * @param {RawAxiosRequestConfig} [config]
     * @param {string} [uuid]
     * @return object
     */

    async put<T>(
        domain: string,
        url: string,
        data?: object,
        config?: RawAxiosRequestConfig,
        uuid?: string
    ): Promise<T> {
        config ??= this.defaultConfig()
        try {
            logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (PUT): ${url}`, data)
            const response = await axios.put<T>(url, data, config)
            logger.debug(
                `[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status.toString()}`,
                response.data
            )
            return response.data
        } catch (e) {
            return this.processError(e, 'PUT', url, domain, config, data, uuid)
        }
    }

    /**
     * Performs the get command when expecting an object response
     *
     * @param {string} domain
     * @param {string} url
     * @param {RawAxiosRequestConfig} [config]
     * @param {string} [uuid]
     * @return object
     */

    async delete(domain: string, url: string, config?: RawAxiosRequestConfig, uuid?: string): Promise<boolean> {
        config ??= this.defaultConfig()

        try {
            logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (DELETE): ${url}`)
            const response = await axios.delete(url, config)
            logger.debug(
                `[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status.toString()}`,
                response.data
            )
            return true
        } catch (e) {
            this.processError(e, 'DELETE', url, domain, config, undefined, uuid)
            return false
        }
    }

    defaultConfig(): RawAxiosRequestConfig {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json',
            },
        }
    }

    processError(
        e: unknown,
        method: string,
        url: string,
        domain?: string,
        config?: RawAxiosRequestConfig,
        data?: object,
        uuid?: string
    ): never {
        let message
        const debug: {
            request: {
                method: string
                url: string
                config: RawAxiosRequestConfig | null
                data: object | null
            }
            response?: {
                status?: number
                data?: unknown
            }
            error: {
                status?: number
                message: string
                stack?: string
            }
        } = {
            request: {
                method: method,
                url: url,
                config: config ?? null,
                data: data ?? null,
            },
            error: {
                message: '',
            },
        }

        if (axios.isAxiosError(e)) {
            const axiosError = e as AxiosError
            message = `[${domain ?? ''}]${uuid ? '[' + uuid + ']' : ''} Error (${
                axiosError.response?.status.toString() ?? 'Unknown'
            }): ${axiosError.message}`
            debug.response = {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
            }
            debug.error.status = axiosError.status
            debug.error.message = axiosError.message
            debug.error.stack = axiosError.stack
        } else if (e instanceof Error) {
            message = `[${domain ?? ''}]${uuid ? '[' + uuid + ']' : ''} Error: ${e.message}`
            debug.error.message = e.message
            debug.error.stack = e.stack
        } else {
            message = `[${domain ?? ''}]${uuid ? '[' + uuid + ']' : ''} An unknown error occurred`
            debug.error.message = 'An unknown error occurred'
        }

        logger.warn(message, debug)
        throw new Error(message)
    }
}
