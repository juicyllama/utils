import { Readable } from 'stream'

import { File } from './File'

export class Json {
    /**
     * Converts the json file into a valid json object
     * @param file
     * @returns json object
     */

    static async parseJsonFile(
        file: Express.Multer.File,
        mappers: Record<string, string> = {}
    ): Promise<Record<string, unknown>[]> {
        return new Promise((resolve, reject) => {
            const results: Record<string, unknown>[] = []
            const stream = Readable.from(file.buffer)

            stream
                .on('data', (data: string) => results.push(...(JSON.parse(data) as Record<string, unknown>[])))
                .on('end', () => {
                    resolve(this.changeKeyValues(mappers, results))
                })
                .on('error', error => {
                    reject(error)
                })
        })
    }

    /**
     * Create a temporary json file from a string, useful for testing
     * @param content string
     * @returns void
     */

    static async createTempJSONFileFromString(content: string): Promise<{
        filePath: string
        json_file: Express.Multer.File
        dirPath: string
    }> {
        const result = await File.createTempFileFromString({
            fileName: 'temp-file.json',
            content: content,
            mimetype: 'application/json',
        })

        return {
            filePath: result.filePath,
            json_file: result.file,
            dirPath: result.dirPath,
        }
    }

    /**
     * Change the key values of an object
     * @param mappers object
     * @param results object
     * @returns object
     */

    static changeKeyValues(
        mappers: Record<string, string>,
        results: Record<string, unknown>[]
    ): Record<string, unknown>[] {
        if (Object.keys(mappers).length > 0) {
            return results.map((result: Record<string, unknown>) => {
                const newResult: Record<string, unknown> = {}
                for (const key in result) {
                    if (mappers[key]) {
                        newResult[mappers[key]] = result[key]
                    } else {
                        newResult[key] = result[key]
                    }
                }
                return newResult
            })
        }
        return results
    }

    static getLocalStorageObject(store_key: string): unknown {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return null
            }
            const item = window.localStorage.getItem(store_key)
            if (item === null) {
                return null
            }
            return JSON.parse(item)
        } catch {
            return null
        }
    }
}
