import {MaterialCommunityIcons} from "@expo/vector-icons";
import React, {memo, useEffect, useState} from "react";
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";

type CheckboxProps = {
    colorScheme: string;
    value: string;
    defaultIsChecked: boolean;
    children: string | JSX.Element | JSX.Element[];
    onChange: (selected: boolean) => void;
};

/**
 * @description Custom checkbox component
 * @param colorScheme Color of checkbox
 * @param value
 * @param defaultIsChecked Boolean expression indicating the starting value of checkbox
 * @param children Nested componentto display the checkbox with
 * @param onSelect Can curry with this function to pass in boolean checked value
 * @returns
 */
function Checkbox({
    colorScheme,
    defaultIsChecked,
    children,
    onChange: onSelect
}: CheckboxProps) {
    const [isChecked, setIsChecked] = useState<boolean>(defaultIsChecked);
    const iconName = isChecked ? "checkbox-marked" : "checkbox-blank-outline";

    function pressed() {
        const temp = !isChecked;
        setIsChecked(temp);
        onSelect(temp);
    }

    useEffect(() => {
        setIsChecked(defaultIsChecked);
    }, [defaultIsChecked]);

    //console.log("In ",defaultIsChecked, iconName, isChecked)

    return (
        <TouchableWithoutFeedback onPress={pressed}>
            <View style={styles.container}>
                {children}
                <MaterialCommunityIcons
                    name={iconName}
                    size={20}
                    color={colorScheme}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default memo(Checkbox);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "##CBD2D9",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        width: "100%"
    }
});
