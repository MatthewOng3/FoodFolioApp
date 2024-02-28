import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UserPreview} from "@screens/Friends";
import {FetchStatus} from "@util/constants/constraints";
import {decode} from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import {Alert} from "react-native";
import {supabase} from "@database/supabase";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {RootState} from "./store";

/*Types*/
export interface Coordinates {
    lat: number;
    lng: number;
}

export type TastePref = {
    tasteId: number;
    tasteName: string;
    tasteType: string;
    isChosen: boolean;
    existBeforeUpdate: boolean;
};

export type ProfileInfo = {
    profileId: number;
    profileUsername: string;
    profileAvatar: string;
    profileBio: string;
    profileTastePrefs: TastePref[];
    profileJoined: string;
    profileEmail: string;
    profileCompletedOnboarding: boolean;
};

interface UserSlice {
    location: Coordinates; //Location of user
    locationRetrievalStatus: FetchStatus; //Satus of location retrieval
    isLoggedIn: boolean; //Bool value if user is currently logged in
    loginLoading: boolean; //Status for loading login
    profileInfo: ProfileInfo;
    fetchStatus: FetchStatus;
    friendsInfo: {friends: UserPreview[]; friendsNum: number};
    friendsFetchStatus: FetchStatus;
}

/**
 * @description Get user's location using expo location library, if permission not granted navigate away to another page
 * @returns Coordinates of user's location
 * @see Discover
 */
export const setUserLocation = createAsyncThunk(
    "user/setUserLocation",
    async (payload, {rejectWithValue}) => {
        try {
            const {granted} = await Location.getForegroundPermissionsAsync();

            //If permission has not been granted before, request permission
            if (!granted) {
                const {status} =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    //setErrorMsg('Permission to access location was denied');
                    return;
                }
            }

            const location: Location.LocationObject =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });
            return location;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Check if user has already logged in previously
 * @see App
 */
