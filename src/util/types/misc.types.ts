export type Coordinates = {
    lat: number;
    lng: number;
};

// Type definition for a hashmap with string keys and array values
export type StringKeyArrayMap<T> = {
    [key: string]: T;
};

export type Coords = Coordinates;
