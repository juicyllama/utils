export class Locale {
    getLocale(): string {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return process.env.DEFAULT_LOCALE ?? process.env.VITE_DEFAULT_LOCALE ?? 'en-US'
        }

        const nav = window.navigator

        // support for HTML 5.1 "navigator.languages"
        if (Array.isArray(nav.languages)) {
            for (const language of nav.languages) {
                if (typeof language === 'string' && language.length > 2) {
                    return language
                }
            }
        }

        // support for other well known properties in browsers
        if ('language' in nav && nav.language && typeof nav.language === 'string') {
            return nav.language
        }

        if ('browserLanguage' in nav && typeof nav.browserLanguage === 'string') {
            return nav.browserLanguage
        }

        if ('systemLanguage' in nav && typeof nav.systemLanguage === 'string') {
            return nav.systemLanguage
        }

        if ('userLanguage' in nav && typeof nav.userLanguage === 'string') {
            return nav.userLanguage
        }

        return process.env.DEFAULT_LOCALE ?? process.env.VITE_DEFAULT_LOCALE ?? 'en-US'
    }

    getCountry(): string {
        const locale = new Locale()
        const localeString = locale.getLocale()
        if (localeString.includes('-')) {
            return localeString.split('-')[1]
        }
        return ''
    }

    getLanguage(): string {
        const locale = new Locale()
        const localeString = locale.getLocale()
        if (localeString.includes('-')) {
            return localeString.split('-')[0]
        }
        return localeString
    }
}
