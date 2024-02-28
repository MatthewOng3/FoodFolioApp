import {TastePref} from "@redux_store/user";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {Button} from "native-base";
import React, {memo} from "react";
import {StyleSheet, Text} from "react-native";

type TastePrefToggleProps = {
    tastePref: TastePref;
    editFunc: (tasteId: number, isSelected: boolean) => void;
};

function TastePrefToggle({tastePref, editFunc}: TastePrefToggleProps) {
    return (
        <Button
            style={{
                ...styles.button,
                backgroundColor: tastePref.isChosen
                    ? COLOURS.BRAND_800
                    : "white"
            }}
            onPress={() => editFunc(tastePref.tasteId, tastePref.isChosen)}
        >
            <Text
                style={{
                    color: !tastePref.isChosen ? COLOURS.BRAND_800 : "white"
                }}
            >
                {tastePref.tasteName}
            </Text>
        </Button>
    );
}

export default memo(TastePrefToggle);

const styles = StyleSheet.create({
    button: {
        marginRight: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLOURS.BRAND_900,
        padding: 6,
        borderRadius: 30
    }
});
