import { createHash } from 'crypto'
import * as jwt from 'jwt-simple'

import { Environment, fromStringToEnv } from '../enums/env'

const secret = process.env['JWT-SIMPLE-SECRET'] ?? 'JL@S7uD*0Su3rS$cr3t'

export class Security {
    static hashPassword(password: string): string {
        if (!password) {
            throw new Error('Password is empty')
        }

        if (password.length === 128) {
            return password
        }

        return createHash('sha512').update(password).digest('hex')
    }

    /**
     * Compare referrers to ensure they match
     */

    static referrerCheck(referrer: string, domain: string): boolean {
        if (fromStringToEnv() === Environment.production) {
            if (!referrer) {
                throw new Error('Unauthorized')
            }

            const referrer_url = new URL(referrer)
            if (referrer_url.origin !== domain) {
                throw new Error('Unauthorized')
            }
        }

        return true
    }

    /** encode JSON to JWT using a global secret */
    static encode(data: object): string {
        return jwt.encode(data, secret)
    }

    /** decode JWT using a global secret  */
    static decode(token: string): object {
        return jwt.decode(token, secret) as object
    }
}
