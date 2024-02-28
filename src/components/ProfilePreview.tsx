import {useNavigation} from "@react-navigation/native";
import {UserPreview} from "@screens/Friends";
import {NavigationProps} from "@util/types/navigation.types";
import {Divider} from "native-base";
import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

type ProfilePreviewProps = {
    info: UserPreview;
    divider: boolean;
    horizontal: boolean;
};

/**
 * @description Profile preview in searching users result
 * @param info
 */
function ProfilePreview({info, divider, horizontal}: ProfilePreviewProps) {
    const navigation = useNavigation<NavigationProps>();

    return (
        <TouchableOpacity
            style={{}}
            onPress={() => {
                navigation.navigate("PublicProfile", {profileInfo: info});
            }}
        >
            <View
                style={{
                    ...styles.previewContainer,
                    flexDirection: horizontal ? "row" : "column"
                }}
            >
                <Image
                    source={{uri: info.avatar}}
                    style={styles.image}
                    alt="Profile Avatar"
                />
                <Text>{info.username}</Text>
            </View>
            {divider && (
                <Divider
                    my="4"
                    thickness="0.5"
                    _light={{
                        bg: "muted.800"
                    }}
                    _dark={{
                        bg: "muted.50"
                    }}
                />
            )}
        </TouchableOpacity>
    );
}

export default ProfilePreview;

const styles = StyleSheet.create({
    previewContainer: {
        width: "100%",
        // borderRadius: 10,
        // borderWidth: 1,
        // borderColor: COLOURS.GRAY_400,
        height: 50,
        flexDirection: "row",
        gap: 20,
        alignItems: "center"
    },
    image: {
        borderRadius: 100,
        width: 50,
        height: 50
    }
});
