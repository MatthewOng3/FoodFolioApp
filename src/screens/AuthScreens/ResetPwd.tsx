import DismissKeyboardView from "@components/DismissKeyboard";
import AuthBackground from "@components/Miscellaneous/Backgrounds/AuthBackground";
import AuthTextInput from "@components/Miscellaneous/Interactive/Inputs/AuthTextInput";
import {Feather} from "@expo/vector-icons";
import {useSession} from "@hooks/useSession";
import {
    RouteProp,
    useFocusEffect,
    useNavigation
} from "@react-navigation/native";
import {STYLES} from "@util/constants/styles/styles.constants";
import {Box, Button} from "native-base";
import React, {useState} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {supabase} from "@database/supabase";
import {
    NavigationProps,
    ResetPwdScreenParams
} from "@util/types/navigation.types";

interface ResetPwdProps {
    route?: RouteProp<{params: ResetPwdScreenParams}, "params">;
}

function ResetPwd({route}: ResetPwdProps) {
    const navigation = useNavigation<NavigationProps>();

    const {session} = useSession();

    const accessToken = route?.params?.access_token;
    const refreshToken = route?.params?.refresh_token;
    const errorCode = route?.params?.error_code;

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    useFocusEffect(() => {
        setErrorMessage("");
        if (session?.user) return;

        const redirectToForgotPwd = () => {
            setErrorMessage(
                "That reset password link is invalid or has expired. Redirecting you to create a new one shortly"
            );
            setTimeout(() => {
                navigation.navigate("ForgotPwd");
            }, 3000);
        };

        // If no reset code was provided, redirect the user to the Forget Password screen
        if (errorCode || !accessToken || !refreshToken) {
            redirectToForgotPwd();
            return;
        }

        // If a valid supabase session cannot be obtained, redirect the user to the Forget Password screen
        supabase.auth
            .setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            })
            .then((value) => {
                if (value.error) {
                    redirectToForgotPwd();
                }
            })
            .catch(() => redirectToForgotPwd());
    });

    const resetPassword = async () => {
        setErrorMessage("");

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

        // Set loading to true so the send link button becomes disabled
        setLoading(true);

        const {error} = await supabase.auth.updateUser({password: password});
        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        navigation.navigate("Home");
    };

    return (
        <View style={{flex: 1}}>
            <DismissKeyboardView>
                <KeyboardAvoidingView
                    behavior="height"
                    style={{flex: 1}}
                >
                    <Box style={{flex: 1}}>
                        <AuthBackground />
                        <Box style={styles.forgotPwdContainer}>
                            <Text style={STYLES.AUTH_SCREEN_HEADER_TEXT}>
                                Reset password
                            </Text>
                            <Text
                                style={{
                                    ...STYLES.AUTH_FOOTER_TEXT,
                                    alignSelf: "flex-start"
                                }}
                            >
                                Please enter a new password.
                            </Text>
                            {errorMessage && (
                                <Text style={STYLES.AUTH_ERROR_TOOLTIP}>
                                    {errorMessage}
                                </Text>
                            )}
                            <Box style={{width: "100%", gap: 20}}>
                                <AuthTextInput
                                    label={"new password"}
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
                            <Button
                                style={STYLES.AUTH_ACTION_BTN}
                                isLoading={loading}
                                spinnerPlacement="end"
                                isLoadingText="Updating password"
                                onPress={resetPassword}
                            >
                                Reset password
                            </Button>
                        </Box>
                    </Box>
                </KeyboardAvoidingView>
            </DismissKeyboardView>
        </View>
    );
}

const styles = StyleSheet.create({
    forgotPwdContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "50%",
        padding: 20,
        gap: 24
    }
});

export default ResetPwd;
