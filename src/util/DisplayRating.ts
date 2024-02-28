export function displayRating(rating: undefined | number) {
    return rating ? `${rating / 2} rating` : "No rating found";
}