export const checkUserAuth = createAsyncThunk(
    "user/checkUserAuth",
    async (payload, {rejectWithValue}) => {
        try {
            //const token = await AsyncStorage.getItem("user_token")
            const {data} = await supabase.auth.getSession();
            return !!data.session;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Logout User and clear storage
 * @see Profile
 */
export const logOutUser = createAsyncThunk("user/logOutUser", async () => {
    try {
        const {error} = await supabase.auth.signOut();
        await AsyncStorage.clear();

        //If no error signing out
        if (!error) {
            return true;
        }

        return false;
    } catch (err) {
        return false;
    }
});

/**
 * @description Retrieve user info
 * @see Profile
 * @returns UserInfo object
 */
export const retrieveUserInfo = createAsyncThunk(
    "user/retrieveUserInfo",
    async ({profileId}: {profileId: number}, {rejectWithValue}) => {
        try {
            if (!profileId) return;

            //Get user profile info
            const userInfo = await supabaseCall("get_user_info", {
                input_profile_id: profileId
            });

            //Get all taste preferences
            const tastePrefs = await supabaseCall(
                "get_all_taste_pref",
                undefined
            );

            //Check local storage first if date joined has been stored
            let dateJoined = await AsyncStorage.getItem("dateJoined");

            //If storage date joined doesnt exist then retrieve from database
            if (!dateJoined) {
                dateJoined = await supabaseCall("get_date_joined", {
                    input_profile_id: profileId
                });
                await AsyncStorage.setItem("dateJoined", dateJoined);
            }

            //Create a new object of all taste prefs indicating if they existed before updating and isChosen
            //represents the current selection state
            const profileTastePrefs = tastePrefs.map((taste) => {
                if (
                    userInfo.profileTastePrefs.some(
                        (userTaste) => userTaste.tasteId === taste.tasteId
                    )
                ) {
                    return {...taste, isChosen: true, existBeforeUpdate: true};
                }

                return {...taste, isChosen: false, existBeforeUpdate: false};
            });

            return userInfo
                ? {
                      ...userInfo,
                      profileTastePrefs: profileTastePrefs,
                      profileJoined: dateJoined
                  }
                : rejectWithValue("Error fetching user info");
        } catch (err) {
            return false;
        }
    }
);

/**
 * @description
 * @see Profile
 */
export const updateProfileInfo = createAsyncThunk(
    "user/updateProfileInfo",
    async ({
        profileId,
        newName,
        newBio,
        newTastes,
        deletingTaste
    }: {
        profileId: number;
        newName: string;
        newBio: string;
        newTastes: number[];
        deletingTaste: number[];
    }) => {
        try {
            if (!profileId) return;

            const result = await supabaseCall("update_profile", {
                input_profile_id: profileId,
                new_profile_name: newName,
                new_profile_bio: newBio,
                new_taste_pref_ids: newTastes,
                del_taste_pref_ids: deletingTaste
            });

            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
);

export const updateProfilePic = createAsyncThunk(
    "user/updateProfilePic",
    async ({
        userId,
        newProfilePic
    }: {
        userId: string;
        newProfilePic: string;
    }) => {
        try {
            if (!userId) return;

            const filepath = `${userId}`;

            const base64String = await FileSystem.readAsStringAsync(
                newProfilePic,
                {
                    encoding: "base64"
                }
            );

            const contentType = "image/png";

            const {
                data: {path},
                error
            } = await supabase.storage
                .from("profile_avatars")
                .upload(filepath, decode(base64String), {
                    contentType,
                    upsert: true
                });

            if (error) {
                Alert.alert("Unable to upload profile image");
                return;
            }

            const {
                data: {publicUrl}
            } = supabase.storage.from("profile_avatars").getPublicUrl(path);

            await supabaseCall("update_profile_url", {
                input_user_id: userId,
                input_profile_url: publicUrl
            });

            return;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
);

/**
 * @description Retrieve the friends of a user
 */
export const retrieveUserFriends = createAsyncThunk(
    "user/retrieveUserFriends",
    async ({profileId}: {profileId: number}) => {
        try {
            const friendsRes = await supabaseCall("get_user_friends", {
                input_profile_id: profileId
            });

            if (friendsRes) {
                return {friends: friendsRes, friendsNum: friendsRes.length};
            }
            return {friends: [], friendsNum: 0};
        } catch (err) {
            console.error(err);
            return false;
        }
    }
);

const initialState: UserSlice = {
    location: {lat: 0, lng: 0},
    locationRetrievalStatus: FetchStatus.Idle,
    isLoggedIn: false,
    fetchStatus: FetchStatus.Idle,
    loginLoading: false,
    profileInfo: {
        profileId: 0,
        profileUsername: "",
        profileAvatar: "",
        profileBio: "",
        profileJoined: "",
        profileEmail: "",
        profileCompletedOnboarding: false,
        profileTastePrefs: []
    },
    friendsInfo: {friends: [], friendsNum: 0},
    friendsFetchStatus: FetchStatus.Idle
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setProfileFetchStatus: (state, {payload}) => {
            state.fetchStatus = payload;
        },
        setFriendsFetchStatus: (state, {payload}) => {
            state.friendsFetchStatus = payload;
        },
        setLoginStatus: (state, {payload}) => {
            state.isLoggedIn = payload;
        }
    },
    extraReducers(builder) {
        /**
         * @description Getting user location
         */
        builder
            .addCase(setUserLocation.pending, (state) => {
                state.locationRetrievalStatus = FetchStatus.Loading;
            })
            .addCase(setUserLocation.fulfilled, (state, {payload}) => {
                state.locationRetrievalStatus = FetchStatus.Success;
                state.location.lat = payload ? payload.coords.latitude : 0;
                state.location.lng = payload ? payload.coords.longitude : 0;
            })
            .addCase(setUserLocation.rejected, (state) => {
                state.locationRetrievalStatus = FetchStatus.Failed;
            });
        /**
         * @description Cases for handling checking for user auth
         */
        builder
            .addCase(checkUserAuth.pending, (state) => {
                state.loginLoading = true;
            })
            .addCase(checkUserAuth.fulfilled, (state, {payload}) => {
                state.isLoggedIn = payload;
                state.loginLoading = false;
            })
            .addCase(checkUserAuth.rejected, (state) => {
                state.isLoggedIn = false;
                state.loginLoading = false;
            });
        /**
         * @description Logging out user
         */
        builder
            .addCase(logOutUser.pending, (state) => {
                state.loginLoading = true;
            })
            .addCase(logOutUser.fulfilled, () => {
                return initialState;
            })
            .addCase(logOutUser.rejected, (state) => {
                state.loginLoading = false;
            });
        /**
         * @description Getting user friends
         */
        builder
            .addCase(retrieveUserFriends.pending, (state) => {
                state.friendsFetchStatus = FetchStatus.Loading;
            })
            .addCase(retrieveUserFriends.fulfilled, (state, {payload}) => {
                if (payload) {
                    state.friendsInfo = {...payload};
                }

                state.friendsFetchStatus = FetchStatus.Success;
            })
            .addCase(retrieveUserFriends.rejected, (state) => {
                state.friendsFetchStatus = FetchStatus.Failed;
            });

        /**
         * @description Cases for retrieving user info
         */
        builder
            .addCase(retrieveUserInfo.pending, (state) => {
                state.fetchStatus = FetchStatus.Loading;
            })
            .addCase(retrieveUserInfo.fulfilled, (state, {payload}) => {
                //Add user info
                if (payload) {
                    state.profileInfo = {...payload};
                    state.fetchStatus = FetchStatus.Success;
                }
            })
            .addCase(retrieveUserInfo.rejected, (state) => {
                state.fetchStatus = FetchStatus.Failed;
            });
        /**
         * @description Cases for retrieving user info
         */
        builder
            .addCase(updateProfileInfo.pending, (state) => {
                state.fetchStatus = FetchStatus.Loading;
            })
            .addCase(updateProfileInfo.fulfilled, (state) => {
                state.fetchStatus = FetchStatus.Idle;
            })
            .addCase(updateProfileInfo.rejected, (state) => {
                state.fetchStatus = FetchStatus.Failed;
            });
    }
});

export const getLoginStatus = (store: RootState) => store.user.isLoggedIn;
export const getUserLocation = (store: RootState) => store.user.location;
export const getLocationRetrievalStatus = (state: UserSlice) =>
    state.locationRetrievalStatus;
export const getLoginRetrievalStatus = (store: RootState) =>
    store.user.loginLoading;
export const getProfileInfo = (store: RootState) => store.user.profileInfo;
export const getFetchStatus = (store: RootState) => store.user.fetchStatus;
export const getUserFriends = (store: RootState) => store.user.friendsInfo;
export const friendsFetchStatus = (store: RootState) =>
    store.user.friendsFetchStatus;

export const {setLoginStatus, setFriendsFetchStatus, setProfileFetchStatus} =
    userSlice.actions;

export default userSlice.reducer;
