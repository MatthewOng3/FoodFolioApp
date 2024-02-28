import {COLOURS} from "@util/constants/styles/colours.constants";
import React from "react";
import {Marker} from "react-native-maps";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import {MarkerProps} from "./CustomMarker";

const unselectedCafeMarker = (
    <Svg
        width={24}
        height={34}
        viewBox={"0 0 24 34"}
        fill={"none"}
    >
        <Path
            fill={COLOURS.WHITE}
            stroke={COLOURS.GRAY_200}
            strokeWidth={0.5}
            d={
                "M19.4209 21.1558C17.6117 22.6345 15.7714 24.3274 14.9864 26.6131L12.7091 33.2428C12.4768 33.9191 11.5232 33.9191 11.2909 33.2428L9.01365 26.6131C8.22856 24.3274 6.38834 22.6345 4.57912 21.1558C1.93686 18.9962 0.25 15.7085 0.25 12.0256C0.25 5.52159 5.51113 0.25 12 0.25C18.4889 0.25 23.75 5.52159 23.75 12.0256C23.75 15.7085 22.0631 18.9962 19.4209 21.1558Z"
            }
        />
        <Rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="10"
            fill="#CBF1D9"
        />
        <Path
            d="M14.5 12H17C17.8284 12 18.5 12.6716 18.5 13.5C18.5 14.3284 17.8284 15 17 15H14.5V12Z"
            stroke={"#008330"}
        />
        <Path
            d="M6 11.5H16V13.5C16 16.2614 13.7614 18.5 11 18.5C8.23858 18.5 6 16.2614 6 13.5V11.5Z"
            fill={"#008330"}
        />
        <Path
            d="M9.99696 10C9.99696 8.5 9 8.38091 9 7.5C9 6.61909 10 6.5 10 5"
            stroke={"#008330"}
            strokeLinecap="square"
        />
        <Path
            d="M11.997 10C11.997 8.5 11 8.38091 11 7.5C11 6.61909 12 6.5 12 5"
            stroke={"#008330"}
            strokeLinecap="square"
        />
    </Svg>
);

const selectedCafeMarker = (
    <Svg
        width={24}
        height={34}
        viewBox={"0 0 24 34"}
        fill={"none"}
    >
        <Path
            d="M19.4209 21.1558C17.6117 22.6345 15.7714 24.3274 14.9864 26.6131L12.7091 33.2428C12.4768 33.9191 11.5232 33.9191 11.2909 33.2428L9.01365 26.6131C8.22856 24.3274 6.38834 22.6345 4.57912 21.1558C1.93686 18.9962 0.25 15.7085 0.25 12.0256C0.25 5.52159 5.51113 0.25 12 0.25C18.4889 0.25 23.75 5.52159 23.75 12.0256C23.75 15.7085 22.0631 18.9962 19.4209 21.1558Z"
            fill="white"
            stroke="#B95000"
            strokeWidth="0.5"
        />
        <Rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="10"
            fill="url(#paint0_linear_2948_10634)"
        />
        <Path
            d="M14.5 12H17C17.8284 12 18.5 12.6716 18.5 13.5C18.5 14.3284 17.8284 15 17 15H14.5V12Z"
            stroke="white"
        />
        <Path
            d="M6 11.5H16V13.5C16 16.2614 13.7614 18.5 11 18.5C8.23858 18.5 6 16.2614 6 13.5V11.5Z"
            fill="white"
        />
        <Path
            d="M9.99696 10C9.99696 8.5 9 8.38091 9 7.5C9 6.61909 10 6.5 10 5"
            stroke="white"
            strokeLinecap="square"
        />
        <Path
            d="M11.997 10C11.997 8.5 11 8.38091 11 7.5C11 6.61909 12 6.5 12 5"
            stroke="white"
            strokeLinecap="square"
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_2948_10634"
                x1="2"
                y1="22"
                x2="25.1389"
                y2="8.83545"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FF8000" />
                <Stop
                    offset="1"
                    stopColor="#B95000"
                />
            </LinearGradient>
        </Defs>
    </Svg>
);

function CafeMarker({
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
            ref={(element) => (forwardedRef = element)}
            tracksViewChanges={false}
            zIndex={zIndex}
        >
            {selected ? selectedCafeMarker : unselectedCafeMarker}
        </Marker>
    );
}

export default CafeMarker;
