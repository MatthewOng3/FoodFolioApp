import {StyleSheet} from "react-native";
import {COLOURS} from "./colours.constants";
import {FONTS} from "./fonts.constants";

const GENERAL_STYLES = StyleSheet.create({
    HEADING: {},
    SUB_TEXT: {
        fontFamily: FONTS.MULISH_REGULAR,
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0.2,
        color: COLOURS.GRAY_400
    },
    BASIC_BORDER: {
        borderWidth: 0.5,
        borderColor: COLOURS.BLACK
    }
});

const AUTH_SCREEN_STYLES = StyleSheet.create({
    AUTH_SCREEN_HEADER_TEXT: {
        textAlign: "left",
        alignSelf: "flex-start",
        fontFamily: FONTS.MULISH_BOLD,
        fontSize: 32,
        fontWeight: "700",
        lineHeight: 32,
        letterSpacing: 0,
        color: COLOURS.SECONDARY
    },
    AUTH_SCREEN_BTN: {
        gap: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOURS.WHITE,
        ...GENERAL_STYLES.BASIC_BORDER,
        paddingHorizontal: 24,
        paddingVertical: 16,
        width: "65%",
        borderRadius: 30
    },
    AUTH_SCREEN_BTN_TEXT: {
        fontFamily: FONTS.ROBOTO_MEDIUM,
        fontWeight: "700",
        lineHeight: 23,
        fontSize: 18,
        letterSpacing: 0,
        color: "black" //COLOURS.BRAND_800
    },
    AUTH_ERROR_TOOLTIP: {
        fontFamily: FONTS.MULISH_REGULAR,
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 12,
        letterSpacing: 0.2,
        textAlign: "left",
        alignSelf: "flex-start",
        color: COLOURS.NEGATIVE_400
    },
    AUTH_ACTION_BTN: {
        ...GENERAL_STYLES.BASIC_BORDER,
        width: "100%",
        height: 55,
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 8,
        backgroundColor: COLOURS.BRAND_800,
        alignSelf: "baseline",
        transform: [{translateY: 50}]
    },
    AUTH_ACTION_BTN_TEXT: {
        fontFamily: FONTS.MULISH_BOLD,
        fontWeight: "700",
        fontSize: 15,
        lineHeight: 23,
        letterSpacing: 0,
        textAlign: "center",
        color: COLOURS.WHITE,
        zIndex: 10
    },
    AUTH_FOOTER_TEXT: {
        fontFamily: FONTS.MULISH_SEMI_BOLD,
        fontWeight: "600",
        fontSize: 18,
        lineHeight: 23,
        letterSpacing: 0,
        color: COLOURS.GRAY_800
    }
});

export const STYLES = StyleSheet.create({
    ...GENERAL_STYLES,
    ...AUTH_SCREEN_STYLES
});
