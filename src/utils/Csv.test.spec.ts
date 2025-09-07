import { Csv } from './Csv'
import { File } from './File'

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
}

describe('CSV', () => {
    it('createTempCSVFileFromString', async () => {
        const { filePath, dirPath } = await Csv.createTempCSVFileFromString(
            'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com'
        )
        await File.unlink(filePath, dirPath)
        expect(filePath).toBeDefined()
    })

    it('parseCsvFile', async () => {
        const first_name = faker.person.firstName()
        const last_name = faker.person.lastName()
        const email = faker.internet.email({
            firstName: first_name,
            lastName: last_name,
        })

        const { csv_file, filePath, dirPath } = await Csv.createTempCSVFileFromString(
            `first_name,last_name,email\n${first_name},${last_name},${email}`
        )

        const result = await Csv.parseCsvFile(csv_file)
        await File.unlink(filePath, dirPath)
        expect(result).toBeDefined()
        expect(result[0]).toBeDefined()
        expect(result[0].first_name).toEqual(first_name)
    })

    it('parseCsvFile with headers', async () => {
        const { csv_file, filePath, dirPath } = await Csv.createTempCSVFileFromString(
            'name,type' + '\n' + 'Tom,Cat' + '\n' + 'Jerry,Mouse'
        )

        const result = await Csv.parseCsvFile(csv_file, { type: 'animal' })
        await File.unlink(filePath, dirPath)

        expect(result).toBeDefined()
        expect(result[0]).toBeDefined()
        expect(result[0].name).toBeDefined()
        expect(result[0].type).not.toBeDefined()
        expect(result[0].animal).toBeDefined()
        expect(result[0].animal).toBe('Cat')
        expect(result[1]).toBeDefined()
        expect(result[0].name).toBeDefined()
        expect(result[1].type).not.toBeDefined()
        expect(result[1].animal).toBeDefined()
        expect(result[1].animal).toBe('Mouse')
    })
})
