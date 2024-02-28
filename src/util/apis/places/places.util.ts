import axios from "axios";
import {FsqPhoto, FsqPlace} from "../../types/fsq/fsq.places.types";
import {Coordinates} from "../../types/misc.types";
import {RestClient} from "../rest.util";

/**
 * The Base URL for all FSQ API requests
 */
const BASE_URL = `${process.env.BACKEND_API_URL}/api/fsq/places`;

/**
 * The rest client used to execute the API requests
 */
const restClient = new RestClient(
    axios.create({
        baseURL: BASE_URL
    })
);

/**
 * Get a place's details using its FSQ place id
 * @param placeId The place's FSQ ID
 */
export const getPlacesDetails = async (
    placeId: string
): Promise<FsqPlace | null> => {
    const request = await restClient.get("/details", {
        data: {
            place_id: placeId,
            fields: [
                "fsq_id",
                "name",
                "geocodes",
                "location",
                "rating",
                "price",
                "distance",
                "photos",
                "website",
                "categories"
            ]
        }
    });

    if (!request.data.success) return null;
    return request.data.message;
};

/**
 * Get an array of nearby restaurants and cafes from a specific location with specific preferences
 *
 * @param location The origin of the search
 * @param radius The radius of the search
 * @returns PlacePayload[] if places could be found, otherwise, null.
 */
export const getNearbyPlaces = async (
    location: Coordinates,
    radius?: number
): Promise<FsqPlace[]> => {
    const request = await restClient.get(`/nearby`, {
        data: {
            location: {
                latitude: location.lat,
                longitude: location.lng
            },
            radius: Math.min(5000, radius || 500),
            fields: [
                "fsq_id",
                "name",
                "geocodes",
                "location",
                "rating",
                "price",
                "photos",
                "categories"
            ]
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!request.data.success) return [];

    return request.data.message;
};

/**
 * Make a text query search request to FSQ.
 *
 * @param query The text query
 * @param location The user's location
 * @returns {FsqPlace[]} An array of places found that match the text query
 */
export const placesSearch = async (
    query: string,
    location: Coordinates
): Promise<FsqPlace[]> => {
    const request = await restClient.get(`/search`, {
        data: {
            query: query,
            fields: ["fsq_id", "name", "location", "distance"],
            location: {
                latitude: location.lat,
                longitude: location.lng
            }
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!request.data.success) return [];

    return request.data.message;
};

/**
 * Make an autocomplete request to FSQ.
 *
 * @param query The text query
 * @param location The user's location
 * @returns {FsqPlace[]} An array of places found that match the text query
 */
export const placesAutocomplete = async (
    query: string,
    location: Coordinates
): Promise<FsqPlace[]> => {
    const request = await restClient.get(`/autocomplete`, {
        data: {
            query: query,
            fields: ["fsq_id", "name", "location", "distance", "geocodes"],
            location: {
                latitude: location.lat,
                longitude: location.lng
            }
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!request.data.success) return [];

    return request.data.message;
};

/**
 * Get the first photo for an FSQ Place
 *
 * @param place The FSQ place.
 */
export const getPlacesPhoto = (place: FsqPlace) => {
    if (!place || !place.photos || place.photos.length === 0)
        return `${process.env.BACKEND_API_URL}/api/public/assets/pizza`;
    const photo = place.photos[0];
    return getPlacePhoto(photo);
};

/**
 * Get a place photo from FSQ
 *
 * @param photo The FSQ photo object
 */
export const getPlacePhoto = (photo: FsqPhoto) => {
    return `${photo.prefix}${photo.width * photo.height}${photo.suffix}`;
};
