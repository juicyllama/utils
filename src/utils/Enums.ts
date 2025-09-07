export class Enums {
    /**
     * Get an enum key based on it's value
     */

    static getKeyName(anEnum: object, value: string | number): string {
        return Object.keys(anEnum)[Object.values(anEnum).indexOf(value)]
    }

    static toArray(Enum: object, key_name: string, pair_name: string): Record<string, string | number>[] {
        if (Object.keys(Enum).length === 0) {
            return []
        }

        const arr: Record<string, string | number>[] = []
        Object.keys(Enum).forEach(key => {
            arr.push({
                [key_name]: key,
                [pair_name]: (Enum as Record<string, string | number>)[key],
            })
        })

        if (Object.keys(Enum)[0] === Object.values(Enum)[0]) {
            return arr
        }

        return arr.slice(arr.length / 2)
    }
}
