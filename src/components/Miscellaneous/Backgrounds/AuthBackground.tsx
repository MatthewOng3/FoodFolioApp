import {COLOURS} from "@util/constants/styles/colours.constants";
import {Box} from "native-base";
import React from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Svg, {Path} from "react-native-svg";

function AuthBackground() {
    const {width, height} = Dimensions.get("screen");

    return (
        <View style={styles.backgroundContainer}>
            <Box style={styles.backgroundTop}>
                <Svg
                    height={197}
                    width={width}
                    viewBox={"0 0 375 197"}
                    fill={"none"}
                >
                    <Path
                        fill={COLOURS.BRAND_200}
                        d={
                            "M-70.5633 168.411L-135.685 189.89C-195.008 208.085 -276 189.254 -276 157.266L-276 -61L784 -60.9999L747.085 75.9542C745.339 82.4301 732.954 87.3053 718.247 87.3053L621.402 87.3053C546.494 87.3053 476.592 103.985 435.319 131.708L415.367 145.11C356.891 184.389 236.72 194.411 150.065 167.237C83.6916 146.423 -5.33511 146.896 -70.5633 168.411Z"
                        }
                    />
                </Svg>
            </Box>
            <Box style={styles.backgroundMiddle}>
                <Svg
                    height={283}
                    width={width}
                    viewBox={"0 0 375 283"}
                    fill={"none"}
                >
                    <Path
                        fill={COLOURS.BRAND_100}
                        d="M-23.626 247.322L-100.685 275.201C-160.008 295.159 -241 274.503 -241 239.416L-241 0L819 9.15527e-05L786.44 167.259C785.095 174.167 769.388 178.024 757.163 174.449C659.386 145.854 535.158 150.389 447.249 185.761L419.857 196.783C356.606 222.233 272.988 232.302 192.636 224.144C117.052 216.469 38.3301 224.906 -23.626 247.322Z"
                    />
                </Svg>
            </Box>
            <Box
                style={styles.backgroundBottom}
                width={width}
                height={height}
            ></Box>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundContainer: {
        position: "absolute",
        zIndex: -1
    },
    backgroundTop: {
        position: "absolute",
        zIndex: 2
    },
    backgroundMiddle: {
        position: "absolute",
        top: 0,
        zIndex: 1
    },
    backgroundBottom: {
        position: "absolute",
        backgroundColor: COLOURS.BRAND_50
    }
});

export default AuthBackground;
