import {AppDispatch} from "@/App";
import SearchBar from "@components/TextInput/SearchBar";
import SingleChoiceButtons from "@components/Buttons/SingleChoiceButtons";
import FriendPreview from "@components/FriendPreview";
import LoadingIndicator from "@components/LoadingIndicator";
import ScreenView from "@components/ui/views/ScreenView";
import {Entypo, Feather, MaterialIcons, Ionicons} from "@expo/vector-icons";
import {useDebounce} from "@hooks/useDebounce";
import {useEffectAsync} from "@hooks/useEffectAsync";
import useRefresh from "@hooks/useRefresh";
import {useSession} from "@hooks/useSession";
import {useNavigation} from "@react-navigation/native";
import {
    friendsFetchStatus,
    getUserFriends,
    retrieveUserFriends
} from "@redux_store/user";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {getRecommendedUsers} from "@util/apis/users/users.api.util";
import {FetchStatus} from "@util/constants/constraints";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {NavigationProps} from "@util/types/navigation.types";
import {Divider, FlatList, IconButton} from "native-base";
import React, {useState} from "react";
import {
    Dimensions,
    Keyboard,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

import {useDispatch, useSelector} from "react-redux";

export type UserPreview = {
    profileId: number;
    username: string;
    bio: string;
    avatar: string;
};

enum DisplayType {
    RECOMMENDED,
    FRIENDS
}

/**
 * @description Page where users can find friends
 */
function Friends() {
    const navigation = useNavigation<NavigationProps>();
    const session = useSession();
    const dispatch = useDispatch<AppDispatch>();

    // The search query the user is currently typing
    const [searchText, setSearchText] = useState("");
    //Page loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //State for the results when searching friends
    const [results, setResults] = useState<UserPreview[]>([]);
    //State for recommended friends
    const [recFriends, setRecFriends] = useState<UserPreview[]>([]);
    const [isSearchingPage, setIsSearchingPage] = useState<boolean>(false);

    const windowHeight = Dimensions.get("window").height;

    // State for which friends list is shown
    const [displayType, setDisplayType] = useState<DisplayType>(
        DisplayType.RECOMMENDED
    );

    //Retrieve user friends
    const friends = useSelector(getUserFriends);
    //Fetch status for user friends
    const fetchStatus = useSelector(friendsFetchStatus);

    useEffectAsync(async () => {
        //If the status is Idle then perform a retrievel of user friends
        if (fetchStatus === FetchStatus.Idle) {
            dispatch(retrieveUserFriends({profileId: session.profileId}));
        }

        //Retrieve recommended ujsers
        const recommendedUsers = await getRecommendedUsers(session.profileId);

        if (recommendedUsers) {
            setRecFriends(recommendedUsers);
        }
    }, [fetchStatus]);

    /**
     * @description Callback function called when user types in search bar
     */
    async function onChangeText() {
        //Trim any trailing spaces
        const query = searchText.trim();
        if (!query) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const searchResults = await supabaseCall("search_users", {
            username_search_text: query,
            user_profile_id: session.profileId
        });
        updateResults(searchResults || []);
    }

    //Delay the call to search users
    useDebounce(onChangeText, 250, [searchText]);

    /**
     * @description Function to update results state based on users argument
     * @param users
     */
    function updateResults(users: UserPreview[]) {
        users && users.length > 0 ? setResults([...users]) : setResults([]);
        setIsLoading(false);
    }

    /**
     * @description Function to get off searching page and remove the text being searched for
     */
    function resetSearch() {
        setSearchText("");
        setIsSearchingPage(false);
    }

    const onRefreshFunc = React.useCallback(() => {
        dispatch(retrieveUserFriends({profileId: session.profileId}));
    }, []);

    const {refreshing, onRefresh: onRefreshHook} = useRefresh(onRefreshFunc);

    const topButtons = [
        {
            key: "Recommended",
            value: DisplayType.RECOMMENDED
        },
        {
            key: "Your Friends",
            value: DisplayType.FRIENDS
        }
    ];

    const rightIcon = (
        <TouchableOpacity onPress={() => setIsSearchingPage(true)}>
            <Feather
                name="user-plus"
                size={26}
                color={COLOURS.GRAY_600}
            />
        </TouchableOpacity>
    );

    const leftIcon = (
        <IconButton
            _icon={{as: Entypo, name: "chevron-left"}}
            onPress={resetSearch}
            colorScheme={"black"}
        />
    );

    return (
        <ScreenView
            title={isSearchingPage ? "Add friend" : "Friends"}
            rightIcon={isSearchingPage ? <></> : rightIcon}
            leftIcon={isSearchingPage ? leftIcon : <></>}
        >
            {isSearchingPage ? (
                <View
                    style={{
                        width: "100%",
                        height: windowHeight * 0.8,
                        zIndex: 1
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                    >
                        <View>
                            <SearchBar
                                crossEnabled={searchText.length > 0}
                                leftElem={
                                    <MaterialIcons
                                        name="search"
                                        size={26}
                                        color={COLOURS.GRAY_600}
                                        style={{marginLeft: 10}}
                                    />
                                }
                                onFocus={() => setIsSearchingPage(true)}
                                searchText={searchText}
                                setSearchText={setSearchText}
                            />

                            <Divider
                                style={{
                                    marginTop: 15,
                                    borderWidth: 1,
                                    borderColor: "gray",
                                    width: "100%"
                                }}
                            />
                            {results.length > 0 && (
                                <FlatList
                                    style={{
                                        ...styles.list,
                                        height: windowHeight * 0.78
                                    }}
                                    data={results}
                                    renderItem={({item}) => {
                                        return (
                                            <FriendPreview
                                                user={item}
                                                key={item.profileId}
                                                icon={
                                                    <Feather
                                                        name="plus"
                                                        size={24}
                                                    />
                                                }
                                                onIconPress={() => {
                                                    navigation.navigate(
                                                        "PublicProfile",
                                                        {
                                                            profileInfo: item
                                                        }
                                                    );
                                                }}
                                            />
                                        );
                                    }}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            ) : (
                <>
                    <SingleChoiceButtons
                        onPress={(choice) => setDisplayType(choice)}
                        choices={topButtons}
                    />

                    {/*Search Bar*/}
                    {/* <SearchBar 
                        crossEnabled={searchText.length > 0} 
                        leftElem={
                            <MaterialIcons
                            name="search"
                            size={26}
                            color={COLOURS.GRAY_600}
                            style={{marginLeft: 10}}
                        /> 
                        }
                        onFocus={() => setIsSearchingPage(true)}
                        searchText={searchText}
                        setSearchText={setSearchText}/> */}

                    {/*Default Friends displays*/}
                    {displayType === DisplayType.RECOMMENDED ? (
                        <FlatList
                            data={recFriends}
                            renderItem={({item}) => (
                                <FriendPreview
                                    user={item}
                                    key={item.profileId}
                                    icon={
                                        <Feather
                                            name="plus"
                                            size={24}
                                        />
                                    }
                                    onIconPress={() => {
                                        navigation.navigate("PublicProfile", {
                                            profileInfo: item
                                        });
                                    }}
                                />
                            )}
                            keyExtractor={(item) =>
                                `rec_friend_${item.profileId}`
                            }
                            style={{marginTop: 30}}
                            contentContainerStyle={{flexGrow: 1, gap: 16}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefreshHook}
                                />
                            }
                            ListEmptyComponent={
                                <Text>
                                    Oh no. We currently have no recommendations.
                                    Search for friends above!
                                </Text>
                            }
                        />
                    ) : (
                        <FlatList
                            data={friends.friends}
                            renderItem={({item}) => (
                                <FriendPreview
                                    user={item}
                                    key={item.profileId}
                                    icon={
                                        <Ionicons
                                            name="ellipsis-horizontal-sharp"
                                            size={24}
                                        />
                                    }
                                    onIconPress={() => {
                                        navigation.navigate("PublicProfile", {
                                            profileInfo: item
                                        });
                                    }}
                                />
                            )}
                            keyExtractor={(item) => `friend_${item.profileId}`}
                            style={{marginTop: 30}}
                            contentContainerStyle={{flexGrow: 1, gap: 16}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefreshHook}
                                />
                            }
                            ListEmptyComponent={
                                <Text>
                                    You have no friends yet. Add one now!
                                </Text>
                            }
                        />
                    )}
                </>
            )}
            {isLoading && <LoadingIndicator />}
        </ScreenView>
    );
}

export default Friends;

const styles = StyleSheet.create({
    list: {
        width: "100%",
        //backgroundColor: COLOURS.PRIMARY_BACKGROUND,
        padding: 16,
        flexGrow: 1
    },
    searchBarContainer: {
        flexDirection: "row",
        width: "100%",
        borderRadius: 8,
        padding: 6,
        marginTop: 20,
        justifyContent: "center",
        borderColor: COLOURS.GRAY_200,
        borderWidth: 1
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
    }
});
