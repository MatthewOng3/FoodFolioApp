import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {STYLES} from "@util/constants/styles/styles.constants";
import {Box} from "native-base";
import React, {cloneElement, ReactElement} from "react";
import {StyleSheet, Text, TextInput} from "react-native";

interface AuthTextInputProps {
    label: string;
    icon: ReactElement;
    value: string;
    onChange: (value: string) => void;
    autoCapitalize?: "none" | "sentences" | "characters" | "words";
    secure?: boolean;
}

function AuthTextInput({
    label,
    icon,
    value,
    onChange,
    autoCapitalize = "sentences",
    secure = false
}: AuthTextInputProps) {
    const formattedIcon = cloneElement(icon, {
        style: styles.inputIcon,
        size: 28,
        color: COLOURS.GRAY_600
    });

    return (
        <Box style={styles.groupContainer}>
            <Text style={styles.inputLabelText}>{label}</Text>
            <Box style={styles.inputContainer}>
                {formattedIcon}
                <TextInput
                    secureTextEntry={secure}
                    style={styles.inputField}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize={autoCapitalize}
                />
            </Box>
        </Box>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        gap: 10
    },
    inputLabelText: {
        textTransform: "uppercase",
        fontFamily: FONTS.MULISH_SEMI_BOLD,
        fontWeight: "600",
        fontSize: 12,
        lineHeight: 12,
        letterSpacing: 1.5,
        color: COLOURS.GRAY_400
    },
    inputContainer: {
        position: "relative"
    },
    inputIcon: {
        position: "absolute",
        left: 10,
        top: 10,
        zIndex: 20
    },
    inputField: {
        height: 48,
        width: "100%",
        backgroundColor: COLOURS.WHITE,
        borderRadius: 8,
        ...STYLES.BASIC_BORDER,
        borderColor: COLOURS.GRAY_200,
        paddingLeft: 45
    }
});

export default AuthTextInput;
