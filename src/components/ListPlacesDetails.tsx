import {AppDispatch} from "@/App";
import useRefresh from "@hooks/useRefresh";
import {retrievePlacesFromList} from "@redux_store/lists";
import {getUserLocation} from "@redux_store/user";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {ListEntryPlaces} from "@util/types/list.types";
import {FlatList} from "native-base";
import React, {useState} from "react";
import {RefreshControl, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import ListEntryPlace from "./ListEntryPlace";

type ListPlacesDetailsProps = {
    listPlaces: ListEntryPlaces[];
    profileId: number;
    listId: number;
    isEditing: boolean;
    setDelListEntryIds: (arg: number[]) => void;
};

/**
 * @description Component to display the place details preview of a list
 * @param listPlaces List places
 * @param isEditing Boolean indicating
 * @param setDelListEntryIds Callback function to set the state for deleting list entry ids
 * @see ListInfo.tsx
 */
function ListPlacesDetails({
    listPlaces,
    listId,
    isEditing,
    setDelListEntryIds
}: ListPlacesDetailsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const userLocation = useSelector(getUserLocation);
    const [listPlacesDetails, setListPlacesDetails] =
        useState<ListEntryPlaces[]>(listPlaces);

    const onRefreshFunc = React.useCallback(() => {
        dispatch(
            retrievePlacesFromList({listId: listId, userLocation: userLocation})
        );
    }, []);

    const {refreshing, onRefresh: onRefreshHook} = useRefresh(onRefreshFunc);

    /**
     * @description Remove an entry from local list places
     * @param entryListId Entry list id of the object being removed
     */
    function removeListEntry(entryListId: number) {
        const newListPlaces = listPlaces.filter((place) => {
            return place.listEntryId !== entryListId;
        });

        setListPlacesDetails(newListPlaces);
    }

    return (
        <View
            style={{
                padding: 20,
                gap: 16,
                flex: 1
            }}
        >
            <Text style={styles.placesHeaderText}>
                {listPlacesDetails.length} places
            </Text>
            <FlatList
                data={listPlacesDetails}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefreshHook}
                    />
                }
                renderItem={({item}) => (
                    <ListEntryPlace
                        description={item.listEntryDesc}
                        place={item.listEntryPlaceInfo}
                        entryType={item.listEntryType}
                        key={item.listEntryId}
                        isEditing={isEditing}
                        listEntryId={item.listEntryId}
                        removeListEntry={removeListEntry}
                        setDelListEntryIds={setDelListEntryIds}
                    />
                )}
                keyExtractor={(item) => item.listEntryId.toString()}
            />
        </View>
    );
}

export default ListPlacesDetails;

const styles = StyleSheet.create({
    placesHeaderText: {
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 20,
        letterSpacing: 0.15,
        color: COLOURS.GRAY_800
    }
});
