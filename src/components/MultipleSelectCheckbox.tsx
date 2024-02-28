import {FlatList} from "native-base";
import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {UserListResponse} from "@util/types/supabase.types";
import Checkbox from "./Buttons/Checkbox";

type MultipleSelectCheckboxProps = {
    listData: UserListResponse[];
    setListSelections: (values: number[]) => void;
    setNonListSelections: (values: number[]) => void;
    startingListChoices: number[];
};

/**
 * @description Custom component allowing multiple selection with checkboxes, it is also memoized
 * @param listData Data of all user lists
 * @param setListSelections Callback function to set list selections in parent state
 * @param startingListChoices The starting choices of selected lists when user is trying to remove
 * @see PlaceModal
 */
function MultipleSelectCheckbox({
    listData,
    setListSelections,
    setNonListSelections,
    startingListChoices
}: MultipleSelectCheckboxProps) {
    //State to keep track of current list choices in this component
    const [listChoices, setListChoices] =
        useState<number[]>(startingListChoices);
    // State to keep track of unselected list choices
    const [unselectedListChoices, setUnselectedListChoices] = useState<
        number[]
    >(
        listData
            .filter((item) => !startingListChoices.includes(item.listId))
            .map((item) => item.listId)
    );

    /**
     * @description Function called on each checkbox state change, holds the state of what element is checked
     * @param choiceId listId of selected list
     * @param selected True if checkbox is selected false otherwise
     */
    const onSelect = (choiceId: number) => (selected: boolean) => {
        if (selected) {
            // Add to selected list and remove from unselected list
            setListChoices((prevChoices) => [...prevChoices, choiceId]);
            setUnselectedListChoices((prevChoices) =>
                prevChoices.filter((id) => id !== choiceId)
            );
        } else {
            // Remove from selected list and add to unselected list
            setListChoices((prevChoices) =>
                prevChoices.filter((id) => id !== choiceId)
            );
            setUnselectedListChoices((prevChoices) => [
                ...prevChoices,
                choiceId
            ]);
        }
    };

    //Each time the list choice changes due to on select function, we update the passed in callback function
    //for the selected and non selected states
    useEffect(() => {
        // Call setListSelections with the updated listChoices whenever it changes
        setListSelections(listChoices);
        setNonListSelections(unselectedListChoices);
    }, [listChoices]);

    return (
        <FlatList
            data={listData}
            renderItem={({item}) => (
                <Checkbox
                    value={item.listId.toString()}
                    colorScheme="orange"
                    defaultIsChecked={startingListChoices.includes(item.listId)}
                    onChange={onSelect(item.listId)}
                    key={item.listId}
                >
                    <View>
                        <Text style={styles.listNameText}>{item.listName}</Text>
                        <Text
                            style={styles.listSubText}
                        >{`${item.listPlacesCount} places`}</Text>
                    </View>
                </Checkbox>
            )}
        />
    );
}

export default MultipleSelectCheckbox;

const styles = StyleSheet.create({
    listBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "##CBD2D9",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        width: "100%"
    },
    listNameText: {
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 23,
        letterSpacing: 0,
        color: "#323F4B"
    },
    listSubText: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0.2,
        color: "#7B8794"
    }
});
