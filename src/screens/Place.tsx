//Libraries
import {AppDispatch} from "@/App";
import CustomImage from "@components/CustomImage";
import EventAlert from "@components/EventAlert";
import LoadingIndicator from "@components/LoadingIndicator";
import CustomBottomSheet from "@components/Modals/CustomBottomSheet";

import PlaceModal from "@components/Modals/PlaceModal";

//Components
import ScreenHeader from "@components/ScreenHeader";
import {
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import {useEffectAsync} from "@hooks/useEffectAsync";
import {useSession} from "@hooks/useSession";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {getListState, retrieveLists} from "@redux_store/lists";
import {RootState} from "@redux_store/store";
import {displayEventAlert, getEventAlertStatus} from "@redux_store/util";
import {getPlacePhoto, getPlacesDetails} from "@util/apis/places/places.util";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {snapToIndex} from "@util/BottomSheetFuncs";
import {COLORS} from "@util/constants/theme";
import {getDistanceFromLatLonInKm} from "@util/FilterPlaces";
import {FsqPlace} from "@util/types/fsq/fsq.places.types";

//Util functions
import {NavigationProps, PlaceScreenParams} from "@util/types/navigation.types";
import {PlaceStats, UserListResponse} from "@util/types/supabase.types";
import * as Clipboard from "expo-clipboard";
import {Box, IconButton, ScrollView} from "native-base";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useDispatch, useSelector} from "react-redux";

export type ListProps = {
    route?: RouteProp<
        {
            params: PlaceScreenParams;
        },
        "params"
    >;
};

/**
 * @description Place Details of a restaurant, navigated to when user clicks a listing in Explore page
 * @param route
 * @see Explore
 */
