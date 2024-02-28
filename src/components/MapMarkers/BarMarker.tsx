import {COLOURS} from "@util/constants/styles/colours.constants";
import React from "react";
import {Marker} from "react-native-maps";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import {MarkerProps} from "./CustomMarker";

const unselectedBarMarker = (
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
            x={2}
            y={2}
            width={20}
            height={20}
            rx={10}
            fill={"#F2DEFF"}
        />
        <Path
            fill={"#7000B5"}
            d={
                "M12 6C10.1539 6 5.53848 6.23077 6.00002 6.69231L11.5385 12.4615V16.1538C11.5385 17.0769 8.76924 16.6154 8.76924 18H15.2308C15.2308 16.6154 12.4615 17.0769 12.4615 16.1538V12.4615L18 6.69231C18.4615 6.23077 13.8461 6 12 6ZM12 6.92308C14.3077 6.92308 16.3846 7.15385 16.3846 7.15385L15.6923 7.84615H8.3077L7.6154 7.15385C7.6154 7.15385 9.69232 6.92308 12 6.92308Z"
            }
        />
    </Svg>
);

const selectedBarMarker = (
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
            strokeWidth={0.5}
        />
        <Rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="10"
            fill="url(#paint0_linear_2948_10635)"
        />
        <Path
            d="M12 6C10.1539 6 5.53848 6.23077 6.00002 6.69231L11.5385 12.4615V16.1538C11.5385 17.0769 8.76924 16.6154 8.76924 18H15.2308C15.2308 16.6154 12.4615 17.0769 12.4615 16.1538V12.4615L18 6.69231C18.4615 6.23077 13.8461 6 12 6ZM12 6.92308C14.3077 6.92308 16.3846 7.15385 16.3846 7.15385L15.6923 7.84615H8.3077L7.6154 7.15385C7.6154 7.15385 9.69232 6.92308 12 6.92308Z"
            fill="white"
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_2948_10635"
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

function BarMarker({
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
            {selected ? selectedBarMarker : unselectedBarMarker}
        </Marker>
    );
}

export default BarMarker;
