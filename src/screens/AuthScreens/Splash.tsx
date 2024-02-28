import AuthBackground from "@components/Miscellaneous/Backgrounds/AuthBackground";
import {useSession} from "@hooks/useSession";
import {
    StackActions,
    useFocusEffect,
    useNavigation
} from "@react-navigation/native";
import {
    getFetchStatus,
    getLoginRetrievalStatus,
    getLoginStatus,
    getProfileInfo
} from "@redux_store/user";
import {FetchStatus} from "@util/constants/constraints";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {NavigationProps} from "@util/types/navigation.types";
import {Box} from "native-base";
import React from "react";
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";

const SplashBackground = () => {
    // TODO Flip the default AuthBackground
    return (
        <View style={{position: "absolute"}}>
            <AuthBackground />
        </View>
    );
};

const SplashImage = () => {
    return (
        <Box style={styles.splashImageContainer}>
            <Image
                style={styles.splashImage}
                source={require("../../assets/pizza.png")}
                resizeMode={"cover"}
            />
        </Box>
    );
};

/**
 * @description Splash screen that is displayed between authenticating user and logging them out
 */
function Splash() {
    const session = useSession();
    const navigation = useNavigation<NavigationProps>();

    //Get the user info that was fetched in App.tsx
    const profileInfo = useSelector(getProfileInfo);
    const profileFetchStatus = useSelector(getFetchStatus);
    const loginStatus = useSelector(getLoginStatus);
    const loginStatusLoading = useSelector(getLoginRetrievalStatus);

    useFocusEffect(
        React.useCallback(() => {
            //Only call timeout function after
            //1. profile details are fetched
            //2. Session has been loaded
            //3. Login status has finished loading
            if (
                profileFetchStatus !== FetchStatus.Loading &&
                session.status === "loaded" &&
                !loginStatusLoading
            ) {
                setTimeout(() => {
                    //If login status is not true and no session, then go back to login page
                    if (!loginStatus && !session.session) {
                        navigation.dispatch(StackActions.replace("Login"));
                        return;
                    }

                    //If user has not completed onboarding and is logged in, redirect to taste onboarding screen
                    if (
                        !profileInfo.profileCompletedOnboarding &&
                        session?.session?.user
                    ) {
                        navigation.dispatch(
                            StackActions.replace("TasteOnboard")
                        );
                    }
                    //if user is logged in and passes the above condition, redirect to home
                    else if (session?.session?.user) {
                        navigation.dispatch(StackActions.replace("Home"));
                    }
                }, 1200);
            }
        }, [profileFetchStatus, session, loginStatus])
    );

    const {width, height} = Dimensions.get("screen");

    return (
        <View style={{flex: 1}}>
            <SplashBackground />
            <Box
                style={styles.splashContainer}
                width={width}
                height={height}
            >
                <Text style={styles.splashText}>Foodfolio</Text>
            </Box>
            <SplashImage />
        </View>
    );
}

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10
    },
    splashText: {
        fontFamily: FONTS.MULISH_BLACK,
        fontWeight: "900",
        color: COLOURS.BRAND_800,
        fontSize: 60
    },
    splashImageContainer: {
        position: "absolute",
        left: 0,
        bottom: 0
    },
    splashImage: {
        width: 287,
        height: 316
    }
});

export default Splash;
