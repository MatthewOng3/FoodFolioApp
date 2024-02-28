import AppleSignIn from "@components/Buttons/AppleSignIn";
import ButtonWithIcons from "@components/Buttons/ButtonWithIcons";
import AuthBackground from "@components/Miscellaneous/Backgrounds/AuthBackground";
import SvgComponent from "@components/SvgComponent";
import {Feather} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {performOAuth} from "@util/apis/supabase/supabase.auth.util";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {STYLES} from "@util/constants/styles/styles.constants";
import {googleSvg} from "@util/constants/svg";
import {NavigationProps} from "@util/types/navigation.types";
import {Box} from "native-base";
import React from "react";
import {StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";

function Welcome() {
    const navigation = useNavigation<NavigationProps>();

    async function googleSignIn() {
        const res = await performOAuth("google");
        if (res) {
            navigation.navigate("Login", {onboard: true});
        }
    }

    return (
        <View style={{flex: 1}}>
            <AuthBackground />
            <Box style={styles.welcomeContainer}>
                <Text style={STYLES.AUTH_SCREEN_HEADER_TEXT}>Welcome!</Text>
                <Text
                    style={{
                        fontFamily: FONTS.MULISH_SEMI_BOLD,
                        fontWeight: "600",
                        fontSize: 15,
                        lineHeight: 23,
                        letterSpacing: 0,
                        color: COLOURS.GRAY_800
                    }}
                >
                    Find great restaurants, save them, share them. It’s that
                    easy with Foodfolio.
                </Text>
                <Box style={{width: "100%", gap: 16, alignItems: "center"}}>
                    <ButtonWithIcons
                        leftIcon={
                            <Feather
                                name="mail"
                                size={20}
                                color={COLOURS.BRAND_800}
                            />
                        }
                        buttonStyle={STYLES.AUTH_SCREEN_BTN}
                        onPress={() => navigation.navigate("Register")}
                        textStyle={STYLES.AUTH_SCREEN_BTN_TEXT}
                    >
                        Sign up with email
                    </ButtonWithIcons>

                    <ButtonWithIcons
                        leftIcon={
                            <SvgComponent
                                svgContent={googleSvg}
                                width={22}
                                height={20}
                            />
                        }
                        buttonStyle={STYLES.AUTH_SCREEN_BTN}
                        onPress={googleSignIn}
                        textStyle={STYLES.AUTH_SCREEN_BTN_TEXT}
                    >
                        Sign in with Google
                    </ButtonWithIcons>

                    <AppleSignIn />
                </Box>
                <Box
                    style={{
                        flexDirection: "row",
                        gap: 4
                    }}
                >
                    <Text style={STYLES.AUTH_FOOTER_TEXT}>
                        Already have an account?
                    </Text>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate("Login", {onboard: false})
                        }
                    >
                        <Text
                            style={{
                                ...STYLES.AUTH_FOOTER_TEXT,
                                color: COLOURS.BRAND_800
                            }}
                        >
                            Sign in
                        </Text>
                    </TouchableWithoutFeedback>
                </Box>
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "50%",
        padding: 20,
        gap: 24
    }
});

export default Welcome;
