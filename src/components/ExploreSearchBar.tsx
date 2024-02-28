import {Entypo, FontAwesome, MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {Box, Button, FlatList, Divider, Icon, Input} from "native-base";
import {
    Dimensions,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import React, {useState} from "react";
import {useDebounce} from "../hooks/useDebounce";
import {COLOURS} from "../util/constants/styles/colours.constants";
import {FONTS} from "../util/constants/styles/fonts.constants";
import {
    placesAutocomplete,
    placesSearch
} from "../util/apis/places/places.util";
import {FsqPlace} from "../util/types/fsq/fsq.places.types";
import {useSelector} from "react-redux";
import {RootState} from "@redux_store/store";
import {STYLES} from "@util/constants/styles/styles.constants";
import LoadingIndicator from "./LoadingIndicator";
export type SearchResult = {
    name: string;
    id: string;
    location: string;
    distance: number;
};

type RecentSearch = {
    name: string;
    place_id: string;
};

interface SearchBarProps {
    select: (description: string, placeId: string) => void;
}

/**
 * @description Search bar component that searches for places using google's autocomplete api
 * @param select Function to set the selected details in a state
 * @see SavePlace
 */
function ExploreSearchBar({select}: SearchBarProps) {
    // Get the user's location
    const userLocation = useSelector((store: RootState) => store.user.location);

    // Whether the search results should take the full page
    const [isFullPage, setIsFullPage] = useState(false);
    // The search query the user is currently typing
    const [search, setSearch] = useState("");
    //List of search results returned by the API
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    const windowHeight = Dimensions.get("window").height;

    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem("recentSearches").then((response) => {
                if (!response) return;
                setRecentSearches(JSON.parse(response));
            });
        }, [])
    );

    /**
     * @description Call back function fired to send api request for autocompletion
     * @returns
     */
    async function onChangeText() {
        const query = search.trim();
        if (!query) {
            setResults([]);
            return;
        }

        if (query.length >= 2) {
            setIsLoading(true);
            const searchResults = await placesAutocomplete(query, userLocation);
            // const searchResults = await placesSearch(query, userLocation);
            updateResults(searchResults || []);
        }
    }

    const updateResults = (places: FsqPlace[]) => {
        if (places && places.length > 0) {
            setResults(
                places.map((place) => ({
                    name: place.name,
                    id: place.fsq_id,
                    location: place.location.formatted_address,
                    distance: place.distance
                }))
            );
        } else {
            setResults([
                {
                    name: "No results found",
                    id: "-1",
                    location: "Nothing matching that query could be found",
                    distance: 0
                }
            ]);
        }
        setIsLoading(false);
    };

    //Delay the api firing only when user stops typing after 400ms
    useDebounce(onChangeText, 150, [search]);

    /**
     * @description Clear input search and prediction results
     */
    function closeSearchPage() {
        Keyboard.dismiss();
        setIsFullPage(false);
        setSearch("");
        setResults([]);
    }

    const dispatchSelect = (name: string, placeId: string) => {
        closeSearchPage();
        select(name, placeId);
    };

    /**
     * The function that is run when a search result is clicked on.
     *
     * @param place The google place result
     */
    const handleSearchClick = async (result: SearchResult) => {
        if (result.id === "-1") return;
        // Add the clicked on result to the list of recent searches.
        const updatedRecentSearches: RecentSearch[] = [
            {
                name: result.name,
                place_id: result.id
            },
            ...recentSearches
        ];

        // Update the local storage's recent searches. The slice function is used to limit the number of recent
        // searches to 10.
        await AsyncStorage.setItem(
            "recentSearches",
            JSON.stringify(updatedRecentSearches.slice(0, 10))
        );

        // Call the 'select' function on the search result.
        dispatchSelect(result.name, result.id);
    };

    /**
     * The function that is run when a cuisine search is clicked on.
     *
     * @param cuisine The name of the cuisine
     */
    const handleCuisineClick = async (cuisine: string) => {
        setIsLoading(true);
        // Makes a query by appending 'food' to the cuisine
        const searchResults = await placesSearch(
            `${cuisine} food`,
            userLocation
        );

        // Updates the results
        updateResults(searchResults || []);
    };

    /**
     * @description Clear recent searches
     */
    async function clearRecent() {
        await AsyncStorage.removeItem("recentSearches");
        setRecentSearches([]);
    }

    return (
        <Box style={{}}>
            {isLoading && <LoadingIndicator />}

            <Box style={styles.searchBarContainer}>
                <Input
                    placeholder="Search People & Places"
                    width="100%"
                    borderRadius="4"
                    py="3"
                    px="1"
                    fontSize="14"
                    InputLeftElement={
                        <Icon
                            m="2"
                            ml="3"
                            size="6"
                            color="gray.400"
                            as={
                                isFullPage ? (
                                    <FontAwesome
                                        name="chevron-left"
                                        color={COLOURS.GRAY_600}
                                        onPress={() => closeSearchPage()}
                                    />
                                ) : (
                                    <MaterialIcons name="search" />
                                )
                            }
                        />
                    }
                    InputRightElement={
                        isFullPage && (
                            <Icon
                                m="2"
                                mr="3"
                                size="6"
                                color="gray.400"
                                onPress={() => setSearch("")}
                                as={<Entypo name="cross" />}
                            />
                        )
                    }
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => setIsFullPage(true)}
                />
            </Box>

            {isFullPage && (
                <Box
                    style={{
                        width: "100%",
                        height: windowHeight * 0.8,
                        //height: '100%',
                        //backgroundColor: 'red',
                        zIndex: 20
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                    >
                        {results.length > 0 ? (
                            <FlatList
                                style={{
                                    ...styles.list,
                                    height: windowHeight * 0.78
                                }}
                                data={results}
                                renderItem={({item}) => {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() =>
                                                handleSearchClick(item)
                                            }
                                            style={styles.resultItem}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 8
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.resultItemName
                                                    }
                                                >
                                                    {item.name}
                                                </Text>
                                                {item.distance !== 0 && (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "center",
                                                            gap: 8
                                                        }}
                                                    >
                                                        <Entypo
                                                            name="location"
                                                            size={18}
                                                            color="black"
                                                        />
                                                        <Text
                                                            style={
                                                                styles.distanceText
                                                            }
                                                        >{`${(item.distance / 1000).toFixed(1)} km`}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text
                                                style={styles.resultItemAddress}
                                            >{`${item.location}`}</Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    ...styles.recentSearchesBox,
                                    flexGrow: 1,
                                    maxHeight: windowHeight * 0.8
                                }}
                            >
                                <Divider />
                                {recentSearches.length > 0 && (
                                    <>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                backgroundColor:
                                                    COLOURS.PRIMARY_BACKGROUND
                                            }}
                                        >
                                            <Text style={styles.searchHeader}>
                                                Recent searches
                                            </Text>
                                            <Button
                                                size="md"
                                                colorScheme={"red"}
                                                variant={"ghost"}
                                                onPress={clearRecent}
                                            >
                                                Clear recent
                                            </Button>
                                        </View>

                                        {recentSearches.map((recent) => (
                                            <TouchableOpacity
                                                key={recent.place_id}
                                                style={styles.searchItemBox}
                                                onPress={() =>
                                                    dispatchSelect(
                                                        recent.name,
                                                        recent.place_id
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.searchItemText
                                                    }
                                                >
                                                    {recent.name}
                                                </Text>
                                                <FontAwesome
                                                    name="search"
                                                    size={16}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}

                                <Text style={styles.searchHeader}>
                                    Cuisines
                                </Text>

                                {[
                                    "Chinese",
                                    "Mexican",
                                    "Thai",
                                    "Indian",
                                    "Japanese"
                                ].map((cuisine) => (
                                    <TouchableOpacity
                                        key={cuisine}
                                        style={styles.searchItemBox}
                                        onPress={() =>
                                            handleCuisineClick(cuisine)
                                        }
                                    >
                                        <Text style={styles.searchItemText}>
                                            {cuisine}
                                        </Text>
                                        <FontAwesome
                                            name="search"
                                            size={16}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </TouchableWithoutFeedback>
                </Box>
            )}
        </Box>
    );
}

export default ExploreSearchBar;

const styles = StyleSheet.create({
    list: {
        width: "100%",
        backgroundColor: COLOURS.PRIMARY_BACKGROUND,
        padding: 16,
        flexGrow: 1
    },
    resultItem: {
        backgroundColor: COLOURS.PRIMARY_BACKGROUND,
        paddingVertical: 10,
        gap: 8,
        zIndex: 20
    },
    resultItemName: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        color: "#323F4B"
    },
    resultItemAddress: {
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.2,
        color: "#7B8794"
    },
    distanceText: {
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.2,
        fontWeight: "700",
        color: "#6d7175"
    },
    searchBarContainer: {
        paddingHorizontal: 20,
        backgroundColor: COLOURS.PRIMARY_BACKGROUND
    },
    searchBarInput: {
        height: 48,
        width: "100%",
        backgroundColor: COLOURS.WHITE,
        borderRadius: 8,
        ...STYLES.BASIC_BORDER,
        borderColor: COLOURS.GRAY_200,
        paddingLeft: 40
    },
    searchBarIcon: {
        top: 10,
        zIndex: 20
    },
    recentSearchesBox: {
        // width: '100%',
        // zIndex: 3,
        // position: 'absolute',
        top: 15,
        //borderRadius: 15,
        backgroundColor: COLOURS.PRIMARY_BACKGROUND,
        padding: 16,
        gap: 3
    },
    searchHeader: {
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 20,
        letterSpacing: 0.15,
        marginVertical: 5,
        paddingVertical: 5
    },
    searchItemBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5
    },
    searchItemText: {
        fontFamily: FONTS.MULISH_REGULAR,
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 23,
        letterSpacing: 0,
        color: COLOURS.GRAY_600
    }
});
