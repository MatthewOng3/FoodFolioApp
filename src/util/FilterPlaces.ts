/**
 * @description Filter out places outside of the radius, and create a new object array based on the values
 * @param placesList
 * @param userLocation
 * @param radius
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function filterPlaces(placesList: Array<FsqPlace>, userLocation: Coordinates, radius: number | undefined): PlacePayload[] {
//
//     if (!userLocation.lat || !userLocation.lng)
//         return placesList
//
//
//     return placesList.map((item) => {
//         //Create new restaurant object
//         const restaurant: RestaurantDetailsObject = {
//             name: item.name,
//             distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, item.location.latitude, item.location.longitude),
//             rating: item.rating ? item.rating : 0,
//             imageRef: item.photos ? item.photos[0].photo_reference : "",
//             coords: {lat: item.location.latitude, lng: item.location.longitude},
//             placeId: item.id
//         }
//
//         //Create place payload object
//         return {
//             place_id: item.id,
//             details: restaurant
//         }
//     })
// }

/**
 * @description Calculate distance between 2 points using Haversine formula
 * @param lat1  User location
 * @param lon1  User location
 * @param lat2
 * @param lon2
 * @returns
 */
export function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c; // Distance in km

    return parseFloat(dist.toFixed(2)); // Convert to a number with two decimal places
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}
