/**
 * Get the Google Map url for a place using it's place id
 *
 * @param placeId The place ID of the location
 */
export const getGoogleMapUrl = (placeId: string): string => {
    //const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat}%2C-${coords.lng}&query_place_id=${placeId}`
    return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
};
