//Icons
import {AntDesign, FontAwesome5} from "@expo/vector-icons";
import {displayRating} from "@util/DisplayRating";
import {IconButton} from "native-base";
import React, {memo, useState} from "react";
import {Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {getPlacesPhoto} from "@util/apis/places/places.util";
import {FsqPlace} from "@util/types/fsq/fsq.places.types";
import CustomImage from "./CustomImage";

type ListEntryProps = {
    listEntryId: number;
    description: string;
    place: FsqPlace;
    entryType: number;
    isEditing: boolean;
    removeListEntry: (entryListId: number) => void;
    setDelListEntryIds: React.Dispatch<React.SetStateAction<number[]>>;
};

/**
 * @description List entry in the list info page
 * @see ListInfo
 */
function ListEntryPlace({
    listEntryId,
    description,
    place,
    isEditing,
    removeListEntry,
    setDelListEntryIds
}: ListEntryProps) {
    const [isDeleted, setIsDeleted] = useState(false);

    /**
     * @description Redirect to google place or website
     */
    async function goToPlace() {
        //await Linking.openURL(getGoogleMapUrl(place.fsq_id))
        if (place.website) {
            await Linking.openURL(place.website);
        }
    }

    /**
     * @description Delete the list entry by removing from parent local list entry state and adding to the deleting list entries
     */
    function deleteListEntry() {
        if (!isDeleted) {
            setDelListEntryIds((prevIds) => [...prevIds, listEntryId]);

            //Remove
            removeListEntry(listEntryId);
            setIsDeleted(true); // Mark the list entry as deleted
        }
    }

    return (
        <TouchableOpacity
            style={{
                gap: 8,
                marginBottom: 16
            }}
            onPress={goToPlace}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: 16
                }}
            >
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    {isEditing && (
                        <IconButton
                            colorScheme={"red"}
                            key={"ghost"}
                            variant={"ghost"}
                            size={8}
                            _icon={{
                                as: AntDesign,
                                name: "closecircle",
                                size: "lg"
                            }}
                            onPress={deleteListEntry}
                            style={{marginRight: 10}}
                        />
                    )}
                    <CustomImage
                        resizeMode={"cover"}
                        style={styles.place_image}
                        source={{uri: getPlacesPhoto(place)}}
                    />
                    <View
                        style={{
                            justifyContent: "center",
                            gap: 4
                        }}
                    >
                        <Text style={styles.place_title_text}>
                            {place.name}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 8
                            }}
                        >
                            <View style={styles.place_sub_box}>
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={16}
                                    color="#7B8794"
                                />
                                <Text style={styles.place_sub_text}>
                                    {`${place.distance} km`}
                                </Text>
                            </View>
                            <View style={styles.place_sub_box}>
                                <FontAwesome5
                                    name="star"
                                    size={16}
                                    color="#7B8794"
                                />
                                <Text style={styles.place_sub_text}>
                                    {displayRating(place.rating)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Text style={styles.place_description_text}>{description}</Text>
        </TouchableOpacity>
    );
}

export default memo(ListEntryPlace);

const styles = StyleSheet.create({
    place_image: {
        borderRadius: 8,
        height: 56,
        width: 56,
        marginRight: 10
    },
    place_title_text: {
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 23,
        letterSpacing: 0,
        color: "#323F4B"
    },
    place_sub_box: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 4
    },
    place_sub_text: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0.2,
        color: "#7B8794"
    },
    place_description_text: {
        fontSize: 15,
        fontWeight: "400",
        lineHeight: 23,
        letterSpacing: 0,
        color: "#4E5D6C",
        marginHorizontal: 5
    }
});
