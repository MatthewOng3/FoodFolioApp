import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface ScreenHeaderProps {
    headerText: string;
    leftIcon: JSX.Element | null;
    rightIcon: JSX.Element | null;
}

/**
 * @description Screen header component with options for left and right icon buttons
 * @param
 */
function ScreenHeader({headerText, leftIcon, rightIcon}: ScreenHeaderProps) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
                justifyContent: "space-between",
                paddingHorizontal: 17,
                width: "auto"
            }}
        >
            <View style={styles.iconContainers}>{leftIcon}</View>
            <Text style={styles.headerText}>{headerText}</Text>
            <View style={styles.iconContainers}>{rightIcon}</View>
        </View>
    );
}

export default ScreenHeader;

const styles = StyleSheet.create({
    headerText: {
        fontSize: 27,
        color: "black",
        flex: 1,
        textAlign: "center"
    },
    iconContainers: {
        width: "20%"
    }
});
