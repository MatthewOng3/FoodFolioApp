import {AntDesign} from "@expo/vector-icons";
import {getGoogleMapUrl} from "@util/apis/google/google.maps.util";

import {COLORS} from "@util/constants/theme";
import {Box, Button} from "native-base";
import React from "react";
import {Linking, StyleSheet, Text} from "react-native";

export interface GoogleMapsInfo {
    rating: number;
    placeId: string;
    text: string | null;
}

/**
 * @description Google Button Component to open place in google maps
 * @see SavePlace
 * @see RestaurantDetails
 */
function OpenInGoogle({rating, placeId, text}: GoogleMapsInfo) {
    /**
     * @description View restaurant location on google maps
     */
    async function openGoogleMaps() {
        await Linking.openURL(getGoogleMapUrl(placeId));
    }

    return (
        <Button
            bg={"app.lime"}
            style={{...styles.locationButton}}
            _pressed={styles.buttonPressed}
            onPress={openGoogleMaps}
            leftIcon={
                <AntDesign
                    name="google"
                    size={24}
                    color="black"
                />
            }
        >
            <Box
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Text>{text}</Text>
                <Box
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10
                    }}
                >
                    {rating ? (
                        <AntDesign
                            name="star"
                            size={18}
                            color={COLORS.orange}
                        />
                    ) : (
                        ""
                    )}
                    <Text
                        style={{
                            fontSize: 15,
                            marginLeft: 3,
                            fontWeight: "bold"
                        }}
                    >
                        {rating ? rating : ""}
                    </Text>
                </Box>
            </Box>
        </Button>
    );
}

const styles = StyleSheet.create({
    locationButton: {
        borderRadius: 25,
        height: 45
    },
    buttonPressed: {
        opacity: 0.7,
        backgroundColor: COLORS.orange
    }
});

export default OpenInGoogle;
