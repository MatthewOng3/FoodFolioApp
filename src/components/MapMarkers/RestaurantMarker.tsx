import {COLOURS} from "@util/constants/styles/colours.constants";
import React from "react";
import {Marker} from "react-native-maps";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import {MarkerProps} from "./CustomMarker";

const unselectedRestaurantMarker = (
    <Svg
        width={24}
        height={34}
        viewBox={"0 0 24 34"}
        fill={"none"}
    >
        <Path
            fill={COLOURS.WHITE}
            stroke={"#CBD2D9"}
            strokeWidth={0.5}
            d="M19.4209 21.1558C17.6117 22.6345 15.7714 24.3274 14.9864 26.6131L12.7091 33.2428C12.4768 33.9191 11.5232 33.9191 11.2909 33.2428L9.01365 26.6131C8.22856 24.3274 6.38834 22.6345 4.57912 21.1558C1.93686 18.9962 0.25 15.7085 0.25 12.0256C0.25 5.52159 5.51113 0.25 12 0.25C18.4889 0.25 23.75 5.52159 23.75 12.0256C23.75 15.7085 22.0631 18.9962 19.4209 21.1558Z"
        />
        <Rect
            x={2}
            y={2}
            width={20}
            height={20}
            rx={10}
            fill="#D5E6FB"
        />
        <Path
            fill={"#007EDE"}
            d="M7.56839 5L6.88657 9.77273C6.79017 10.4477 8.57857 11.682 8.59112 12.5V19H9.95476V12.5C9.95476 11.6818 11.7557 10.4477 11.6593 9.77273L10.9775 5H10.2957L10.6366 8.75L9.61385 9.43182V5H8.93203V9.43182L7.9093 8.75L8.25021 5H7.56839ZM16.7729 5C14.7275 5 14.0544 7.35118 14.0457 9.09091V13.1818H15.4093V19H16.7729V5Z"
        />
    </Svg>
);

const selectedRestaurantMarker = (
    <Svg
        width={24}
        height={34}
        viewBox={"0 0 24 34"}
        fill={"none"}
    >
        <Path
            fill={COLOURS.WHITE}
            stroke={COLOURS.BRAND_800}
            strokeWidth={0.5}
            d="M19.4209 21.1558C17.6117 22.6345 15.7714 24.3274 14.9864 26.6131L12.7091 33.2428C12.4768 33.9191 11.5232 33.9191 11.2909 33.2428L9.01365 26.6131C8.22856 24.3274 6.38834 22.6345 4.57912 21.1558C1.93686 18.9962 0.25 15.7085 0.25 12.0256C0.25 5.52159 5.51113 0.25 12 0.25C18.4889 0.25 23.75 5.52159 23.75 12.0256C23.75 15.7085 22.0631 18.9962 19.4209 21.1558Z"
        />
        <Rect
            x={2}
            y={2}
            width={20}
            height={20}
            rx={10}
            fill="url(#paint0_linear_3060_544)"
        />
        <Path
            fill={COLOURS.WHITE}
            d={
                "M7.56839 5L6.88657 9.77273C6.79017 10.4477 8.57857 11.682 8.59112 12.5V19H9.95476V12.5C9.95476 11.6818 11.7557 10.4477 11.6593 9.77273L10.9775 5H10.2957L10.6366 8.75L9.61385 9.43182V5H8.93203V9.43182L7.9093 8.75L8.25021 5H7.56839ZM16.7729 5C14.7275 5 14.0544 7.35118 14.0457 9.09091V13.1818H15.4093V19H16.7729V5Z"
            }
        />
        <Defs>
            <LinearGradient
                id={"paint0_linear_3060_544"}
                x1={2}
                y1={22}
                x2={25.1389}
                y2={8.83545}
                gradientUnits={"userSpaceOnUse"}
            >
                <Stop stopColor={COLOURS.PRIMARY} />
                <Stop
                    offset={1}
                    stopColor={COLOURS.BRAND_800}
                />
            </LinearGradient>
        </Defs>
    </Svg>
);

function RestaurantMarker({
    coordinates,
    onPress,
    title,
    // eslint-disable-next-line
    forwardedRef,
    selected,
    zIndex
}: MarkerProps) {
    return (
        <Marker
            coordinate={coordinates}
            onPress={onPress}
            title={title}
            zIndex={zIndex}
            ref={(element) => (forwardedRef = element)}
        >
            {selected ? selectedRestaurantMarker : unselectedRestaurantMarker}
        </Marker>
    );
}

export default RestaurantMarker;
