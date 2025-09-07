import FACTS from '../assets/llama.facts.json'
import { Strings } from './Strings'

// Simple mock for faker
const faker = {
    person: {
        firstName: () => 'John',
        lastName: () => 'Doe',
    },
    internet: {
        email: ({ firstName, lastName }: { firstName: string; lastName: string }) =>
            `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    },
    datatype: {
        number: (options?: { min?: number; max?: number }) => {
            const min = options?.min ?? 0
            const max = options?.max ?? 100
            return Math.floor(Math.random() * (max - min + 1)) + min
        },
    },
    lorem: {
        words: (count = 3) => {
            const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']
            return Array.from({ length: count }, () => words[Math.floor(Math.random() * words.length)]).join(' ')
        },
    },
    word: {
        sample: () => 'sample',
        noun: () => 'noun',
        adjective: () => 'adjective',
        adverb: () => 'adverb',
    },
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    LOWERCASE = 'abcdefghijklmnopqrstuvwxyz',
    NUMBERS = '0123456789',
    SYMBOLS = '!@£$%^&*()_+=-{}[]<>?:;~'

export class Random {
    static LlamaFact(): string {
        return FACTS[Math.floor(Math.random() * FACTS.length)]
    }

    static get uppercase() {
        return UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]
    }

    static get lowercase() {
        return LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]
    }

    static get number() {
        return NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
    }

    static get symbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    }

    static Number(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min)
    }

    static String(length?: number): string {
        length ??= Math.floor(Math.random() * 8) + 5

        let result = ''

        for (let i = 0; i < length; i++) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    result += this.uppercase
                    break
                case 1:
                    result += this.lowercase
                    break
                case 2:
                    result += this.number
                    break
            }
        }
        return result
    }

    static Password(length?: number): string {
        length ??= 16

        let result = ''

        //string must contain uppercase, lowercase, number and special characters

        const quotient = Math.floor(length / 4)
        const remainder = 4 % length

        for (let l = 0; l < 4; l++) {
            for (let i = 0; i < quotient; i++) {
                switch (l) {
                    case 0:
                        result += this.uppercase
                        break
                    case 1:
                        result += this.lowercase
                        break
                    case 2:
                        result += this.number
                        break
                    case 3:
                        result += this.symbol
                        break
                }
            }
        }

        result += this.String(remainder)
        return Strings.randomize(result)
    }

    static Words(
        seperator?: string,
        length?: number,
        type?: 'noun' | 'adjective' | 'adverb',
        transform?: 'capitalize'
    ): string {
        seperator ??= ' '
        length ??= Math.floor(Math.random() * 5) + 1

        let result = ''

        for (let i = 0; i < length; i++) {
            let word = ''

            if (!type) {
                word = faker.word.sample()
            } else {
                switch (type) {
                    case 'noun':
                        word = faker.word.noun()
                        break
                    case 'adjective':
                        word = faker.word.adjective()
                        break
                    case 'adverb':
                        word = faker.word.adverb()
                        break
                }
            }

            if (transform === 'capitalize') {
                result += Strings.capitalize(word)
            } else {
                result += word
            }

            if (i < length - 1) {
                result += seperator
            }
        }

        return result
    }
}
