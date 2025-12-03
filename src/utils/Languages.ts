import { isNil } from 'lodash'

import LANGUAGES from '../assets/languages.json'
import { Language } from '../types/languages'
import { Logger } from './Logger'

export class Languages {
    /**
     * get a language by ISO2 code
     * @param ISO2
     */

    static getLanguage(ISO2: string): Language | undefined {
        if (!ISO2 || isNil(ISO2)) return

        try {
            return LANGUAGES.find(language => language.code === ISO2.toLowerCase()) as Language
        } catch (e: unknown) {
            const logger = new Logger(['@juicyllama/utils', 'Languages'])
            logger.error((e as Error).message, {
                context: ['getLanguage', ISO2],
                params: {
                    error: e,
                },
            })
            return
        }
    }
}
