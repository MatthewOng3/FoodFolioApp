import React from "react";
import {ActivityIndicator} from "react-native";

/**
 * @description Custom loading indicator/buffer
 */
function LoadingIndicator() {
    return (
        <ActivityIndicator
            color={"gray"}
            size={"large"}
            style={{
                flex: 1,
                position: "absolute",
                left: "47%",
                top: "50%",
                zIndex: 500
            }}
        />
    );
}

export default LoadingIndicator;
