import {AppDispatch} from "@/App";
import SingleChoiceButtons from "@components/Buttons/SingleChoiceButtons";
import ListComponent from "@components/ListComponent";
import LoadingIndicator from "@components/LoadingIndicator";
import NewListModal from "@components/Modals/NewListModal";
import ScreenView from "@components/ui/views/ScreenView";
import {Feather} from "@expo/vector-icons";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import useRefresh from "@hooks/useRefresh";
import {useSession} from "@hooks/useSession";
import {
    getListState,
    isListSliceLoading,
    retrieveLists
} from "@redux_store/lists";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {NavigationProps} from "@util/types/navigation.types";
import {Box, FlatList} from "native-base";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {RefreshControl, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";

type ListsScreenProps = {
    navigation: NavigationProps;
};

/**
 * Lists screen where users can create new lists, and view their lists, clicking the list will redirect to list
 * info page
 */
function Lists({navigation}: ListsScreenProps) {
    const session = useSession();
    const dispatch: AppDispatch = useDispatch();

    //useRef that is needed for a value that is not needed for rerendering components
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    //Since lists are stored in redux as a dictionary, retrieve that, then we will memoize the result and only rerender when state changes
    const listDict = useSelector(getListState);
    const lists = useMemo(() => Object.values(listDict), [listDict]);

    //List loading state
    const listIsLoading = useSelector(isListSliceLoading);

    //Retrieve user lists when profile changes
    useEffect(() => {
        dispatch(retrieveLists({profileId: session?.profileId}));
    }, [session.profileId]);

    const handlePresentPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    function goToListInfo(listId: number, listShareId: string) {
        navigation.navigate("ListInfo", {
            listId,
            listShareId,
            profileId: session.profileId
        });
    }

    //Function callback when list is refreshed
    const onRefreshFunc = useCallback(() => {
        dispatch(retrieveLists({profileId: session.profileId}));
    }, []);

    const {refreshing, onRefresh: onRefreshHook} = useRefresh(onRefreshFunc);

    const topButtons = [
        {
            key: "All",
            value: 0
        },
        {
            key: "Your lists",
            value: 1
        },
        {
            key: "Followed lists",
            value: 2
        }
    ];

    const rightIcons = (
        <Box style={{flexDirection: "row", gap: 16}}>
            {/*<TouchableOpacity onPress={handlePresentPress}>*/}
            {/*    <Ionicons*/}
            {/*        name="search-outline"*/}
            {/*        size={24}*/}
            {/*        color={COLOURS.GRAY_600}*/}
            {/*    />*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity onPress={handlePresentPress}>
                <Feather
                    name="plus"
                    size={26}
                    color={COLOURS.GRAY_600}
                />
            </TouchableOpacity>
        </Box>
    );

    return (
        <ScreenView
            title="Lists"
            rightIcon={rightIcons}
        >
            {/*Button choices at the top for choosing lists*/}
            <SingleChoiceButtons
                onPress={() => console.log("Test")}
                choices={topButtons}
            />

            {/*Display user lists component*/}
            <Box style={{flexGrow: 1}}>
                {listIsLoading && <LoadingIndicator />}
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefreshHook}
                        />
                    }
                    style={{marginTop: 20}}
                    data={lists}
                    renderItem={({item}) => (
                        <ListComponent
                            isFollowing={false}
                            list={item}
                            key={item.listId}
                            onPress={() =>
                                goToListInfo(item.listId, item.listShareId)
                            }
                        />
                    )}
                ></FlatList>
            </Box>

            {/*Create new list model */}
            <NewListModal
                ref={bottomSheetRef}
                closeModal={() => bottomSheetRef.current?.close()}
            />
        </ScreenView>
    );
}

export default Lists;
