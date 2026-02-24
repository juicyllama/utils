<div align="center">
  <a href="https://juicyllama.com/" target="_blank">
    <img src="https://juicyllama.com/assets/images/icon.png" width="100" alt="JuicyLlama Logo" />
  </a>

  Visit the [JuicyLlama](https://juicyllama.com) to learn more.
</div>

# @juicyllama/utils

A collection of TypeScript utilities used across JuicyLlama projects. The package targets Node.js but several helpers also work in the browser where noted.

## Contents

- Overview
- Install
- Quick start
- Utilities
- Enums
- Types
- Assets
- Environment variables
- Development
- Testing
- Build

## Overview

This repo ships a single package that exports a set of small, focused utility classes and enums. The public API is defined in `src/index.ts`.

## Install

```bash
npm install @juicyllama/utils
```

```bash
yarn add @juicyllama/utils
```

```bash
pnpm add @juicyllama/utils
```

## Quick start

```ts
import { Api, Dates, Logger, Strings } from '@juicyllama/utils'

const api = new Api()
const logger = new Logger(['example'])

const name = Strings.capitalize('juicy')
const nextWeek = Dates.addDays(new Date(), 7)

logger.log(`Hello ${name}`)
```

## Utilities

### Api

HTTP wrapper around axios with structured logging via `Logger`.

- `get<T>(domain, url, config?, uuid?, interceptor?)`: GET request that returns `T` or throws.
- `post<T>(domain, url, data?, config?, uuid?, skipDebugLog?)`: POST request that returns `T` or throws.
- `patch<T>(domain, url, data?, config?, uuid?)`: PATCH request that returns `T` or throws.
- `put<T>(domain, url, data?, config?, uuid?)`: PUT request that returns `T` or throws.
- `delete(domain, url, config?, uuid?)`: DELETE request that returns `true` or throws.
- `defaultConfig()`: Default axios config with JSON headers.
- `processError(...)`: Logs details and throws a new `Error` with a formatted message.

Notes:
`domain` and `uuid` are used only for logging context. Errors are logged and rethrown.

### Classes

Utility for composing multiple classes.

- `ExtendsMultiple(baseClasses)`: Returns a constructor that mixes all base class instances and prototypes.

### Color

Detects whether a color is light or dark.

- `lightOrDark(color)`: Accepts hex (`#fff` / `#ffffff`) or `rgb(...)` / `rgba(...)` strings. Throws on invalid formats.

### Countries

Country helpers backed by `src/assets/countries.json`.

- `convertISO2ToISO3(iso2)`: Returns ISO3 code or `null`.
- `countryNameToISO2(countryName)`: Returns ISO2 code or `null`.
- `getCountry(ISO2)`: Returns a `Country` record or `undefined`.

### Csv

CSV parsing helpers for `Express.Multer.File` objects.

- `parseCsvFile(file, mappers?)`: Parses a CSV file buffer into an array of objects. Optional header remapping.
- `createTempCSVFileFromString(content)`: Creates a temp CSV file for testing and returns `{ filePath, csv_file, dirPath }`.

### Dates

Date and time utilities.

- `now()`: Returns the current local `Date`.
- `utc()`: Returns a `Date` constructed from UTC components.
- `format(date, format)`: Formats a date. Supports `iso`, `date`, `time`, `datetime`, and tokens like `YYYY`, `MMMM`, `MMM`, `MM`, `DD`, `Do`, `Day`, `HH`, `mm`, `ss`, `SSS`.
- `dayName(date)`: Returns day name with Monday as index 0.
- `addDays(date, days)` and `subtractDays(date, days)`.
- `addMinutes(date, minutes)`.
- `addHours(date, hours)` and `subtractHours(date, hours)`.
- `addStep(date, step, steps?)`: Adds a `StepType` to a date. Note the enum value `StepType.MONHTHS` (spelling).
- `lastMonth()`: Returns `{ from, to }` for the previous month.
- `isBetween(date, from, to)`.
- `nextDate(frequency)`: Returns the next date for `SubscriptionFrequency`.
- `ahead(date)`: Humanized time until a future date.
- `ago(date, decimals?)`: Humanized time since a past date.
- `diff(date1, date2, decimals?)`: Humanized duration between two dates.
- `minutesAgo(minutes)`, `hoursAgo(hours)`, `daysAgo(days)`, `weeksAgo(weeks)`, `monthsAgo(months)`, `yearsAgo(years)`.
- `daysToGo(days, top_level?)`: Humanized remaining time for a number of days.

### Emails

- `maskEmail(email)`: Returns a masked email address.

### Enums (utility)

- `getKeyName(enumObj, value)`: Returns the enum key for a value.
- `toArray(enumObj, key_name, pair_name)`: Converts an enum to an array of objects. Handles numeric enum reverse mappings.

### Env

Environment helpers and `.env` file utilities.

- `get()`: Returns `Environment` based on `NODE_ENV`.
- `IsProd()`, `IsDev()`, `IsTest()`, `IsNotTest()`, `IsNotProd()`, `IsSandbox()`.
- `useCache()`: Returns `true` unless `NODE_ENV` is `test`.
- `readEnvVars({ envPath, fileName })`: Reads a `.env` file into an array of lines.
- `getEnvValue({ key, envPath, fileName })`: Reads a single value from a `.env` file.
- `setEnvValue({ key, value, envPath?, fileName? })`: Updates or inserts a key in a `.env` file.
- `setEnv({ values, envPath?, fileName? })`: Batch updates a `.env` file.

### Errors (internal)

`Errors` exists in `src/utils/Errors.ts` but is not exported from `src/index.ts`.

- `format(error)`: Returns an `Error` if passed one, wraps strings, otherwise returns `new Error('Unknown error')`.

### File

File and buffer helpers (Node.js only).

- `unlink(filePath?, dirPath?)`: Deletes a file or directory.
- `createTempFileFromString({ fileName, mimetype, content })`: Writes a temp file and returns `{ filePath, file, dirPath }`.
- `createTempFilePath(fileName?)`: Returns `{ filePath, dirPath, fileName }`.
- `md5Checksum(buffer)`: Returns a base64 MD5 hash.
- `createFileFromBase64(base64, filename)`: Creates an `Express.Multer.File`-shaped object.
- `downloadFile(url)`: Downloads a file and returns an `Express.Multer.File`-shaped object.
- `getMimeType(fileName)`: Looks up MIME type in `src/assets/mimetypes.json`.
- `exists(filePath)`: Checks file existence.
- `read(filePath)`: Reads a file as UTF-8.

### Functions

- `whoIsMyDaddy()`: Returns the calling function name based on the stack trace.

### Geocoding

Geospatial helpers powered by Turf.js.

- `areCoordinatesInBoundingBox(coordinates, boundingBox)`.
- `areCoordinatesInPolygon(coordinates, polygonCoords)`.
- `areCoordinatesBetweenTwoPoints(coordinates, northeast, southwest, expand_by_meters?)`.
- `expandBoundingBox(northeast, southwest, expand_by_meters)`.
- `getDistance(from, to)`: Distance in meters.
- `getBoundingBoxCenter(northeast, southwest)`.
- `getDistanceBetweenTwoPoints(point1, point2)`: Distance in kilometers.

### Json

JSON helpers for `Express.Multer.File` objects and browser storage.

- `parseJsonFile(file, mappers?)`: Parses a JSON array from a file buffer and optionally remaps keys.
- `createTempJSONFileFromString(content)`: Creates a temp JSON file for testing.
- `changeKeyValues(mappers, results)`.
- `getLocalStorageObject(store_key)`: Returns parsed JSON from `localStorage` or `null`.

### Languages

Language lookup backed by `src/assets/languages.json`.

- `getLanguage(ISO2)`: Returns a `Language` record or `undefined`.

### Locale

Browser locale detection with Node fallbacks.

- `getLocale()`: Returns the browser locale or `DEFAULT_LOCALE` / `VITE_DEFAULT_LOCALE`.
- `getCountry()`: Extracts the country part from the locale.
- `getLanguage()`: Extracts the language part from the locale.

### Logger

Structured logger with optional Grafana Loki push.

- `error(message, opts?)`, `warn(...)`, `log(...)`, `debug(...)`, `verbose(...)`.
- `status()`: Logs sample messages and Grafana status.
- `table(data)`: `console.table` in development.
- `data(key, value)`: Deprecated convenience wrapper.

Log levels use `LOG_LEVEL` where `1=VERBOSE`, `2=DEBUG`, `3=LOG`, `4=WARN`, `5=ERROR`. Default is `3`.

### Measurements

- `LbsToKgs(number)` and `KgsToLbs(number)`.
- `GramsToOz(number)`.
- `FtInchesToCm(number)` and `CmToFtInches(number)`.

### Numbers

- `amountToCents(number)`.
- `toCurrency(number, currency)` using `SupportedCurrencies`.
- `toFinancial(number)`.

### Objects

- `clean(object)`: Removes keys with `undefined`, `'undefined'`, or empty string values.

### OTP

- `generateVerificationCode(length)`: Returns a numeric string.

### Phone

- `internationalCode(iso2)`: Returns the country dialling code as digits only.

### Poll

Repeatedly executes a request until a validation function succeeds.

- `url(validate, url, config?, interval?, max_attempts?, domain?, uuid?)`.
- `function(validate, func, interval?, max_attempts?, domain?, uuid?)`.

Defaults: `interval=2000` ms, `max_attempts=10`. Throws an error after the max attempts.

### Random

Random helpers and mock data.

- `LlamaFact()`: Returns a random entry from `src/assets/llama.facts.json`.
- `uppercase`, `lowercase`, `number`, `symbol`: Random single character getters.
- `Number(min, max)`: Random integer in `[min, max)`.
- `String(length?)`: Random alphanumeric string.
- `Password(length?)`: Random password containing upper, lower, number, symbol.
- `Words(seperator?, length?, type?, transform?)`: Returns random words. Uses a simple internal faker-like stub.

### Security

- `hashPassword(password)`: SHA-512 hash. If `password.length === 128`, returns the input.
- `referrerCheck(referrer, domain)`: Enforces origin match in production.
- `encode(data)` and `decode(token)`: JWT encode/decode using `jwt-simple` and `JWT-SIMPLE-SECRET`.

### Stopwatch

- `start()`: Starts timing.
- `check()`: Returns elapsed seconds without stopping.
- `stop()`: Returns elapsed seconds and resets.
- `seconds`: Public property updated on `check()` and `stop()`.

### Strings

String helpers.

- `capitalize(str)`.
- `replacer(template, obj)`: Template string replacement using `Function`. Use trusted templates only.
- `numbersToLetters(number)`.
- `numbersTo26Letters(number)`.
- `toHTMLConversion(string)` and `fromHTMLtoStringConversion(string)`.
- `az09Lowercase(string, skipClean?)`.
- `onlyNumbers(string)`.
- `slug(string)`: Lowercases, removes symbols, and replaces whitespace with dashes.
- `plural(word, amount?)` and `singular(word, amount?)`.
- `stringToEmojis(string)`.
- `numberToSlackEmojis(number)`.
- `randomize(string)`.

### System

- `isOffline()`: Returns `true` when `OFFLINE` is set.

### UUID

- `v4()`: Generates a UUID v4 string.

## Enums

- `CachePeriod`: `NEVER=0`, `MINUTE=60`, `TWENTY=1200`, `HOUR=3600`, `DAY=86400`, `WEEK=604800`, `MONTH=2419200`, `YEAR=31535965`.
- `Environment`: `production`, `sandbox`, `development`, `test`. Helper `fromStringToEnv(env?)` maps a string to an enum.
- `StatsMethods`: `COUNT`, `SUM`, `AVG`.
- `StepType`: `MINUTES`, `HOURS`, `DAYS`, `WEEKS`, `MONHTHS`, `YEARS`.
- `SupportedCurrencies`: `AUD`, `CAD`, `CHF`, `EUR`, `GBP`, `INR`, `MXN`, `USD`, `JPY`, `CNY`, `HKD`, `NZD`, `SEK`, `KRW`, `SGD`, `NOK`, `RUB`, `ZAR`, `TRY`, `BRL`.
- `SupportedLanguages`: `ENGLISH='en'`.
- `SubscriptionFrequency`: `DAILY=1`, `WEEKLY=7`, `BIWEEKLY=14`, `MONTHLY=30`, `BIMONTHLY=60`, `QUARTERLY=90`, `BIQUARTERLY=180`, `YEARLY=365`.
- `FrequencyPerYear`: `DAILY=365`, `TWICE_PER_WEEK=104`, `WEEKLY=52`, `TWICE_PER_MONTH=24`, `MONTHLY=12`, `QUARTERLY=4`, `YEARLY=1`, `NONE=0`.
- `DayNames`: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`.
- `MonthNames`: `January` through `December`.
- `MonthNamesShort`: `Jan` through `Dec`.
- `ComparisonOperator`: `GT`, `GTE`, `LT`, `LTE`, `EQ`, `NE`, `IS`, `NNULL`.

## Types

```ts
export interface Country {
  'Country Name': string
  ISO2: string
  ISO3: string
  'Top Level Domain': string
  FIPS: string
  'ISO Numeric': string
  GeoNameID: number
  E164: number
  'Phone Code': number
  Continent: string
  Capital: string
  'Time Zone in Capital': string
  Currency: string
  'Language Codes': string
  Languages: string
  'Area KM2': number
  'Internet Hosts': number
  'Internet Users': number
  'Phones (Mobile)': number
  'Phones (Landline)': number
  GDP: number
}

export interface Language {
  code: string
  name: string
  native: string
}
```

## Assets

The following JSON assets back the utilities:

- `src/assets/countries.json`: Used by `Countries`.
- `src/assets/languages.json`: Used by `Languages`.
- `src/assets/dailing_codes.json`: Used by `Phone`.
- `src/assets/mimetypes.json`: Used by `File`.
- `src/assets/llama.facts.json`: Used by `Random`.

## Environment variables

These utilities read environment variables:

- `NODE_ENV`: Determines `Environment` and affects `Env` helpers.
- `DEFAULT_LOCALE` and `VITE_DEFAULT_LOCALE`: Used by `Locale`.
- `OFFLINE`: Used by `System.isOffline()`.
- `LOG_LEVEL`: Used by `Logger`.
- `GRAFANA_BEARER_TOKEN`, `GRAFANA_SERVICE_NAME`, `GRAFANA_HOST`: Used by `Logger` for Loki push.
- `JWT-SIMPLE-SECRET`: Used by `Security` for JWT encoding and decoding.

## Development

```bash
npm run lint
npm run format
npm run test
npm run build
```

`npm run go` runs lint, format, test, and build in sequence.

## Testing

Tests are written with Jest and live next to the utilities under `src/utils/*.test.spec.ts`.

```bash
npm test
```

## Build

The compiled output is emitted to `dist/` and type declarations are written to `dist/index.d.ts` by `tsc`.
