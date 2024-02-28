import DismissKeyboardView from "@components/DismissKeyboard";
import AuthBackground from "@components/Miscellaneous/Backgrounds/AuthBackground";
import AuthTextInput from "@components/Miscellaneous/Interactive/Inputs/AuthTextInput";
import {supabase} from "@database/supabase";
import {Feather} from "@expo/vector-icons";
import {STYLES} from "@util/constants/styles/styles.constants";
import * as Linking from "expo-linking";
import {Box, Button} from "native-base";
import React, {useState} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";

function ForgotPassword() {
    const [email, setEmail] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    const sendPwdResetEmail = async () => {
        setErrorMessage("");
        if (!email) {
            setErrorMessage("Email is a required field");
            return;
        }

        // Set loading to true so the send link button becomes disabled
        setLoading(true);

        // TODO Update to http://foodfolioapp.com/ domain when universal links are setup
        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: Linking.createURL("reset_password")
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage(
                "A password reset email has been sent to the provided email."
            );
        }

        setLoading(false);
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
                                Enter the email address associated with your
                                Foodfolio account and we’ll send you a link to
                                reset your password.
                            </Text>
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
                                />
                            </Box>
                            <Button
                                style={STYLES.AUTH_ACTION_BTN}
                                isLoading={loading}
                                spinnerPlacement="end"
                                isLoadingText="Sending link"
                                onPress={sendPwdResetEmail}
                            >
                                Send link
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

export default ForgotPassword;
