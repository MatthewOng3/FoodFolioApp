import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet, Text} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/App";
import {displayEventAlert} from "@redux_store/util";
import {COLORS} from "@util/constants/theme";

interface AlertProps {
    text: string;
    iconName: keyof typeof Ionicons.glyphMap | undefined;
}

/**
 * @description Component that displays an alert when an event happens
 * @see util.tsx
 */
function EventAlert({text, iconName}: AlertProps) {
    const dispatch: AppDispatch = useDispatch();

    //Set initial value to 0
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true
        }).start(() => {
            // After the fade-in animation completes, start a timer to fade out.
            setTimeout(() => {
                // Fade-out animation
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true
                }).start(() => {
                    //Accept a callback function that is executed once animation is finished
                    // After the fade-out animation completes, dispatch the action to hide the alert.
                    dispatch(
                        displayEventAlert({
                            show: false,
                            text: "",
                            iconName: undefined
                        })
                    );
                });
            }, 2500); // This timeout minus the fade-out duration will give 3 seconds in total.
        });
    }, [fadeAnim]);

    return (
        <Animated.View style={{...styles.container, opacity: fadeAnim}}>
            <Ionicons
                name={iconName}
                size={24}
                color={COLORS.brown600}
            />
            <Text style={{fontSize: 16, color: "black"}}>{text}</Text>
        </Animated.View>
    );
}

export default EventAlert;

const styles = StyleSheet.create({
    container: {
        width: 350,
        height: 40,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        borderColor: COLORS.brown600,
        borderWidth: 1,
        flexDirection: "row",
        position: "absolute",
        zIndex: 3,
        bottom: 20, // Adjust this value to position the view from the bottom
        alignSelf: "center", // Center horizontally
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "center"
    }
});
