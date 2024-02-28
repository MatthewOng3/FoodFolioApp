import ButtonWithIcons from "@components/Buttons/ButtonWithIcons";
import CustomImage from "@components/CustomImage";
import LoadingIndicator from "@components/LoadingIndicator";
import ConfirmationTextModal from "@components/Modals/ConfirmationTextModal";

import CustomBottomModal from "@components/Modals/CustomBottomModal";
import PhotoModal from "@components/Modals/PhotoModal";
import SheetModalOptions from "@components/Modals/SheetModalOptions";
import ScreenView from "@components/ui/views/ScreenView";
import {
    Feather,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons
} from "@expo/vector-icons";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import useRefresh from "@hooks/useRefresh";

import { useSession } from "@hooks/useSession";

import { AppDispatch } from "@redux_store/store";
import {
    getFetchStatus,
    getProfileInfo,
    logOutUser,
    retrieveUserInfo,
    TastePref,
    updateProfileInfo
} from "@redux_store/user";
import { displayEventAlert } from "@redux_store/util";
import { deleteUser } from "@util/apis/users/users.api.util";
import { snapToIndex } from "@util/BottomSheetFuncs";
import { FetchStatus, TasteType } from "@util/constants/constraints";
import { COLOURS } from "@util/constants/styles/colours.constants";
import { FONTS } from "@util/constants/styles/fonts.constants";
import { COLORS } from "@util/constants/theme";
import {
    Button,
    FlatList,
    IconButton,
    Input,
    ScrollView,
    TextArea
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TastePrefToggle from "@components/Buttons/TastePrefToggle";
import ConfirmationModal from "@components/Modals/ConfirmationModal";
import styled from "styled-components/native";
import ContactSupportSheet from "@components/Modals/ContactSupportSheet";

/**
 * @description Profile page for users
 */
function Profile() {
    const session = useSession();
    const dispatch = useDispatch<AppDispatch>();
    //Bottom sheet props
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    //Points for the bottom sheet to snap to, points should be sorted from bottom to top
    const { dismiss } = useBottomSheetModal();

    //Get the user info
    const profileInfo = useSelector(getProfileInfo);
    //const eventAlert = useSelector(getEventAlertStatus);

    const fetchStatus = useSelector(getFetchStatus);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [modalState, setModalState] = useState({
        settings: false,
        photo: false,
        confirmation: false,
        accDel: false,
        support: false
    });

    //Status indicating in editing profile modes
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [delAccConfirmModal, setDelAccConfirmModal] =
        useState<boolean>(false);

    //Modal state for logging out
    const [isDiscard, setIsDiscard] = useState<boolean>(false);
    //Modal for uploading picture
    const [profileUri, setProfileUri] = useState<string>(
        profileInfo.profileAvatar
    );

    //State for cuisine prefs
    const [cuisineTastes, setCuisineTastes] = useState<TastePref[]>([]);
    //State for dietary prefs
    const [dietary, setDietary] = useState<TastePref[]>([]);

    /**
     * @description Log user out, removing any cookies or local storage
     */
    async function logOut() {
        dispatch(logOutUser());
    }

    //Retrieve user info
    useEffect(() => {
        if (fetchStatus === FetchStatus.Idle) {
            setIsLoading(true);
            dispatch(
                retrieveUserInfo({
                    profileId: session.profileId
                })
            );
        }
    }, [isEditingProfile, fetchStatus]);

    //Only when fetch data has finished then set the component states
    useEffect(() => {
        if (profileInfo && fetchStatus === FetchStatus.Success) {
            setProfileStates();
        }
    }, [profileInfo, fetchStatus]);

    const [username, setUsername] = useState<string>(
        profileInfo?.profileUsername
    );
    const [bio, setBio] = useState<string>(profileInfo?.profileBio);

    /**
     * @description Function to set all the relevant states to display in the profile page
     */
    function setProfileStates() {
        //Split up the taste profile into cuisines and dietary
        const profilePrefs = profileInfo.profileTastePrefs.reduce(
            (accum, curr) => {
                accum[
                    curr.tasteType === TasteType[TasteType.Cuisine]
                        ? "cuisines"
                        : "dietary"
                ].push(curr);
                return accum;
            },
            { cuisines: [], dietary: [] }
        );

        setCuisineTastes(profilePrefs.cuisines);
        setDietary(profilePrefs.dietary);
        setUsername(profileInfo.profileUsername);
        setBio(profileInfo.profileBio);
        setIsLoading(false);
    }

    /**
     * @description Call back function that is triggered when user selects or deselects a cuisine
     * @param tasteId Taste Id of the taste preference
     */
    function cuisineEditHandler(tasteId: number) {
        const newCuisines = cuisineTastes.map((taste) => {
            if (taste.tasteId === tasteId) {
                return { ...taste, isChosen: !taste.isChosen };
            }
            return taste;
        });
        setCuisineTastes(newCuisines);
    }

    /**
     * @description Call back function that is triggered when user selects or deselects a dietary
     * @param tasteId Taste Id of the taste preference
     */
    function dietaryEditHandler(tasteId: number) {
        const newDietary = dietary.map((taste) => {
            if (taste.tasteId === tasteId) {
                return { ...taste, isChosen: !taste.isChosen };
            }
            return taste;
        });
        setDietary(newDietary);
    }

    /**
     * @description Save function handler to update the profile's name and bio
     */
    function saveEditedProfile() {
        const tastePrefs = cuisineTastes.concat(dietary);

        const newTastePrefs = tastePrefs.reduce(
            (accum, curr) => {
                //If did not exist before and it is now chosen then it is a new relation
                if (!curr.existBeforeUpdate && curr.isChosen) {
                    accum["incoming"].push(curr.tasteId);
                }
                //If it existed before and it is not chosen means removing
                else if (curr.existBeforeUpdate && !curr.isChosen) {
                    accum["deleting"].push(curr.tasteId);
                }
                return accum;
            },
            { incoming: [], deleting: [] }
        );

        dispatch(
            updateProfileInfo({
                profileId: session?.profileId,
                newName: username,
                newBio: bio,
                deletingTaste: newTastePrefs.deleting,
                newTastes: newTastePrefs.incoming
            })
        );
        //Update editing profile state to trigger a new fetch
        setIsEditingProfile(false);
    }

    /**
     * @description Open modal default is log out modal
     */
    function openSettingsModal() {
        setModalState({ ...modalState, settings: true });
        bottomSheetRef.current?.present();
        snapToIndex(bottomSheetRef, 1);
    }

    /**
     * @description Open discard confirmation modal
     */
    function openDiscard() {
        setModalState({ ...modalState, confirmation: true });
        setIsDiscard(true);
        bottomSheetRef.current?.present();
        snapToIndex(bottomSheetRef, 1);
    }

    /**
     * @description Discard changes
     */
    function discardChanges() {
        setIsDiscard(false);
        setIsEditingProfile(false);
        setModalState({ ...modalState, photo: false });
        dismiss();
    }

    /**
     * @description Close the bottom sheet modal
     */
    function closeModal() {
        dismiss();
        setModalState({
            ...modalState,
            confirmation: false,
            settings: false,
            accDel: false,
            photo: false,
            support: false
        });
    }

    function closePhotoModal() {
        dismiss();
        setModalState({ ...modalState, photo: false });
    }

    function openPhotoModal() {
        setModalState({ ...modalState, photo: true });
        bottomSheetRef.current?.present();
        snapToIndex(bottomSheetRef, 1);
    }

    function deleteAccount() {
        logOut();
        deleteUser(session.session);
    }

    function openDelConfirm() {
        setModalState({
            ...modalState,
            settings: false,
            accDel: true,
            confirmation: true
        });
    }

    function openLogoutConfirm() {
        setModalState({ ...modalState, settings: false, confirmation: true });
    }

    /**
     * @description
     */
    function openSupportContact() {
        setModalState({ ...modalState, support: true, settings: false });
        snapToIndex(bottomSheetRef, 4);
    }

    function closeSupportContact() {
        dismiss();
        setModalState({ ...modalState, support: false, settings: false });
        dispatch(
            displayEventAlert({
                show: true,
                text: `Email has been sent!`,
                iconName: "mail-unread-outline"
            })
        );
    }

    const onRefreshFunc = React.useCallback(() => {
        dispatch(
            retrieveUserInfo({
                profileId: session.profileId
            })
        );
    }, []);

    const { refreshing, onRefresh: onRefreshHook } = useRefresh(onRefreshFunc);

    const leftIcon = !isEditingProfile ? (
        <Button
            size="lg"
            colorScheme={"orange"}
            variant={"ghost"}
            onPress={() => setIsEditingProfile(true)}
        >
            Edit
        </Button>
    ) : (
        <IconButton
            colorScheme="black"
            variant={"ghost"}
            _icon={{
                as: Ionicons,
                name: "chevron-back"
            }}
            onPress={openDiscard}
        />
    );

    const rightIcon = !isEditingProfile ? (
        <IconButton
            colorScheme="black"
            variant={"ghost"}
            _icon={{
                as: Feather,
                name: "settings"
            }}
            onPress={openSettingsModal}
        />
    ) : (
        <Button
            size="md"
            colorScheme={"orange"}
            variant={"ghost"}
            onPress={saveEditedProfile}
        >
            Save
        </Button>
    );

    return (
        <ScreenView
            title="Profile"
            leftIcon={leftIcon}
            rightIcon={rightIcon}
        >
            <View style={{ paddingBottom: 20, gap: 10, flexGrow: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefreshHook}
                        />
                    }
                >
                    {isLoading && <LoadingIndicator />}
                    {profileInfo ? (
                        <View>
                            <ProfileInfoContainer>
                                {/*Avatar image*/}
                                <CustomImage
                                    resizeMode={"cover"}
                                    style={styles.userImage}
                                    source={{
                                        uri: profileUri
                                            ? profileUri
                                            : profileInfo?.profileAvatar
                                    }}
                                />
                                {isEditingProfile && (
                                    <Button
                                        variant={"ghost"}
                                        size="3sm"
                                        onPress={openPhotoModal}
                                    >
                                        <Text
                                            style={{
                                                color: COLOURS.BRAND_800,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Change profile picture
                                        </Text>
                                    </Button>
                                )}
                                {!isEditingProfile && (
                                    <ProfileInfoTextContainer>
                                        <ProfileUsernameText>
                                            {profileInfo.profileUsername}
                                        </ProfileUsernameText>
                                        <ProfileJoinedText>
                                            Joined in{" "}
                                            {profileInfo.profileJoined}
                                        </ProfileJoinedText>
                                    </ProfileInfoTextContainer>
                                )}
                            </ProfileInfoContainer>

                            {!isEditingProfile && (
                                <ProfileBioText>
                                    {profileInfo.profileBio}
                                </ProfileBioText>
                            )}

                            {/*Profile bio and edit profile username and bio*/}
                            {isEditingProfile ? (
                                <View style={{ gap: 15, marginBottom: 20 }}>
                                    <Text style={styles.inputLabel}>EMAIL</Text>
                                    <Text>{profileInfo.profileEmail}</Text>
                                    <Text style={styles.inputLabel}>
                                        USERNAME
                                    </Text>
                                    <Input
                                        value={username}
                                        size={"md"}
                                        onChangeText={(name) =>
                                            setUsername(name)
                                        }
                                        style={styles.input}
                                        borderRadius={"lg"}
                                    />
                                    <Text style={styles.inputLabel}>BIO</Text>
                                    <TextArea
                                        maxH={"100"}
                                        defaultValue={profileInfo.profileBio}
                                        size={"md"}
                                        borderRadius={"lg"}
                                        onChangeText={(desc) => setBio(desc)}
                                        value={bio}
                                        autoCompleteType={true}
                                    />
                                </View>
                            ) : null}

                            {/*Taste profile section*/}
                            {!isEditingProfile ? (
                                <View style={{ gap: 15 }}>
                                    <ProfileHeadingText>
                                        Taste Profile
                                    </ProfileHeadingText>
                                    <TasteProfileContainer>
                                        {profileInfo!.profileTastePrefs
                                            .filter(
                                                (taste) =>
                                                    taste.tasteType ===
                                                    TasteType[TasteType.Cuisine]
                                            )
                                            .filter((taste) => taste.isChosen)
                                            .map((taste) => (
                                                <TasteProfilePill
                                                    key={taste.tasteId.toString()}
                                                >
                                                    <TasteProfilePillText>
                                                        {taste.tasteName}
                                                    </TasteProfilePillText>
                                                </TasteProfilePill>
                                            ))}
                                    </TasteProfileContainer>
                                    <TasteProfileContainer
                                        style={{ marginTop: 5 }}
                                    >
                                        {profileInfo!.profileTastePrefs
                                            .filter(
                                                (taste) =>
                                                    taste.tasteType ===
                                                    TasteType[TasteType.Dietary]
                                            )
                                            .filter((taste) => taste.isChosen)
                                            .map((taste) => (
                                                <TasteProfilePill
                                                    key={taste.tasteId.toString()}
                                                >
                                                    <TasteProfilePillText>
                                                        {taste.tasteName}
                                                    </TasteProfilePillText>
                                                </TasteProfilePill>
                                            ))}
                                    </TasteProfileContainer>
                                </View>
                            ) : null}

                            {/*Editing taste profile selections*/}
                            {isEditingProfile && (
                                <View style={{ gap: 10 }}>
                                    <Text style={styles.inputLabel}>
                                        CUISINES
                                    </Text>
                                    <FlatList
                                        data={cuisineTastes}
                                        keyExtractor={(item) =>
                                            item.tasteId.toString()
                                        }
                                        renderItem={({ item }) => (
                                            <TastePrefToggle
                                                editFunc={cuisineEditHandler}
                                                tastePref={item}
                                            />
                                        )}
                                        numColumns={3}
                                        scrollEnabled={false}
                                    />

                                    <Text style={styles.inputLabel}>
                                        DIETARY RESTRICTIONS
                                    </Text>
                                    <FlatList
                                        data={dietary}
                                        keyExtractor={(item) =>
                                            item.tasteId.toString()
                                        }
                                        renderItem={({ item }) => (
                                            <TastePrefToggle
                                                editFunc={dietaryEditHandler}
                                                tastePref={item}
                                            />
                                        )}
                                        numColumns={3}
                                        scrollEnabled={false}
                                    />
                                </View>
                            )}
                        </View>
                    ) : (
                        <LoadingIndicator />
                    )}
                </ScrollView>
            </View>

            <ConfirmationTextModal
                isOpen={delAccConfirmModal}
                setModalVisible={setDelAccConfirmModal}
                title="Confirm Account Deletion by typing: DELETE_ACCOUNT"
                textToMatch={"DELETE_ACCOUNT"}
                confirmFunction={deleteAccount}
            />

            {/*Modal for logging out*/}
            <CustomBottomModal
                ref={bottomSheetRef}
                closeFunc={closeModal}
                snapIndex={1}
            >
                <>
                    {modalState.settings && !isEditingProfile && (
                        <SheetModalOptions
                            closeModal={closeModal}
                            sheetTitle="Settings"
                        >
                            <View style={{ gap: 20 }}>
                                <ButtonWithIcons
                                    buttonStyle={styles.optionsContainer}
                                    textStyle={{
                                        ...styles.optionsText,
                                        color: COLORS.brown600
                                    }}
                                    leftIcon={
                                        <MaterialIcons
                                            name="logout"
                                            size={24}
                                            color={COLOURS.BRAND_800}
                                        />
                                    }
                                    rightIcon={<></>}
                                    onPress={openLogoutConfirm}
                                >
                                    Logout
                                </ButtonWithIcons>
                                <ButtonWithIcons
                                    buttonStyle={styles.optionsContainer}
                                    textStyle={{
                                        ...styles.optionsText,
                                        color: COLOURS.BRAND_800
                                    }}
                                    leftIcon={
                                        <MaterialIcons
                                            name="support-agent"
                                            size={24}
                                            color={COLOURS.BRAND_800}
                                        />
                                    }
                                    rightIcon={<></>}
                                    onPress={openSupportContact}
                                >
                                    Contact Support / Give Feedback
                                </ButtonWithIcons>
                                <ButtonWithIcons
                                    buttonStyle={styles.optionsContainer}
                                    textStyle={{
                                        ...styles.optionsText,
                                        color: COLORS.red300
                                    }}
                                    leftIcon={
                                        <MaterialCommunityIcons
                                            name="account-remove"
                                            size={24}
                                            color={COLOURS.BRAND_800}
                                        />
                                    }
                                    rightIcon={<></>}
                                    onPress={openDelConfirm}
                                >
                                    Delete account
                                </ButtonWithIcons>
                            </View>
                        </SheetModalOptions>
                    )}

                    {modalState.photo && isEditingProfile && (
                        <PhotoModal
                            closePhotoModal={closePhotoModal}
                            setProfileUri={setProfileUri}
                        />
                    )}

                    {modalState.confirmation &&
                        (isDiscard || !modalState.accDel) && (
                            <ConfirmationModal
                                cancelText={
                                    isDiscard
                                        ? "Keep editing"
                                        : "Stay logged in"
                                }
                                closeModal={closeModal}
                                title={
                                    isDiscard ? "Discard changes?" : "Logout?"
                                }
                                subText={
                                    isDiscard
                                        ? "You have unsaved changes, are you sure you want to discard them?"
                                        : "Are you sure you want to Logout?"
                                }
                                actionColor={COLOURS.BRAND_800}
                                onPress={isDiscard ? discardChanges : logOut}
                                actionText={isDiscard ? "Discard" : "Logout"}
                            />
                        )}

                    {modalState.confirmation && modalState.accDel && (
                        <ConfirmationModal
                            cancelText={"Do not delete"}
                            closeModal={closeModal}
                            title={"Delete Account"}
                            subText={
                                "Are you sure you want to delete your account? This action is irreversible"
                            }
                            actionColor={COLOURS.BRAND_800}
                            onPress={() => setDelAccConfirmModal(true)}
                            actionText={"Delete Account"}
                        />
                    )}

                    {modalState.support && (
                        <ContactSupportSheet
                            email={profileInfo.profileEmail}
                            alertText="Email Sent"
                            sheetHeader="Contact Support"
                            closeSheet={closeSupportContact}
                        />
                    )}
                </>
            </CustomBottomModal>
        </ScreenView>
    );
}

export default Profile;

const ProfileInfoContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

const ProfileInfoTextContainer = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ProfileUsernameText = styled.Text`
    font-family: ${FONTS.MULISH_BOLD};
    font-size: 17px;
    line-height: 20px;
    color: ${COLOURS.GRAY_800};
`;

const ProfileJoinedText = styled.Text`
    font-family: ${FONTS.MULISH_REGULAR};
    font-size: 15px;
    line-height: 23px;
    color: ${COLOURS.GRAY_400};
`;

const ProfileBioText = styled.Text`
    font-family: ${FONTS.MULISH_REGULAR};
    font-size: 15px;
    line-height: 23px;
    color: ${COLOURS.GRAY_600};
    margin: 10px 0;
`;

const ProfileHeadingText = styled.Text`
    font-family: ${FONTS.MULISH_BOLD};
    font-size: 17px;
    line-height: 20px;
    color: ${COLOURS.GRAY_800};
    margin: 10px 0;
`;

const TasteProfileContainer = styled.View`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
`;

const TasteProfilePill = styled.View`
    border-radius: 8px;
    padding: 4px 8px;
    border: 1px ${COLOURS.GRAY_800} solid;
`;

const TasteProfilePillText = styled.Text`
    font-family: ${FONTS.MULISH_REGULAR};
    font-size: 14px;
    line-height: 16px;
    color: ${COLOURS.GRAY_600};
`;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 34,
        marginBottom: 10
    },
    optionsContainer: {
        gap: 10
    },
    optionsText: {
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "Mulish_500Medium"
    },
    list_name_text: {
        fontSize: 21,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: 0,
        color: "#323F4B"
    },
    list_description_text: {
        fontSize: 15,
        fontWeight: "400",
        lineHeight: 23,
        letterSpacing: 0,
        color: COLOURS.GRAY_700
    },
    last_updated_text: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: COLOURS.GRAY_400
    },
    userImage: {
        borderRadius: 50,
        height: 64,
        width: 64
    },
    user_text: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: COLOURS.GRAY_800
    },
    followers_count_text: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: COLORS.gray500
    },
    tasteProfile: {
        borderRadius: 8
    },
    input: {
        height: 48,
        width: "100%",
        borderRadius: 8
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0.2,
        color: COLOURS.GRAY_400
    },
    tastePrefNoEdit: {
        marginRight: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLOURS.GRAY_800,
        padding: 6,
        borderRadius: 10
    },
    tastePrefEdit: {
        marginRight: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLOURS.BRAND_900,
        padding: 6,
        borderRadius: 30,
        backgroundColor: COLOURS.BRAND_800
    }
});
