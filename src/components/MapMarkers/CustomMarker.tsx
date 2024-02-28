import {FsqCategory, FsqPlace} from "@util/types/fsq/fsq.places.types";
import React from "react";
import {MapMarker} from "react-native-maps";
import BarMarker from "./BarMarker";
import CafeMarker from "./CafeMarker";
import RestaurantMarker from "./RestaurantMarker";

export type PlaceMarkerProps = {
    place: FsqPlace;
    onPress: (event) => void;
    title: string;
    forwardedRef: MapMarker;
    selected: boolean;
    zIndex: number;
};

export type MarkerProps = {
    coordinates: {latitude: number; longitude: number};
    onPress: (event) => void;
    title: string;
    forwardedRef: MapMarker;
    selected: boolean;
    zIndex: number;
};

function CustomMarker({
    place,
    onPress,
    title,
    forwardedRef,
    selected,
    zIndex
}: PlaceMarkerProps) {
    const cafeCategory = (category: FsqCategory) => {
        return (
            (category.id >= 13032 && category.id <= 13037) ||
            category.id === 13063 ||
            category.id === 13211
        );
    };

    const barCategory = (category: FsqCategory) => {
        return (
            (category.id >= 13003 && category.id <= 13025) ||
            category.id === 13246 ||
            category.id === 13389
        );
    };

    const props: MarkerProps = {
        coordinates: place.geocodes.main,
        onPress,
        title,
        forwardedRef,
        selected,
        zIndex
    };

    if (place.categories.some(cafeCategory)) {
        return <CafeMarker {...props} />;
    } else if (place.categories.some(barCategory)) {
        return <BarMarker {...props} />;
    } else {
        return <RestaurantMarker {...props} />;
    }
}

export default CustomMarker;
