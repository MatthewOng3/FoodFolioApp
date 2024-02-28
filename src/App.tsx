import {
    Mulish_200ExtraLight,
    Mulish_300Light,
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
    Mulish_900Black
} from "@expo-google-fonts/mulish";
import {
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
} from "@expo-google-fonts/inter";
import {Roboto_400Regular, Roboto_500Medium} from "@expo-google-fonts/roboto";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {
    getStateFromPath,
    LinkingOptions,
    NavigationContainer
} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useFonts} from "expo-font";

import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";

import {extendTheme, NativeBaseProvider} from "native-base";
import React, {useEffect} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Provider, useDispatch, useSelector} from "react-redux";

// I was setting up graph ql halfway LOL
import {SessionProvider} from "./contexts/SessionContext";
import {useEffectAsync} from "./hooks/useEffectAsync";
import {useSession} from "./hooks/useSession";
import {store} from "./redux_store/store";
import {
    getFetchStatus,
    retrieveUserInfo,
    setUserLocation
} from "./redux_store/user";
import ForgotPwd from "./screens/AuthScreens/ForgotPwd";
import Login from "./screens/AuthScreens/Login";

//Icons
//Screens
import Register from "./screens/AuthScreens/Register";
import ResetPwd from "./screens/AuthScreens/ResetPwd";
import Splash from "./screens/AuthScreens/Splash";
import Welcome from "./screens/AuthScreens/Welcome";
import Home from "./screens/Home";
import ListInfo from "./screens/ListInfo";
import Place from "./screens/Place";
import PublicProfile from "./screens/PublicProfile";
import TasteOnboard from "./screens/TasteOnboard";
import {StackParamList} from "./util/types/navigation.types";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
export type AppDispatch = typeof store.dispatch;

const prefix = Linking.createURL("/");

const Stack = createNativeStackNavigator();
// const testWidth = 828;
// const testHeight = 1792;

/**
 * @description Handle whether to display the authenticated or non authenticated stack to users, performs setup before app loads
 *
 */
function Main() {
    const {status, profileId, session} = useSession();
    const dispatch: AppDispatch = useDispatch();

    //Get the user info
    const profileFetchStatus = useSelector(getFetchStatus);

    const [fontsLoaded] = useFonts({
        Mulish_200ExtraLight,
        Mulish_300Light,
        Mulish_400Regular,
        Mulish_500Medium,
        Mulish_600SemiBold,
        Mulish_700Bold,
        Mulish_800ExtraBold,
        Mulish_900Black,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
        Roboto_400Regular,
        Roboto_500Medium
    });

    // Boolean for if user is logged in or not
    const userIsLoggedIn = !!session?.user;

    const linking: LinkingOptions<StackParamList> = {
        prefixes: [prefix, "https://*.foodfolioapp.com"],
        config: {
            initialRouteName: "Splash",
            screens: {
                ResetPwd: {
                    path: "reset_password"
                },
                Splash: "*"
            }
        },
        getStateFromPath: (path, options) => {
            // Supabase redirects and appends the query params with '#' instead of '?' for some reason.
            const editedPath = path.replace(
                "reset_password#",
                "reset_password?"
            );
            return getStateFromPath(editedPath, options);
        }
    };

    //Set up user location and retrieve profile data
    useEffectAsync(async () => {
        //When session is true, then retrieve user info, so in home page, can decide if needed taste onboard or not
        if (session) {
            dispatch(
                retrieveUserInfo({
                    profileId: profileId
                })
            );
            //Retrieve user's location
            await dispatch(setUserLocation());
        }
    }, [session, profileId]);

    //App is only ready when fonts are loaded, and profile has been fetched
    const appIsReady = fontsLoaded && status === "loaded" && profileFetchStatus;

    useEffect(() => {
        //When app is ready, hide the splash screen and set app loaded status to true
        if (appIsReady) {
            SplashScreen.hideAsync();
            return;
        }
    }, [appIsReady]);

    //If app is not ready return null
    if (!appIsReady) {
        return null;
    }

    // TODO Look at https://reactnavigation.org/docs/auth-flow rather than our custom splash screen
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {/* The following screens can be accessed by either unauthenticated / authenticated users*/}
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                />
                <Stack.Screen
                    name="ResetPwd"
                    component={ResetPwd}
                />
                {userIsLoggedIn ? (
                    // Authenticated Screens
                    <>
                        <Stack.Screen
                            name="Home"
                            component={Home}
                        />
                        <Stack.Screen
                            name="ListInfo"
                            component={ListInfo}
                        />
                        <Stack.Screen
                            name="Place"
                            component={Place}
                        />
                        <Stack.Screen
                            name="PublicProfile"
                            component={PublicProfile}
                        />
                        <Stack.Screen
                            name="TasteOnboard"
                            component={TasteOnboard}
                        />
                    </>
                ) : (
                    // Unauthenticated Screens
                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={Welcome}
                        />
                        <Stack.Screen
                            name="Register"
                            component={Register}
                        />
                        <Stack.Screen
                            name="Login"
                            component={Login}
                        />
                        <Stack.Screen
                            name="ForgotPwd"
                            component={ForgotPwd}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    const theme = extendTheme({
        colors: {
            app: {
                orange: "#F19811",
                lime: "#D7E251",
                dark: "#888A87"
            },
            orange: {
                100: "#F19811"
            },
            black: {
                600: "#000000"
            }
        }
    });

    return (
        <Provider store={store}>
            <StatusBar style="dark" />
            <NativeBaseProvider
                theme={theme}
                isSSR={false}
            >
                <SessionProvider>
                    <GestureHandlerRootView style={{flex: 1}}>
                        <BottomSheetModalProvider>
                            <Main />
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </SessionProvider>
            </NativeBaseProvider>
        </Provider>
    );
}
