import {AppDispatch} from "@/App";
import ScreenView from "@components/ui/views/ScreenView";
import ButtonWithIcons from "@components/Buttons/ButtonWithIcons";
import CustomImage from "@components/CustomImage";
import LoadingIndicator from "@components/LoadingIndicator";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {useEffectAsync} from "@hooks/useEffectAsync";
import {useSession} from "@hooks/useSession";
import {RouteProp} from "@react-navigation/native";
import {setFriendsFetchStatus, TastePref} from "@redux_store/user";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {FetchStatus} from "@util/constants/constraints";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {
    NavigationProps,
    PublicProfileParams
} from "@util/types/navigation.types";
import {UserListResponse} from "@util/types/supabase.types";
import {FlatList, IconButton} from "native-base";
import React, {Fragment, useCallback, useRef, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useDispatch} from "react-redux";
import {Feather, Entypo, MaterialIcons} from "@expo/vector-icons";
import {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import SheetModalOptions from "@components/Modals/SheetModalOptions";
import {displayEventAlert} from "@redux_store/util";
import ContactSupportSheet from "@components/Modals/ContactSupportSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import {snapToIndex} from "@util/BottomSheetFuncs";

export type PublicProfileProps = {
    route?: RouteProp<
        {
            params: PublicProfileParams;
        },
        "params"
    >;
    navigation: NavigationProps;
};

/**
 * @description Public page of user profiles, navigated from Friends tab search
 * @see Friends.tsx
 */
function PublicProfile({route, navigation}: PublicProfileProps) {
    const session = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const {profileInfo} = route!.params;

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    //Points for the bottom sheet to snap to, points should be sorted from bottom to top
    //const snapPoints = useMemo(() => ["25%"], []);

    //State to open more modal state
    const [profileOptionsModal, setProfileOptionsModal] =
        useState<boolean>(false);
    //State for the users taste preferences
    const [tastePrefs, setTastePrefs] = useState<TastePref[]>([]);
    //State for user lists
    const [userLists, setUserLists] = useState<UserListResponse[]>([]);
    //State indicating if the user is being followed by the current session user
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [reportModal, setReportModal] = useState<boolean>(false);

    useEffectAsync(async () => {
        if (profileInfo) {
            //Get the taste profile of user
            const profileTastePrefs = await supabaseCall(
                "get_profile_taste_pref",
                {input_profile_id: profileInfo.profileId}
            );
            setTastePrefs(profileTastePrefs);

            //Get the lists of user
            const lists = await supabaseCall("get_lists", {
                input_profile_id: profileInfo.profileId
            });
            setUserLists(lists);

            //Check if user is being followed by the logged in session user so we can display the right UI
            const isFollowedRes = await supabaseCall("is_user_followed", {
                input_follower_profile_id: session.profileId,
                input_following_profile_id: profileInfo.profileId
            });

            setIsFollowed(isFollowedRes);
            setLoaded(true);
        }
    }, []);

    /**
     * @description Open list info page of the clicked list
     * @param listId List id to identify the list being opened
     * @param listShareId Unique uuid of the list so it can be shared
     */
    function goToListInfo(listId: number, listShareId: string) {
        navigation.navigate("ListInfo", {
            listId,
            listShareId,
            profileId: profileInfo.profileId
        });
    }

    async function unfollowUser() {
        await supabaseCall("unfollow_user", {
            input_follower_profile_id: session.profileId,
            input_unfollowing_profile_id: profileInfo.profileId
        });
    }

    /**
     * @description Handle the following and unfollowing of a user
     */
    async function followButtonHandler() {
        if (isFollowed) {
            //
            unfollowUser();
        } else {
            //
            await supabaseCall("follow_user", {
                follower_profile_id: session.profileId,
                following_profile_id: profileInfo.profileId
            });
        }
        dispatch(setFriendsFetchStatus(FetchStatus.Idle));
        setIsFollowed(!isFollowed);
    }

    /**
     * @description Block user and unfollow
     */
    async function blockUser() {
        //Create a block relation on backend and unfollow user
        await supabaseCall("block_user", {
            in_blocker_id: session.profileId,
            in_blocked_id: profileInfo.profileId
        });

        //Set to idle status
        dispatch(setFriendsFetchStatus(FetchStatus.Idle));
        //Navigate back to friends page
        navigation.navigate("Friends");

        //Display event alert
        dispatch(
            displayEventAlert({
                show: true,
                text: `User Blocked`,
                iconName: "thumbs-up"
            })
        );
    }

    const renderBackdrop = useCallback(
        (backdropProps) => (
            <BottomSheetBackdrop
                {...backdropProps}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    function closeModal() {
        setReportModal(false);
        setProfileOptionsModal(false);
    }

    return (
        <ScreenView
            title=""
            leftIcon={
                <IconButton
                    colorScheme="black"
                    variant={"ghost"}
                    size={22}
                    _icon={{
                        as: Ionicons,
                        name: "arrow-back-sharp",
                        size: 27
                    }}
                    onPress={() => navigation.goBack()}
                />
            }
            rightIcon={
                <IconButton
                    colorScheme={"black"}
                    key={"ghost"}
                    variant={"ghost"}
                    _icon={{
                        as: Feather,
                        name: "more-horizontal"
                    }}
                    onPress={() => setProfileOptionsModal(true)}
                />
            }
        >
            {profileInfo ? (
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10
                        }}
                    >
                        {/*Avatar image*/}
                        <CustomImage
                            resizeMode={"cover"}
                            style={styles.avatar}
                            source={{
                                uri: profileInfo.avatar
                            }}
                        />
                        <View style={{gap: 3}}>
                            {/*List Name*/}
                            <Text style={styles.usernameText}>
                                {profileInfo.username}
                            </Text>
                            {/*List follower count and timestamp*/}
                            {/* <Text style={styles.followers_count_text}>374 followers</Text> */}
                            {/* <Text style={styles.last_updated_text}>
                                Joined on{" "}
                                {profileInfo.profileJoined}
                            </Text> */}
                            {/*Avatar*/}
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 5,
                                    alignItems: "center"
                                }}
                            ></View>
                        </View>
                    </View>

                    <Text style={{marginVertical: 8}}>{profileInfo.bio}</Text>

                    <View style={{width: "35%", marginVertical: 8}}>
                        <ButtonWithIcons
                            buttonStyle={styles.followButton}
                            leftIcon={
                                <FontAwesome
                                    name={isFollowed ? "heart" : "heart-o"}
                                    size={16}
                                    color={COLOURS.BRAND_600}
                                />
                            }
                            rightIcon={<></>}
                            textStyle={styles.followButtText}
                            onPress={followButtonHandler}
                        >
                            {isFollowed ? "Following" : "Follow"}
                        </ButtonWithIcons>
                    </View>

                    {/*Taste profile section*/}
                    <View style={{gap: 15}}>
                        <Text
                            style={{
                                fontWeight: "600",
                                fontSize: 20
                            }}
                        >
                            Taste Profile
                        </Text>
                        <FlatList
                            data={tastePrefs}
                            keyExtractor={(item) => item.tasteId.toString()}
                            renderItem={({item}) => (
                                <View style={styles.tastePref}>
                                    <Text
                                        style={{
                                            color: COLOURS.GRAY_700
                                        }}
                                    >
                                        {item.tasteName}
                                    </Text>
                                </View>
                            )}
                            numColumns={3}
                            scrollEnabled={false}
                        />
                    </View>

                    {/*Taste profile section*/}
                    <View style={{gap: 15}}>
                        <Text
                            style={{
                                fontWeight: "600",
                                fontSize: 20
                            }}
                        >
                            {`${profileInfo.username}'s lists`}
                        </Text>
                        <FlatList
                            data={userLists}
                            keyExtractor={(item) => item.listId.toString()}
                            contentContainerStyle={{gap: 12}}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    key={item.listId}
                                    style={styles.listContainer}
                                    onPress={() =>
                                        goToListInfo(
                                            item.listId,
                                            item.listShareId
                                        )
                                    }
                                >
                                    <View>
                                        <Text style={styles.listName}>
                                            {item.listName}
                                        </Text>
                                        <Text style={{}}>
                                            {item.listDescription}
                                        </Text>
                                        <Text
                                            style={styles.listSubText}
                                        >{`${item.listPlacesCount} places`}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            horizontal={true}
                        />
                    </View>
                </View>
            ) : (
                <LoadingIndicator />
            )}
            {/*Profile Options Modal*/}
            {profileOptionsModal && (
                <BottomSheet
                    ref={bottomSheetRef}
                    onClose={closeModal}
                    backdropComponent={renderBackdrop}
                    snapPoints={["25%", "55%"]}
                    enablePanDownToClose={true}
                >
                    <Fragment>
                        {reportModal ? (
                            <ContactSupportSheet
                                email={session.session.user.email}
                                sheetHeader="Report User"
                                alertText="User Reported"
                                closeSheet={closeModal}
                            />
                        ) : (
                            <SheetModalOptions
                                closeModal={() => setProfileOptionsModal(false)}
                                sheetTitle={"Options"}
                            >
                                <Fragment>
                                    <ButtonWithIcons
                                        buttonStyle={{gap: 10}}
                                        textStyle={styles.optionsText}
                                        leftIcon={
                                            <Entypo
                                                name="block"
                                                size={24}
                                                color={COLOURS.BRAND_800}
                                            />
                                        }
                                        rightIcon={<></>}
                                        onPress={blockUser}
                                    >
                                        Block User
                                    </ButtonWithIcons>
                                    <ButtonWithIcons
                                        buttonStyle={{gap: 10}}
                                        textStyle={styles.optionsText}
                                        leftIcon={
                                            <MaterialIcons
                                                name="report"
                                                size={24}
                                                color={COLOURS.BRAND_800}
                                            />
                                        }
                                        rightIcon={<></>}
                                        onPress={() => {
                                            setReportModal(true);
                                            snapToIndex(bottomSheetRef, 1);
                                        }}
                                    >
                                        Report User
                                    </ButtonWithIcons>
                                </Fragment>
                            </SheetModalOptions>
                        )}
                    </Fragment>
                </BottomSheet>
            )}
        </ScreenView>
    );
}

export default PublicProfile;

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 50,
        height: 72,
        width: 72,
        marginRight: 10,
        marginBottom: 10
    },
    usernameText: {
        fontSize: 21,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: 0,
        color: COLOURS.GRAY_800
    },
    optionsText: {
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "Mulish_500Medium",
        color: COLOURS.BRAND_800
    },
    // followers_count_text: {
    //     fontSize: 14,
    //     fontWeight: "400",
    //     letterSpacing: 0.2,
    //     lineHeight: 16,
    //     color: COLORS.gray500
    // },
    followButton: {
        width: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 4,
        borderRadius: 16,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#601D00",
        backgroundColor: "transparent",
        color: COLOURS.BRAND_600
        // marginRight: 10,
    },
    followButtText: {
        color: COLOURS.BRAND_600
    },
    listContainer: {
        width: 200,
        height: 100,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOURS.GRAY_200
    },
    listName: {
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 23,
        letterSpacing: 0,
        color: COLOURS.GRAY_800
    },
    listSubText: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0.2,
        color: COLOURS.GRAY_400
    },
    tasteProfile: {
        borderRadius: 8
    },
    tastePref: {
        marginRight: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLOURS.GRAY_800,
        padding: 6,
        borderRadius: 10
    }
});
