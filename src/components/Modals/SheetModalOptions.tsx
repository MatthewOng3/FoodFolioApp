import {AntDesign} from "@expo/vector-icons";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {IconButton} from "native-base";
import React from "react";
import {StyleSheet, Text, View} from "react-native";

type SheetModalOptionsProps = {
    closeModal: () => void;
    sheetTitle: string;
    children: JSX.Element;
};

/**
 * @description
 */
function SheetModalOptions({
    closeModal,
    sheetTitle,
    children
}: SheetModalOptionsProps) {
    return (
        <BottomSheetView
            style={{paddingHorizontal: 16, paddingVertical: 15, height: "100%"}}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{sheetTitle}</Text>
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
            <View style={styles.optionsContainer}>{children}</View>
        </BottomSheetView>
    );
}

export default SheetModalOptions;

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
    optionsContainer: {
        gap: 10
    },
    optionsText: {
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "Mulish_500Medium"
    }
});
