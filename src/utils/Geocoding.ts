import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import buffer from '@turf/buffer'
import distance from '@turf/distance'
import { point, polygon } from '@turf/helpers'

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface BoundingBox {
    north: number
    east: number
    south: number
    west: number
}

export class Geocoding {
    static areCoordinatesInBoundingBox(coordinates: Coordinates, boundingBox: BoundingBox): boolean {
        // Define the bounding box polygon using the northeast and southwest coordinates
        const _bboxPolygon = bboxPolygon([boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north])

        // Convert the target coordinates to a turf point
        const pointToCheck = point([coordinates.longitude, coordinates.latitude])

        // Check if the point lies within the bounding box polygon
        const isPointInBbox = booleanPointInPolygon(pointToCheck, _bboxPolygon)

        return isPointInBbox
    }

    static areCoordinatesInPolygon(coordinates: Coordinates, polygonCords: Coordinates[]): boolean {
        const pointToCheck = point([coordinates.longitude, coordinates.latitude])
        const poly = polygon([polygonCords.map((p: Coordinates) => [p.longitude, p.latitude])])

        // Check if the point lies within the bounding box polygon
        const isPointInBbox = booleanPointInPolygon(pointToCheck, poly)

        return isPointInBbox
    }

    /**
     * @function    areCoordinatesBetweenTwoPoints
     * @description Determines if a point P = (p.x, p.y) lies on the line connecting points S = (S.x, S.y) and E = (E.x, E.y) by calculating the determinant of the matrix. A point is considered to belong to the line if the precision of the calculation is small enough (tests for errors and loss of precision).
     * @param       {Coordinates} northeast   The start point
     * @param       {Coordinates} southwest     The end point
     * @param       {Coordinates} coordinates   The point we which to test.
     * @param       {number}      expand_by_meters  To add a buffer of space around the points
     *	@returns     <code>true</code> if the given point belongs to the line, <code>false</code> otherwise.
     *	@see         {@link http://stackoverflow.com/a/907491/1337392|Distance Matrix Calculation}
     */

    static areCoordinatesBetweenTwoPoints(
        coordinates: Coordinates,
        northeast: Coordinates,
        southwest: Coordinates,
        expand_by_meters?: number
    ): boolean {
        if (!southwest.longitude || !southwest.latitude || !northeast.longitude || !northeast.latitude) {
            return false
        }

        if (expand_by_meters) {
            try {
                const expandedBoundingBox = Geocoding.expandBoundingBox(northeast, southwest, expand_by_meters)
                northeast = expandedBoundingBox.northeast
                southwest = expandedBoundingBox.southwest
            } catch {
                //do nothing
            }
        }
        return Geocoding.areCoordinatesInBoundingBox(coordinates, {
            north: northeast.latitude,
            east: northeast.longitude,
            south: southwest.latitude,
            west: southwest.longitude,
        })
    }

    /**
     * Expand a bounding box by a given number of meters
     */

    static expandBoundingBox(
        northeast: Coordinates,
        southwest: Coordinates,
        expand_by_meters: number
    ): { northeast: Coordinates; southwest: Coordinates } {
        const _bboxPolygon = bboxPolygon([
            southwest.longitude,
            southwest.latitude,
            northeast.longitude,
            northeast.latitude,
        ])

        const buffered = buffer(_bboxPolygon, expand_by_meters, {
            units: 'meters',
        })

        if (!buffered) {
            throw new Error('Could not expand bounding box')
        }

        const newBoundingBox = bbox(buffered) as [number, number, number, number]

        return {
            northeast: {
                latitude: newBoundingBox[3],
                longitude: newBoundingBox[2],
            },
            southwest: {
                latitude: newBoundingBox[1],
                longitude: newBoundingBox[0],
            },
        }
    }

    /**
     * Get the distance between two points in meters
     */

    static getDistance(from: Coordinates, to: Coordinates): number {
        const from_point = point([from.longitude, from.latitude])
        const to_point = point([to.longitude, to.latitude])
        return distance(from_point, to_point, { units: 'meters' })
    }

    /**
     * Get the center point of a bounding box
     */

    static getBoundingBoxCenter(northeast: Coordinates, southwest: Coordinates): Coordinates {
        return {
            latitude: (northeast.latitude + southwest.latitude) / 2,
            longitude: (northeast.longitude + southwest.longitude) / 2,
        }
    }

    static getDistanceBetweenTwoPoints(point1: Coordinates, point2: Coordinates): number {
        const from = point([point1.longitude, point1.latitude])
        const to = point([point2.longitude, point2.latitude])
        const options = { units: 'kilometers' as const }
        return distance(from, to, options)
    }
}
