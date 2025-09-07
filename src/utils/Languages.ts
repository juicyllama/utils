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
            const logger = new Logger()
            logger.error(`[Utils::Languages::getLanguage] ${(e as Error).message}`, (e as Error).stack)
            return
        }
    }
}
