/* eslint-disable react/no-unescaped-entities */
import AppleSignIn from "@components/Buttons/AppleSignIn";
import ButtonWithIcons from "@components/Buttons/ButtonWithIcons";
import DismissKeyboardView from "@components/DismissKeyboard";
import AuthTextInput from "@components/Miscellaneous/Interactive/Inputs/AuthTextInput";
import SvgComponent from "@components/SvgComponent";
import {supabase} from "@database/supabase";
import {Feather} from "@expo/vector-icons";
import {
    ParamListBase,
    RouteProp,
    useNavigation
} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {setLoginStatus} from "@redux_store/user";
import {performOAuth} from "@util/apis/supabase/supabase.auth.util";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {STYLES} from "@util/constants/styles/styles.constants";
import {googleSvg} from "@util/constants/svg";
import {LoginScreenParams, NavigationProps} from "@util/types/navigation.types";
import {Box, Button} from "native-base";
import React, {useState} from "react";
import {
    GestureResponderEvent,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import {useDispatch} from "react-redux";
import AuthBackground from "@components/Miscellaneous/Backgrounds/AuthBackground";

interface Props {
    navigation: NativeStackNavigationProp<ParamListBase, "Register", "Login">;
    route?: RouteProp<
        {
            params: LoginScreenParams;
        },
        "params"
    >;
}

/**
 * @description Login Page
 * @param navigation Navigation Hook
 * @access Public
 */
function Login({route}: Props) {
    //onboard indicates true if first time sign up and false other wise
    const params = route!.params;
    const navigation = useNavigation<NavigationProps>();

    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    /**
     * @description Login user using supabase, and set login status to true, sets user_id cookie and access token
     * --Haven't implemented security yet
     * @see UserStore
     */
    async function loginUser(event: GestureResponderEvent): Promise<void> {
        event.preventDefault();

        setErrorMessage("");
        if (!email) {
            setErrorMessage("Email is a required field");
            return;
        }
        if (!password) {
            setErrorMessage("Password is a required field");
            return;
        }

        setLoading(true);

        try {
            const result = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            result.error
                ? setErrorMessage(result.error?.message)
                : authenticateUser();
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }

    function authenticateUser() {
        dispatch(setLoginStatus(true));

        if (params) {
            params.onboard;
        }
    }

    async function googleLogin() {
        const auth = await performOAuth("google");
        if (auth) {
            navigation.navigate("Home");
        }
    }

    return (
        <View style={{flex: 1}}>
            <DismissKeyboardView>
                <KeyboardAvoidingView
                    behavior="height"
                    style={{flex: 1}}
                >
                    <Box style={{flex: 1}}>
                        <AuthBackground />

                        <Box style={styles.loginContainer}>
                            <Text style={STYLES.AUTH_SCREEN_HEADER_TEXT}>
                                Welcome!
                            </Text>
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
                                Find great restaurants, save them, share them.
                            </Text>

                            <ButtonWithIcons
                                leftIcon={
                                    <SvgComponent
                                        svgContent={googleSvg}
                                        width={22}
                                        height={20}
                                    />
                                }
                                buttonStyle={STYLES.AUTH_SCREEN_BTN}
                                onPress={googleLogin}
                                textStyle={STYLES.AUTH_SCREEN_BTN_TEXT}
                            >
                                Sign in with Google
                            </ButtonWithIcons>

                            <AppleSignIn />
                            <Box
                                style={{
                                    borderBottomColor: COLOURS.BRAND_900,
                                    borderBottomWidth: 2,
                                    alignSelf: "stretch",
                                    transform: [{translateY: 15}]
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: FONTS.MULISH_SEMI_BOLD,
                                        fontWeight: "600",
                                        lineHeight: 23,
                                        letterSpacing: 0,
                                        fontSize: 15,
                                        paddingHorizontal: 10,
                                        alignSelf: "center",
                                        color: COLOURS.BRAND_900,
                                        backgroundColor: COLOURS.BRAND_50,
                                        transform: [{translateY: 10}]
                                    }}
                                >
                                    Or
                                </Text>
                            </Box>
                            {errorMessage && (
                                <Text style={STYLES.AUTH_ERROR_TOOLTIP}>
                                    {errorMessage}
                                </Text>
                            )}
                            <Box style={{width: "100%", gap: 20}}>
                                <AuthTextInput
                                    label={"email"}
                                    icon={<Feather name="mail" />}
                                    value={email}
                                    onChange={(value) => setEmail(value)}
                                    autoCapitalize="none"
                                />
                                <AuthTextInput
                                    label={"password"}
                                    icon={<Feather name="lock" />}
                                    value={password}
                                    onChange={(value) => setPassword(value)}
                                    secure={true}
                                />
                            </Box>
                            <Box
                                style={{
                                    gap: 13,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Pressable
                                    onPress={() =>
                                        navigation.navigate("ForgotPwd")
                                    }
                                >
                                    <Text
                                        style={{
                                            ...STYLES.AUTH_FOOTER_TEXT,
                                            color: COLOURS.BRAND_800
                                        }}
                                    >
                                        Reset password
                                    </Text>
                                </Pressable>
                                <Box
                                    style={{
                                        flexDirection: "row",
                                        gap: 4,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text style={{fontSize: 16}}>
                                        Don't have an account?
                                    </Text>
                                    <Pressable
                                        onPress={() =>
                                            navigation.navigate("Register")
                                        }
                                    >
                                        <Text
                                            style={{
                                                ...STYLES.AUTH_FOOTER_TEXT,
                                                color: COLOURS.BRAND_800
                                            }}
                                        >
                                            Sign up
                                        </Text>
                                    </Pressable>
                                </Box>
                            </Box>
                            <Button
                                style={STYLES.AUTH_ACTION_BTN}
                                isLoading={loading}
                                spinnerPlacement="end"
                                isLoadingText="Signing Up"
                                onPress={loginUser}
                            >
                                Sign in
                            </Button>
                        </Box>
                    </Box>
                </KeyboardAvoidingView>
            </DismissKeyboardView>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "50%",
        padding: 20,
        gap: 24
    }
});
