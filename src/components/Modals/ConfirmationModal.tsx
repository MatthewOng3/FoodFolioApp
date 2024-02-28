import {AntDesign} from "@expo/vector-icons";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Button, IconButton} from "native-base";
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {COLORS} from "@util/constants/theme";

type ConfirmationModal = {
    title: string;
    subText: string;
    actionColor: string;
    actionText: string;
    onPress: () => void;
    closeModal: () => void;
    cancelText: string;
};

/**
 * @description Generic confirmation modal with a confirmation function
 * @param onPress function to be executed when user confirms something
 * @returns
 */
function ConfirmationModal({
    title,
    subText,
    actionColor,
    actionText,
    cancelText,
    onPress,
    closeModal
}: ConfirmationModal) {
    return (
        <BottomSheetView
            style={{paddingHorizontal: 16, paddingVertical: 15, height: "100%"}}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <IconButton
                    colorScheme={"black"}
                    key={"ghost"}
                    variant={"ghost"}
                    _icon={{
                        as: AntDesign,
                        name: "close"
                    }}
                    onPress={closeModal}
                />
            </View>
            <View style={{marginBottom: 20}}>
                <Text>{subText}</Text>
            </View>
            <View style={styles.optionsContainer}>
                <Button
                    onPress={closeModal}
                    style={{
                        ...styles.buttonsContainer,
                        backgroundColor: "white"
                    }}
                >
                    <Text style={{fontWeight: "400", color: COLORS.brown600}}>
                        {cancelText}
                    </Text>
                </Button>
                <Button
                    onPress={onPress}
                    style={{
                        ...styles.buttonsContainer,
                        backgroundColor: actionColor
                    }}
                >
                    {actionText}
                </Button>
            </View>
        </BottomSheetView>
    );
}

export default ConfirmationModal;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 34,
        marginBottom: 10
    },
    titleText: {
        fontSize: 20,
        fontWeight: "700"
    },
    subText: {
        fontSize: 15,
        lineHeight: 22.5,
        fontWeight: "400",
        fontFamily: "Mulish_500Medium"
    },
    optionsContainer: {
        gap: 8,
        flexDirection: "row"
    },
    optionsText: {
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "Mulish_500Medium"
    },
    buttonsContainer: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.brown600,
        width: "50%"
    }
});