function Place({route}: ListProps) {
    const {placeId} = route!.params;

    const session = useSession();
    const navigation = useNavigation<NavigationProps>();
    const dispatch: AppDispatch = useDispatch();

    /*------Selectors for redux states-------*/
    //User lists being displayed that the place can be saved to
    const listDict = useSelector(getListState);
    const defaultLists = useMemo(() => Object.values(listDict), [listDict]); //Status to display event alerts
    const eventAlert = useSelector(getEventAlertStatus);
    //Get user location
    const userLocation = useSelector((store: RootState) => store.user.location);

    //Bottom sheet props
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Google Place
    const [place, setPlace] = useState<FsqPlace | null>(null);

    //Modal open states
    const [isNewListModalOpen, setNewListModalOpen] = useState<boolean>(false);

    //State for bookmark icon if saved or not
    const [isSaved, setIsSaved] = useState<boolean>(false);
    //State for lists to be displayed in palce modal
    const [lists, setLists] = useState<UserListResponse[]>([]);

    //Get the place details of the current place using google api
    useEffectAsync(async () => {
        setPlace(await getPlacesDetails(placeId));
    }, [placeId]);

    useEffectAsync(async () => {
        const isPlacedSaved = await supabaseCall("is_place_saved", {
            input_api_place_id: placeId,
            input_profile_id: session.profileId
        });

        setIsSaved(isPlacedSaved);
    }, []);

    //Set the starting list data for the place modal
    useEffect(() => {
        setListData();
    }, [isSaved, defaultLists]);

    /**
     * @description Display the lists that the place is saved to
     */
    async function setListData() {
        if (isSaved) {
            //Get the saved lists of place
            const savedLists = await getListsOfPlace();

            if (savedLists) {
                //Create a new list where the lists being displayed are only the saved ones
                const filteredLists = defaultLists.filter((list) =>
                    savedLists.includes(list.listId)
                );
                setLists(filteredLists);
            } else {
                setLists([]);
            }
        } else {
            setLists(defaultLists);
        }
    }

    // Internal Place Info
    const [placeStats, setPlaceStats] = useState<PlaceStats | null>(null);
    const [distance, setDistance] = useState<number>(0);

    // Load the internal place stats
    useEffectAsync(async () => {
        const stats = await supabaseCall("get_place_stats", {
            input_api_place_id: placeId
        });
        if (stats) setPlaceStats(stats);
    }, [placeId]);

    /**
     * @description Retrieve the lists associated with the place
     * @returns List of integer ids of the lists the place is saved in
     */
    async function getListsOfPlace() {
        const listsWithSavedPlace = await supabaseCall(
            "get_lists_with_saved_place",
            {input_profile_id: session.profileId, input_api_place_id: placeId}
        );
        return listsWithSavedPlace;
    }

    //Retrieve user lists
    useEffect(() => {
        //Only make the call when list state is empty
        if (defaultLists.length <= 0) {
            dispatch(retrieveLists({profileId: session?.profileId}));
        }
    }, [session]);

    useEffect(() => {
        if (userLocation && place) {
            const dist = getDistanceFromLatLonInKm(
                userLocation.lat,
                userLocation.lng,
                place.geocodes.main.latitude,
                place.geocodes.main.longitude
            );
            setDistance(dist);
        }
    }, [userLocation, place]);

    const viewInExploreScreen = () => {
        navigation.navigate("Explore", {
            coordinates: {
                lat: place.geocodes.main.latitude,
                lng: place.geocodes.main.longitude
            }
        });
    };

    const windowWidth = Dimensions.get("window").width;

    // const openSaveModal = () => {
    //     // TODO Check how many lists the user has.
    //     // If they have none, show new list modal,
    //     // Otherwise, show lists modal

    //     // showNewListModal()
    //     showListModal();
    // }

    /**
     * @description Copy the current place to user's clipboard and display event alert
     */
    async function sharePlace() {
        //Copy url to clipboard
        await Clipboard.setStringAsync(place.website);

        //Display event alert
        dispatch(
            displayEventAlert({
                show: true,
                text: "Link Copied!",
                iconName: "share"
            })
        );
    }

    async function visitWebsite() {
        if (place.website) {
            await Linking.openURL(place.website);
        }
    }

    function setSaved(flag: boolean) {
        setIsSaved(flag);
    }

    function closeFunc() {
        bottomSheetRef.current.close();
        if (isNewListModalOpen) {
            setNewListModalOpen(false);
        }
    }

    function openSaveModal() {
        isSaved
            ? snapToIndex(bottomSheetRef, 3)
            : snapToIndex(bottomSheetRef, 4);
    }

    return (
        <SafeAreaView style={{height: "100%"}}>
            <ScreenHeader
                headerText={""}
                leftIcon={
                    <IconButton
                        colorScheme="black"
                        variant={"ghost"}
                        _icon={{
                            as: Ionicons,
                            name: "chevron-back"
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightIcon={<></>}
            />
            {!place ? (
                <LoadingIndicator />
            ) : (
                <>
                    <Box
                        style={{
                            padding: 20,
                            gap: 15
                        }}
                    >
                        {/*Place information*/}
                        {place.photos && place.photos.length > 0 && (
                            <ScrollView
                                style={styles.placeImageCarousel}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {place.photos.map((photo) => (
                                    <CustomImage
                                        key={`place_photo_${photo.id}`}
                                        resizeMode={"cover"}
                                        style={{
                                            ...styles.placeImage,
                                            width: windowWidth - 100
                                        }}
                                        source={{uri: getPlacePhoto(photo)}}
                                    />
                                ))}
                            </ScrollView>
                        )}

                        <Text style={styles.placeNameText}>{place.name}</Text>

                        <Text style={styles.placeAddressText}>
                            {place.location.formatted_address}
                        </Text>

                        <Box
                            style={{
                                flexDirection: "row",
                                gap: 10
                            }}
                        >
                            <Box style={styles.placeInfoBox}>
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={16}
                                    color="#7B8794"
                                />
                                <Text
                                    style={styles.placeInfoText}
                                >{`${distance} km`}</Text>
                            </Box>
                            {place.rating && (
                                <Box style={styles.placeInfoBox}>
                                    <FontAwesome5
                                        name="star"
                                        size={16}
                                        color="#7B8794"
                                    />
                                    <Text style={styles.placeInfoText}>
                                        {(place.rating / 2).toFixed(1)} stars
                                    </Text>
                                </Box>
                            )}
                            <Box style={styles.placeInfoBox}>
                                <FontAwesome5
                                    name="bookmark"
                                    size={16}
                                    color="#7B8794"
                                />
                                <Text style={styles.placeInfoText}>
                                    Saved to {placeStats?.placeSavedCount || 0}{" "}
                                    lists
                                </Text>
                            </Box>
                        </Box>

                        {/*Horizontal buttons*/}
                        <View
                            style={
                                place.website
                                    ? {
                                          ...styles.buttonContainer,
                                          ...styles.buttonWrap
                                      }
                                    : styles.buttonContainer
                            }
                        >
                            <TouchableOpacity
                                style={styles.place_btn}
                                onPress={openSaveModal}
                            >
                                <FontAwesome
                                    name={isSaved ? "bookmark" : "bookmark-o"}
                                    size={16}
                                    color="#B95000"
                                />
                                <Text style={styles.place_btn_text}>Save</Text>
                            </TouchableOpacity>

                            {place.website && (
                                <TouchableOpacity
                                    style={styles.place_btn}
                                    onPress={sharePlace}
                                >
                                    <FontAwesome
                                        name="share"
                                        size={16}
                                        color="#B95000"
                                    />
                                    <Text style={styles.place_btn_text}>
                                        Share
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.place_btn}
                                onPress={viewInExploreScreen}
                            >
                                <FontAwesome
                                    name="map-o"
                                    size={16}
                                    color="#B95000"
                                />
                                <Text style={styles.place_btn_text}>
                                    View on maps
                                </Text>
                            </TouchableOpacity>

                            {place.website && (
                                <TouchableOpacity
                                    style={styles.place_btn}
                                    onPress={visitWebsite}
                                >
                                    <MaterialCommunityIcons
                                        name="web"
                                        size={18}
                                        color="#B95000"
                                    />
                                    <Text style={styles.place_btn_text}>
                                        Visit Website
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Box>
                </>
            )}

            {/*Bottom Sheet*/}
            <CustomBottomSheet
                snapIndex={4}
                ref={bottomSheetRef}
                closeFunc={closeFunc}
            >
                <PlaceModal
                    bottomSheetRef={bottomSheetRef}
                    setIsSaved={setSaved}
                    placeId={placeId}
                    closeFunc={closeFunc}
                    isSaving={!isSaved}
                    lists={lists}
                    isNewListModalOpen={isNewListModalOpen}
                    setNewListModalOpen={setNewListModalOpen}
                />
            </CustomBottomSheet>

            {eventAlert.show && (
                <EventAlert
                    text={eventAlert.text}
                    iconName={eventAlert?.iconName}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 10
    },
    buttonWrap: {
        flexWrap: "wrap",
        justifyContent: "flex-start"
    },
    placeImageCarousel: {
        width: "100%",
        height: 200,
        flexDirection: "row",
        gap: 80
    },
    placeImage: {
        borderRadius: 8,
        height: "100%",
        marginRight: 10
    },
    placeNameText: {
        fontSize: 21,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: 0,
        color: "#323F4B"
    },
    placeAddressText: {
        fontSize: 15,
        fontWeight: "400",
        lineHeight: 23,
        color: "#4E5D6C"
    },
    placeInfoBox: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8
    },
    placeInfoText: {
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        lineHeight: 16,
        color: "#7B8794"
    },
    place_btn: {
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
    place_btn_text: {
        color: COLORS.brown600
    },
    new_list_input_box: {
        gap: 8
    },
    new_list_input_label: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 12,
        letterSpacing: 1.5,
        color: "#7B8794"
    },
    new_list_input: {
        alignSelf: "stretch",
        padding: 12,
        borderRadius: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#CBD2D9",
        backgroundColor: "white",
        color: "#4E5D6C",
        fontSize: 15
    },
    new_list_btn: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWith: 1,
        borderStyle: "solid",
        borderColor: "#601D00",
        backgroundColor: COLORS.brown600,
        marginTop: 20
    }
});

export default Place;
