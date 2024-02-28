import DismissKeyboardView from "@components/DismissKeyboard";
import AuthBackground from "@components/Miscellaneous/Backgrounds/AuthBackground";
import AuthTextInput from "@components/Miscellaneous/Interactive/Inputs/AuthTextInput";
import Policies from "@components/Policies";
import {supabase} from "@database/supabase";
import {Feather, Ionicons} from "@expo/vector-icons";
import {sendWelcomeEmail} from "@util/apis/email/email.util";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {STYLES} from "@util/constants/styles/styles.constants";
import {NavigationProps} from "@util/types/navigation.types";
import {Box, Button, IconButton} from "native-base";
import React, {useState} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";

type Props = {
    navigation: NavigationProps;
};

function Register({navigation}: Props) {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [isPolicyChecked, setIsPolicyChecked] = useState<boolean>(false);

    async function signUp() {
        setErrorMessage("");
        if (!username) {
            setErrorMessage("Username is a required field");
            return;
        }
        if (!email) {
            setErrorMessage("Email is a required field");
            return;
        }
        if (!password) {
            setErrorMessage("Password is a required field");
            return;
        }
        if (!confirmPassword) {
            setErrorMessage("Confirm password is a required field");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Password and confirm password do not match");
            return;
        }
        if (!isPolicyChecked) {
            setErrorMessage(
                "Must accept terms and conditions and privacy policy"
            );
            return;
        }
        // Set loading to true so the Sign Up button becomes disabled
        setLoading(true);

        // Attempt to sign up te user
        const {error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (!error) {
            //Send welcome email
            sendWelcomeEmail(email, username);
        }

        // If the user was created, redirect them to App, otherwise show error message.
        setLoading(false);
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
                        <Box style={styles.registerContainer}>
                            <Box
                                style={{
                                    justifyContent: "flex-start",
                                    width: "100%"
                                }}
                            >
                                <IconButton
                                    colorScheme="black"
                                    variant={"ghost"}
                                    _icon={{
                                        as: Ionicons,
                                        name: "chevron-back"
                                    }}
                                    onPress={() => navigation.goBack()}
                                    style={{
                                        justifyContent: "flex-start",
                                        width: 50
                                    }}
                                />
                            </Box>

                            <Text style={STYLES.AUTH_SCREEN_HEADER_TEXT}>
                                Sign up
                            </Text>
                            {errorMessage && (
                                <Text style={STYLES.AUTH_ERROR_TOOLTIP}>
                                    {errorMessage}
                                </Text>
                            )}
                            <Box style={{width: "100%", gap: 20}}>
                                <AuthTextInput
                                    label={"username"}
                                    icon={<Feather name="user" />}
                                    value={username}
                                    onChange={(value) => setUsername(value)}
                                />
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
                                <AuthTextInput
                                    label={"confirm password"}
                                    icon={<Feather name="lock" />}
                                    value={confirmPassword}
                                    onChange={(value) =>
                                        setConfirmPassword(value)
                                    }
                                    secure={true}
                                />
                            </Box>
                            <Policies onChange={setIsPolicyChecked} />
                            <Button
                                style={STYLES.AUTH_ACTION_BTN}
                                isLoading={loading}
                                spinnerPlacement="end"
                                isLoadingText="Signing Up"
                                onPress={signUp}
                            >
                                Sign up
                            </Button>
                        </Box>
                    </Box>
                </KeyboardAvoidingView>
            </DismissKeyboardView>
        </View>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "50%",
        padding: 20,
        gap: 24
    },
    registerError: {
        fontFamily: FONTS.MULISH_REGULAR,
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 12,
        letterSpacing: 0.2,
        textAlign: "left",
        alignSelf: "flex-start",
        color: COLOURS.NEGATIVE_400
    },
    registerBtn: {
        ...STYLES.BASIC_BORDER,
        width: "100%",
        height: 55,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 8,
        backgroundColor: COLOURS.BRAND_800,
        alignSelf: "baseline",
        transform: [{translateY: 50}]
    },
    registerBtnText: {
        fontFamily: FONTS.MULISH_BOLD,
        fontWeight: "700",
        fontSize: 15,
        lineHeight: 23,
        letterSpacing: 0,
        textAlign: "center",
        color: COLOURS.WHITE,
        zIndex: 10
    }
});

export default Register;
