import {AppDispatch} from "@/App";
import CustomImage from "@components/CustomImage";
import ExploreSearchBar from "@components/ExploreSearchBar";
import ListComponent from "@components/ListComponent";
import LoadingIndicator from "@components/LoadingIndicator";
import CustomMarker from "@components/MapMarkers/CustomMarker";
import CustomBottomModal from "@components/Modals/CustomBottomModal";
import ScreenHeader from "@components/ScreenHeader";
import {AntDesign, FontAwesome5} from "@expo/vector-icons";
import {
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal
} from "@gorhom/bottom-sheet";
import {useEffectAsync} from "@hooks/useEffectAsync";
import {useSession} from "@hooks/useSession";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {
    getListOpStatus,
    getListState,
    retrieveLists,
    retrievePlacesFromList
} from "@redux_store/lists";
import {RootState, store} from "@redux_store/store";
import {getNearbyPlaces, getPlacesPhoto} from "@util/apis/places/places.util";
import {GOOGLE_MAP_STYLE} from "@util/constants/misc.constants";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {STYLES} from "@util/constants/styles/styles.constants";
import {getDistanceFromLatLonInKm} from "@util/FilterPlaces";
import {FsqPlace} from "@util/types/fsq/fsq.places.types";
import {
    ExploreScreenParams,
    NavigationProps
} from "@util/types/navigation.types";
import {StatusBar} from "expo-status-bar";
import {Box, FlatList, IconButton, ScrollView} from "native-base";
import React, {
    createRef,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView as RNScrollView,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import MapView, {MapMarker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import {useDispatch, useSelector} from "react-redux";

const DEFAULT_DELTA = 0.009;

interface ExploreProps {
    route?: RouteProp<{params: ExploreScreenParams}, "params">;
}

/**
 * @description Map Screen displaying markers for destination (Not in place yet, just static map for now)
 * @param route Params passing in Coordinate Object
 */
function Explore({route}: ExploreProps) {
    const session = useSession();
    const dispatch: AppDispatch = useDispatch();
    const {dismiss} = useBottomSheetModal();

    const navigation = useNavigation<NavigationProps>();

    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    const mapRef = useRef<MapView>(null);
    const overlayRef = useRef<RNScrollView>(null);
    const markerRefs = React.useRef<MapMarker[]>([]);

    //Bottom sheet props
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const [, setZoomLevel] = useState(15);
    const [, setLastUserMovedMapTime] = useState(new Date());
    const [nearby, setNearby] = useState<FsqPlace[]>([]);

    /*----States for list view on map*/
    //If list bottom sheet is open
    const [, setIsListOpen] = useState<boolean>(false);

    //Lists state
    const listDict = useSelector(getListState);
    const lists = useMemo(() => Object.values(listDict), [listDict]);

    //List loading state
    const listOpStatus = useSelector(getListOpStatus);

    //Function to retrieve user lists
    useEffect(() => {
        if (!lists) {
            dispatch(retrieveLists({profileId: session.profileId}));
        }
    }, [session.profileId]);

    useEffect(() => {
        if (markerRefs.current.length !== nearby.length) {
            // add or remove refs
            // @ts-expect-error current is an attribute but for some reason TS doesn't pick it up
            markerRefs.current = Array(nearby.length)
                .fill(0)
                .map((_, i) => markerRefs.current[i] || createRef());
        }
    }, [nearby]);

    const coordinates = route?.params?.coordinates;
    const places = route?.params?.places;
    const userLocation = useSelector((store: RootState) => store.user.location);

    const initialRegion: Region = {
        latitude: coordinates ? coordinates.lat : userLocation.lat,
        longitude: coordinates ? coordinates.lng : userLocation.lng,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA
    };

    const [mapRegion, setMapRegion] = useState<Region>(initialRegion);
    const [isOverlayOpen, setIsOverlayOpen] = useState(true);

    const [selectedMarkerPlaceId, setSelectedMarkerPlaceId] =
        useState<string>("");

    // Pan the explore map to any coordinates passed to this screen.
    useEffect(() => {
        if (!coordinates) return;

        mapRef.current!.animateCamera({
            center: {
                latitude: coordinates.lat,
                longitude: coordinates.lng
            },
            zoom: 19
        });

        updateNearbyPlaces({
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            latitudeDelta: DEFAULT_DELTA,
            longitudeDelta: DEFAULT_DELTA
        }).then(() => {
            overlayRef.current?.scrollTo({x: 0, y: 0});
            markerRefs.current[0]?.showCallout();
        });
    }, [coordinates]);

    // Fit the map to show a list of places passed to this screen.
    // This is mainly used to view a list
    useEffect(() => {
        if (!places || places.length === 0) return;

        setNearby(places);
        mapRef.current?.fitToCoordinates(
            places.map((place) => place.geocodes.main),
            {animated: true}
        );
    }, [places]);

    /**
     * @description Update the nearby places markers on the map, function that is called when user stops panning the map around
     * @param region An optional origin region for nearby places
     */
    const updateNearbyPlaces = async (region?: Region) => {
        const originRegion = region || mapRegion;
        if (!originRegion) return;

        // Calculation derived from https://stackoverflow.com/questions/63457189/zoom-in-out-react-native-maps-based-on-radius-in-km-miles
        const radius = originRegion.latitudeDelta * 111045;
        const nearbyPlaces = await getNearbyPlaces(
            {
                lat: originRegion.latitude,
                lng: originRegion.longitude
            },
            radius
        );
        //Keep track of nearby places that are not duplicates, uses a dictionary to do this
        const uniqueNearbyPlaces = [
            ...new Map(
                [...nearby, ...nearbyPlaces].map((place) => [
                    place.fsq_id,
                    place
                ])
            ).values()
        ];
        if (uniqueNearbyPlaces) setNearby(uniqueNearbyPlaces);
    };

    // When the map region selection changes, update the current zoom level of the camera
    // The zoom level is used to calculate the radius for the nearby search.
    useEffectAsync(async () => {
        const camera = await mapRef.current!.getCamera();
        setZoomLevel(camera.zoom || 15);
    }, [mapRegion]);

    // Update the nearby places when the user stops the moving the map around.
    // The formula simply increases the delay between updating the nearby places depending on the current zoom level
    // of the map.
    // TODO Maybe disable refreshing on moving around if the user viewed the map through a Place / List screen.
    // useDebounce(updateNearbyPlaces, Math.max(300, (20 - zoomLevel) * 100), [
    //     lastUserMovedMapTime
    // ]);

    const openSearchedPlacePage = async (_: string, place_id: string) => {
        navigation.navigate("Place", {placeId: place_id});
    };

    const displayPlacePriceLevel = (place: FsqPlace): ReactNode => {
        if (!place.price || place.price < 0) return <></>;
        switch (place.price) {
            case 1:
                return (
                    <FontAwesome5
                        name="dollar-sign"
                        size={14}
                        color="#7B8794"
                    />
                );
            case 2:
                return (
                    <>
                        <FontAwesome5
                            name="dollar-sign"
                            size={14}
                            color="#7B8794"
                        />
                        <FontAwesome5
                            name="dollar-sign"
                            size={14}
                            color="#7B8794"
                        />
                    </>
                );
            default:
                return (
                    <>
                        <FontAwesome5
                            name="dollar-sign"
                            size={14}
                            color="#7B8794"
                        />
                        <FontAwesome5
                            name="dollar-sign"
                            size={14}
                            color="#7B8794"
                        />
                    </>
                );
        }
    };

    function closeModal() {
        dismiss();
        setIsListOpen(false);
    }

    const [loading, setIsLoading] = useState(false);
    //State to keep track of which list needs retrieval
    const [listRetrieval, setListRetrieval] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        //If list retrieval is given a listId, get all list places from backend
        if (listRetrieval) {
            dispatch(
                retrievePlacesFromList({listId: listRetrieval, userLocation})
            );
            //Once finished loading call view List on map again
            if (listOpStatus === "success") {
                viewListOnMap(listRetrieval);
            }
        }
    }, [listRetrieval, listOpStatus]);

    /**
     * @description
     * @param listId
     */
    async function viewListOnMap(listId: number) {
        if (listOpStatus !== "loading") {
            setIsLoading(true);
            try {
                const listPlaces =
                    store.getState().list.listInfo[listId].places;

                if (listPlaces) {
                    if (listPlaces.length > 0) {
                        mapRef.current?.fitToCoordinates(
                            listPlaces.map(
                                (place) =>
                                    place.listEntryPlaceInfo.geocodes.main
                            ),
                            {animated: true}
                        );
                        setIsLoading(false);
                    }

                    setListRetrieval(undefined);
                } else {
                    setListRetrieval(listId);
                }
            } catch (err) {
                console.error("In catch error", err, listId);
                setListRetrieval(listId);
            }
            closeListModal();
        }
    }

    function closeListModal() {
        bottomSheetRef.current.dismiss();
        setIsListOpen(false);
    }

    return (
        <SafeAreaView
            style={{flexGrow: 1, backgroundColor: COLOURS.PRIMARY_BACKGROUND}}
        >
            <StatusBar style="dark" />

            <View style={styles.headerContainer}>
                <ExploreSearchBar select={openSearchedPlacePage} />
            </View>

            {/* <Button style={styles.listButton} onPress={openListModal}>
                <Text style={{color: COLOURS.BRAND_800}}>
                    List
                </Text>
            </Button> */}

            {/* {
                isSearching &&
                <View style={{height: '40%',backgroundColor: 'gray'}}>
                    <Divider>
                        
                    </Divider>
                </View>
            } */}

            <MapView
                ref={mapRef}
                style={{height: "100%"}}
                showsUserLocation={true}
                showsMyLocationButton={true}
                provider={PROVIDER_GOOGLE}
                customMapStyle={GOOGLE_MAP_STYLE}
                initialRegion={initialRegion}
                onRegionChangeComplete={(region, details) => {
                    setMapRegion(region);
                    if (details.isGesture) setLastUserMovedMapTime(new Date());
                    updateNearbyPlaces(region);
                }}
            >
                {nearby.map((place, index) => {
                    return (
                        <CustomMarker
                            key={`place_marker_${place.fsq_id}`}
                            place={place}
                            onPress={(event) => {
                                event.stopPropagation();
                                setIsOverlayOpen((isOpen) => {
                                    // Ik hard the values for the calculation is bad, I'll change it when I fix
                                    // the styling
                                    const scroll = () =>
                                        overlayRef.current?.scrollTo({
                                            x: index * (windowWidth * 0.9 + 20),
                                            y: 0,
                                            animated: true
                                        });
                                    if (isOpen) scroll();
                                    // Let the overlay open, then scroll to the details of it.
                                    else setTimeout(scroll, 100);
                                    return true;
                                });
                                setSelectedMarkerPlaceId(place.fsq_id);
                            }}
                            selected={selectedMarkerPlaceId === place.fsq_id}
                            title={place.name}
                            forwardedRef={markerRefs.current[index]}
                            zIndex={index}
                        />
                    );
                })}
            </MapView>

            {!coordinates && !userLocation && (
                <ActivityIndicator
                    size={"large"}
                    style={{flex: 1}}
                />
            )}
            {loading && <LoadingIndicator />}
            {isOverlayOpen && (
                <ScrollView
                    ref={overlayRef}
                    style={{
                        ...styles.overlay_container,
                        bottom: windowHeight * 0.07
                    }}
                    horizontal={true}
                >
                    {nearby.map((place) => {
                        return (
                            <TouchableOpacity
                                key={`overlay_${place.fsq_id}`}
                                style={{
                                    ...styles.overlay_item,
                                    width: windowWidth * 0.9
                                }}
                                onPress={() =>
                                    navigation.navigate("Place", {
                                        placeId: place.fsq_id
                                    })
                                }
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        height: "100%",
                                        maxWidth: "100%",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    {place.photos &&
                                        place.photos.length > 0 && (
                                            <CustomImage
                                                source={{
                                                    uri: getPlacesPhoto(place)
                                                }}
                                                style={styles.overlay_image}
                                                resizeMode={"cover"}
                                            />
                                        )}
                                    <Box
                                        style={{
                                            justifyContent: "center",
                                            gap: 10,
                                            padding: 12,
                                            flex: 1
                                        }}
                                    >
                                        <Text style={styles.overlay_text}>
                                            {place.name}
                                        </Text>
                                        <Box
                                            style={{
                                                flexDirection: "row",
                                                gap: 20
                                            }}
                                        >
                                            <Box
                                                style={styles.overlay_info_box}
                                            >
                                                <FontAwesome5
                                                    name="map-marker-alt"
                                                    size={14}
                                                    color="#7B8794"
                                                />
                                                <Text style={STYLES.SUB_TEXT}>
                                                    {getDistanceFromLatLonInKm(
                                                        userLocation.lat,
                                                        userLocation.lng,
                                                        place.geocodes.main
                                                            .latitude,
                                                        place.geocodes.main
                                                            .longitude
                                                    )}{" "}
                                                    km
                                                </Text>
                                            </Box>
                                            {place.rating && (
                                                <Box
                                                    style={
                                                        styles.overlay_info_box
                                                    }
                                                >
                                                    <FontAwesome5
                                                        name="star"
                                                        size={14}
                                                        color="#7B8794"
                                                    />
                                                    <Text
                                                        style={STYLES.SUB_TEXT}
                                                    >
                                                        {place.rating}
                                                    </Text>
                                                </Box>
                                            )}
                                            <Box
                                                style={styles.overlay_info_box}
                                            >
                                                <Box
                                                    style={{
                                                        flexDirection: "row"
                                                    }}
                                                >
                                                    {displayPlacePriceLevel(
                                                        place
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}

            {/*List explore sheet*/}
            <CustomBottomModal
                closeFunc={() => setIsListOpen(false)}
                snapIndex={5}
                ref={bottomSheetRef}
            >
                <BottomSheetView style={{height: "100%"}}>
                    {/*Header component with search and add list buttons*/}
                    <ScreenHeader
                        headerText={"Lists"}
                        leftIcon={<></>}
                        rightIcon={
                            <IconButton
                                colorScheme="black"
                                variant={"ghost"}
                                _icon={{
                                    as: AntDesign,
                                    name: "close"
                                }}
                                onPress={closeModal}
                            />
                        }
                    />

                    {/*Display user lists component*/}
                    <Box style={{flexGrow: 1}}>
                        <FlatList
                            style={{padding: 20}}
                            data={lists}
                            renderItem={({item}) => (
                                <ListComponent
                                    isFollowing={false}
                                    list={item}
                                    key={item.listId}
                                    onPress={() => viewListOnMap(item.listId)}
                                />
                            )}
                        ></FlatList>
                    </Box>
                </BottomSheetView>
            </CustomBottomModal>
        </SafeAreaView>
    );
}

export default Explore;

const styles = StyleSheet.create({
    headerContainer: {
        height: "8%",
        zIndex: 99,
        width: "100%",
        backgroundColor: COLOURS.PRIMARY_BACKGROUND
    },
    container: {
        flex: 1
    },
    map: {
        width: "100%",
        height: "100%"
    },
    overlay_container: {
        position: "absolute",
        zIndex: 10,
        height: "20%",
        width: "100%",
        flexDirection: "row"
    },
    overlay_item: {
        borderRadius: 20,
        marginHorizontal: 10,
        backgroundColor: "rgba(255,255,255,0.75)",
        height: "100%"
    },
    overlay_image: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        flexBasis: "40%",
        height: "100%",
        width: "auto"
    },
    overlay_text: {
        fontFamily: FONTS.MULISH_SEMI_BOLD,
        fontSize: 16,
        fontWeight: "600",
        color: "#323F4B"
    },
    overlay_info_box: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8
    },
    listButton: {
        position: "absolute",
        top: 120,
        left: 16,
        width: 65,
        zIndex: 10,
        borderRadius: 72,
        backgroundColor: "white",
        borderColor: COLOURS.BRAND_800,
        borderWidth: 1,
        paddingHorizontal: -20
    }
});
