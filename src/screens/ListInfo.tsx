import {AppDispatch} from "@/App";

import ButtonWithIcons from "@components/Buttons/ButtonWithIcons";

import CustomImage from "@components/CustomImage";
import EventAlert from "@components/EventAlert";
import ListPlacesDetails from "@components/ListPlacesDetails";
import LoadingIndicator from "@components/LoadingIndicator";
import ScreenHeader from "@components/ScreenHeader";
import {
    Feather,
    FontAwesome,
    Ionicons,
    MaterialIcons
} from "@expo/vector-icons";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {useEffectAsync} from "@hooks/useEffectAsync";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {FetchStatus} from "@util/constants/constraints";
import {COLORS} from "@util/constants/theme";
import {ListEntryPlaces} from "@util/types/list.types";
import {
    ListInfoScreenParams,
    NavigationProps
} from "@util/types/navigation.types";
import {
    Box,
    Button,
    IconButton,
    Input,
    ScrollView,
    TextArea
} from "native-base";
import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {Alert, Share, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useDispatch, useSelector} from "react-redux";
import ConfirmationModal from "@components/Modals/ConfirmationModal";
import SheetModalOptions from "@components/Modals/SheetModalOptions";
import {useSession} from "@hooks/useSession";
import {
    deleteLists,
    getListInfo,
    getListOpStatus,
    retrievePlacesFromList,
    setListLoadingStatus,
    updateList
} from "@redux_store/lists";
import {getUserLocation} from "@redux_store/user";
import {displayEventAlert, getEventAlertStatus} from "@redux_store/util";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {UserPreview} from "./Friends";

export type ListProps = {
    route?: RouteProp<
        {
            params: ListInfoScreenParams;
        },
        "params"
    >;
};

/**
 * @description List information screen when a list is viewed, show list places too
 * @param route
 * @returns
 */
