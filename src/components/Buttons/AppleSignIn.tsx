import {supabase} from "@database/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import React from "react";
import {Platform, StyleSheet, View} from "react-native";

function AppleSignIn() {
    async function appleSignIn() {
        try {
            //Sign in with apple Auth
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });

            //Sign in via supabase auth
            if (credential.identityToken) {
                await supabase.auth.signInWithIdToken({
                    provider: "apple",
                    token: credential.identityToken
                });
            }
        } catch (e) {
            console.log(e);
            if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
            } else {
                // handle other errors
            }
        }
    }

    if (Platform.OS === "ios") {
        return (
            <View style={styles.container}>
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={
                        AppleAuthentication.AppleAuthenticationButtonType
                            .SIGN_IN
                    }
                    buttonStyle={
                        AppleAuthentication.AppleAuthenticationButtonStyle
                            .WHITE_OUTLINE
                    }
                    cornerRadius={218}
                    style={styles.button}
                    onPress={appleSignIn}
                />
            </View>
        );
    }
}

export default AppleSignIn;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    button: {
        width: "65%",
        height: 50
    }
});