function ListInfo({route}: ListProps) {
    const session = useSession();
    //List id, list share id, profile id
    const {listId, listShareId, profileId} = route!.params;

    const navigation = useNavigation<NavigationProps>();
    const dispatch: AppDispatch = useDispatch();
    //Bottom sheet props
    const bottomSheetRef = useRef<BottomSheet>(null);
    //Points for the bottom sheet to snap to, points should be sorted from bottom to top
    const snapPoints = useMemo(() => ["25%"], []);
    const eventAlert = useSelector(getEventAlertStatus);

    /*--------States--------*/
    //Get the list info of the list with the list id being passed in
    const listInfo = useSelector(getListInfo(listId));

    //The status of the list slice operations
    const listOpStatus = useSelector(getListOpStatus);
    const userLocation = useSelector(getUserLocation);

    /*------Editing states-------*/
    //State to handle editing screen or normal screen
    const [isEditing, setIsEditing] = useState<boolean>(false);
    //State for the list info name
    const [editName, setEditName] = useState<string>(listInfo?.listName);
    //State for the description name
    const [editDesc, setEditDesc] = useState<string>(listInfo?.listDescription);
    //The list entry ids that is being deleted
    const [delListEntryIds, setDelListEntryIds] = useState<number[]>([]);
    const [profileInfo, setProfileInfo] = useState<UserPreview>();

    //Retrieve places of the list
    useEffect(() => {
        //If in idle state perform retrieval, or if it is a different list being displayed
        if (!listInfo || listOpStatus === FetchStatus.Idle) {
            dispatch(
                retrievePlacesFromList({
                    listId: listId,
                    userLocation: userLocation
                })
            );
        }
        //If retrieval succeeds set the local state of the places
        else if (listInfo && listOpStatus === FetchStatus.Success) {
            setLocalListPlaces(listInfo.places);
        }
    }, [listOpStatus, listId]);

    //Retrieve the preview information for a profile
    useEffectAsync(async () => {
        const profilePrev = await supabaseCall("get_profile_preview", {
            input_profile_id: profileId
        });
        setProfileInfo(profilePrev);
    }, [profileId]);

    /*--------Modal States--------*/
    const [isMoreModalOpen, setIsMoreModalOpen] = useState<boolean>(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
        useState<boolean>(false);
    const [isDiscardModalOpen, setIsDiscardModalOpen] =
        useState<boolean>(false);

    //Local list places state
    const [localListPlaces, setLocalListPlaces] = useState<ListEntryPlaces[]>(
        listInfo ? listInfo.places : []
    );

    /**
     * @description Generate URL to share list with anyone
     */
    async function shareList() {
        const url = `https://foodfolioapp.com/shared/list/${listShareId}`;

        try {
            await Share.share({
                title: `Foodfolio List - ${listInfo.listName}`,
                message: `Check out my list at ${url} on Foodfolio for some good food recommendations!`
                // url: url
            });
        } catch (error: any) {
            Alert.alert("Unable to share your list");
        }
    }

    /**
     * @description Handles deletion of lists
     * @param event
     */
    function deleteList() {
        //Pass in single value array
        dispatch(deleteLists(listInfo.listId));
        dispatch(
            displayEventAlert({
                show: true,
                text: `${listInfo.listName} has been deleted`,
                iconName: "trash-bin"
            })
        );
        navigation.navigate("Lists");
    }

    /**
     * @description View the places google details in explore page
     * @see Explore.tsx
     */
    function viewInExploreScreen() {
        navigation.navigate("Explore", {
            places: listInfo.places.map(
                ({listEntryPlaceInfo}) => listEntryPlaceInfo
            )
        });
    }

    /**
     * Start following a list
     */
    // const followList = async () => {
    //     // TODO Make sure you can't follow your own list.
    //     // TODO Update the button to "Following" instead of "Follow" when following a list.
    //     const success = await supabaseCall("follow_list", {
    //         input_user_id: session.session.user.id,
    //         input_list_id: listInfo.listId
    //     });
    //     if (!success) {
    //         Alert.alert(
    //             "Something went wrong",
    //             `Unable to follow ${listInfo.listName}, please report this.`
    //         );
    //         return;
    //     }
    //     dispatch(
    //         displayEventAlert({
    //             show: true,
    //             text: `Following ${listInfo.listName}!`,
    //             iconName: "heart"
    //         })
    //     );
    // };

    /**
     * @description Function to conditionally close the sheets depending on which one is open
     */
    function closeTheModal() {
        if (isDeleteConfirmModalOpen) {
            setIsDeleteConfirmModalOpen(false);
        } else if (isMoreModalOpen) {
            setIsMoreModalOpen(false);
        } else if (isDiscardModalOpen) {
            setIsDiscardModalOpen(false);
        }
    }

    /**
     * @description Save new updated list info
     */
    async function saveNewEdit() {
        //Update list
        dispatch(
            updateList({
                delListEntryIds: delListEntryIds,
                listId: listInfo.listId,
                newListDesc: editDesc ? editDesc : listInfo.listDescription,
                newListName: editName ? editName : listInfo.listName
            })
        );
        //Close editing page
        setIsEditing(false);
        //Update list loading status true to trigger rerender of list places
        dispatch(setListLoadingStatus(true));
    }

    /**
     * @description Function handler for back button press on the top
     */
    function backButtonHandler() {
        //If in editing mode first ask user if they want to discard changes
        if (isEditing) {
            setIsDiscardModalOpen(true);
            navigation.goBack();
        } else {
            navigation.goBack();
        }
    }

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    function editList() {
        setIsEditing(true);
        setIsMoreModalOpen(false);
    }

    function openDeleteConfirm() {
        setIsDeleteConfirmModalOpen(true);
        setIsMoreModalOpen(false);
    }

    return (
        <SafeAreaView style={{height: "100%"}}>
            <ScreenHeader
                headerText={isEditing ? "Edit list" : ""}
                leftIcon={
                    <IconButton
                        colorScheme="black"
                        variant={"ghost"}
                        _icon={{
                            as: Ionicons,
                            name: "chevron-back"
                        }}
                        onPress={backButtonHandler}
                    />
                }
                rightIcon={
                    session.profileId !== profileId ? (
                        <></>
                    ) : // If editing button changes to save
                    isEditing ? (
                        <Button
                            size="lg"
                            colorScheme={"orange"}
                            variant={"ghost"}
                            onPress={saveNewEdit}
                        >
                            Save
                        </Button>
                    ) : (
                        <IconButton
                            colorScheme={"black"}
                            key={"ghost"}
                            variant={"ghost"}
                            _icon={{
                                as: Feather,
                                name: "more-horizontal"
                            }}
                            onPress={() => setIsMoreModalOpen(true)}
                        />
                    )
                }
            />

            {listOpStatus === FetchStatus.Loading && <LoadingIndicator />}

            {/*List info header*/}
            {listInfo && (
                <Box
                    style={{
                        padding: 20,
                        gap: 10
                    }}
                >
                    {!isEditing ? (
                        <>
                            {/*List Name*/}
                            <Text style={styles.list_name_text}>
                                {listInfo?.listName}
                            </Text>
                            {/*List follower count and timestamp*/}
                            <Box
                                style={{
                                    flexDirection: "row",
                                    gap: 10
                                }}
                            >
                                {/* <Text style={styles.followers_count_text}>374 followers</Text> */}
                                <Text style={styles.last_updated_text}>
                                    Last updated
                                    {listInfo
                                        ? listInfo.lastUpdated.toString()
                                        : ""}
                                </Text>
                            </Box>

                            {/*Avatar*/}
                            {profileInfo && (
                                <Box
                                    style={{
                                        flexDirection: "row",
                                        gap: 5,
                                        alignItems: "center"
                                    }}
                                >
                                    <CustomImage
                                        resizeMode={"cover"}
                                        style={styles.user_image}
                                        source={{uri: profileInfo.avatar}}
                                    />
                                    <Text style={styles.user_text}>
                                        {profileInfo.username}
                                    </Text>
                                </Box>
                            )}

                            {/*List description*/}
                            <Text style={{marginVertical: 8}}>
                                {listInfo.listDescription}
                            </Text>

                            {/*Horizontal list of buttons */}
                            <Box>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        gap: 10
                                    }}
                                >
                                    {/* <ButtonWithIcons
                                        buttonStyle={styles.list_btn}
                                        leftIcon={
                                            <FontAwesome
                                                name="heart"
                                                size={16}
                                                color={COLORS.brown600}
                                            />
                                        }
                                        rightIcon={<></>}
                                        textStyle={styles.list_btn_text}
                                        onPress={followList}
                                    >
                                        Follow
                                    </ButtonWithIcons> */}

                                    <ButtonWithIcons
                                        buttonStyle={styles.list_btn}
                                        leftIcon={
                                            <FontAwesome
                                                name="map-o"
                                                size={16}
                                                color={COLORS.brown600}
                                            />
                                        }
                                        rightIcon={<></>}
                                        textStyle={styles.list_btn_text}
                                        onPress={viewInExploreScreen}
                                    >
                                        View on map
                                    </ButtonWithIcons>

                                    <ButtonWithIcons
                                        buttonStyle={styles.list_btn}
                                        leftIcon={
                                            <FontAwesome
                                                name="share"
                                                size={16}
                                                color={COLORS.brown600}
                                            />
                                        }
                                        rightIcon={<></>}
                                        textStyle={styles.list_btn_text}
                                        onPress={shareList}
                                    >
                                        Share
                                    </ButtonWithIcons>
                                </ScrollView>
                            </Box>
                        </>
                    ) : (
                        /*----Editing name and description box----*/
                        <View style={{gap: 15}}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <Input
                                value={editName}
                                defaultValue={listInfo.listName}
                                size={"md"}
                                onChangeText={(name) => setEditName(name)}
                                style={styles.input}
                                borderRadius={"lg"}
                            />
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextArea
                                maxH={"100"}
                                defaultValue={listInfo.listDescription}
                                size={"md"}
                                borderRadius={"lg"}
                                onChangeText={(desc) => setEditDesc(desc)}
                                autoCompleteType={true}
                            />
                        </View>
                    )}
                </Box>
            )}

            {/*Places Details*/}
            {localListPlaces.length > 0 && (
                <ListPlacesDetails
                    isEditing={isEditing}
                    listId={listId}
                    listPlaces={localListPlaces}
                    profileId={profileId}
                    setDelListEntryIds={setDelListEntryIds}
                />
            )}

            {/*------Bottom Sheet Modal Section--------*/}
            {(isMoreModalOpen || isDeleteConfirmModalOpen) && (
                <BottomSheet
                    ref={bottomSheetRef}
                    enablePanDownToClose={true}
                    index={0}
                    snapPoints={snapPoints}
                    enableDynamicSizing={true}
                    backdropComponent={renderBackdrop}
                    style={{borderRadius: 50}}
                    onClose={closeTheModal}
                >
                    {/*Bottom sheet that opens when more modal is clicked*/}
                    {isMoreModalOpen && !isDeleteConfirmModalOpen && (
                        <SheetModalOptions
                            closeModal={() => setIsMoreModalOpen(false)}
                            sheetTitle={listInfo?.listName}
                        >
                            <Fragment>
                                <ButtonWithIcons
                                    buttonStyle={{gap: 10}}
                                    textStyle={{
                                        ...styles.optionsText,
                                        color: COLORS.brown600
                                    }}
                                    leftIcon={
                                        <MaterialIcons
                                            name="edit"
                                            size={24}
                                            color={COLORS.brown600}
                                        />
                                    }
                                    rightIcon={<></>}
                                    onPress={editList}
                                >
                                    Edit list
                                </ButtonWithIcons>
                                <ButtonWithIcons
                                    buttonStyle={{gap: 10}}
                                    textStyle={{
                                        ...styles.optionsText,
                                        color: COLORS.red300
                                    }}
                                    leftIcon={
                                        <MaterialIcons
                                            name="delete-outline"
                                            size={24}
                                            color={COLORS.red300}
                                        />
                                    }
                                    rightIcon={<></>}
                                    onPress={openDeleteConfirm}
                                >
                                    Delete list
                                </ButtonWithIcons>
                            </Fragment>
                        </SheetModalOptions>
                    )}
                    {/*Deletion confirmation modal*/}
                    {isDeleteConfirmModalOpen && !isMoreModalOpen && (
                        <ConfirmationModal
                            actionColor={COLORS.red300}
                            actionText={"Delete list"}
                            title="Delete list?"
                            subText={`Are you sure you want to delete ${listInfo.listName}?`}
                            cancelText="Cancel"
                            onPress={deleteList}
                            closeModal={() =>
                                setIsDeleteConfirmModalOpen(false)
                            }
                        />
                    )}
                    {/*Discard Changes Modal*/}
                    {isDiscardModalOpen && (
                        <ConfirmationModal
                            actionColor={COLORS.brown600}
                            actionText="Discard"
                            title="Discard Changes?"
                            closeModal={() => setIsDiscardModalOpen(false)}
                            onPress={() => navigation.navigate("Lists")}
                            subText="You have unsaved changes, are you sure you want to discard them?"
                            cancelText="Keep editing"
                        />
                    )}
                </BottomSheet>
            )}
            {eventAlert.show && (
                <EventAlert
                    iconName={eventAlert.iconName}
                    text={eventAlert.text}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    followers_count_text: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: COLORS.gray500
    },
    last_updated_text: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: COLORS.gray500
    },
    user_image: {
        borderRadius: 50,
        height: 24,
        width: 24
    },
    user_text: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: "#323F4B"
    },
    list_description_text: {
        fontSize: 15,
        fontWeight: "400",
        lineHeight: 23,
        letterSpacing: 0,
        color: "#4E5D6C"
    },
    list_btn: {
        width: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 4,
        borderRadius: 72,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#601D00",
        backgroundColor: "transparent",
        color: COLORS.brown600,
        marginRight: 10
    },
    list_btn_text: {
        color: COLORS.brown600
    },
    places_header_text: {
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 20,
        letterSpacing: 0.15,
        color: "#323F4B"
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
        color: "#7B8794"
    }
});

export default ListInfo;
