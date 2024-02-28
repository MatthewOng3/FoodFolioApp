import {AntDesign} from "@expo/vector-icons";
import {BottomSheetTextInput, BottomSheetView} from "@gorhom/bottom-sheet";
import {BottomSheetMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {snapToIndex} from "@util/BottomSheetFuncs";
import {Button, Divider} from "native-base";
import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/App";
import {useSession} from "@hooks/useSession";
import {
    deletePlaceFromLists,
    savePlace,
    updateListInfo
} from "@redux_store/lists";
import {displayEventAlert} from "@redux_store/util";
import {COLORS} from "@util/constants/theme";

import {UserListResponse} from "@util/types/supabase.types";
import MultipleSelectCheckbox from "../MultipleSelectCheckbox";
import ScreenHeader from "../ScreenHeader";
import NewListModal from "./NewListModal";

type PlaceModalProps = {
    placeId: string;
    isSaving: boolean;
    lists: UserListResponse[];
    closeFunc: () => void;
    bottomSheetRef: React.MutableRefObject<BottomSheetMethods>;
    setIsSaved: (flag: boolean) => void;
    isNewListModalOpen: boolean;
    setNewListModalOpen: (flag: boolean) => void;
};

/**
 * @description Modal that allows you to save a place to lists or remove a place from lists
 * @param isSaving Boolean value indicating if the modal is being used for saving or deletion, true if for saving
 * @param onPressFunc Function to call depending on save or removing
 * @param lists Array of list objects indicating what lists the user has
 * @see
 */
function PlaceModal({
    placeId,
    isSaving,
    lists,
    closeFunc,
    isNewListModalOpen,
    setIsSaved,
    setNewListModalOpen,
    bottomSheetRef
}: PlaceModalProps) {
    const session = useSession();
    const dispatch: AppDispatch = useDispatch();

    //State to keep track of chosen lists to insert in
    const [listSelections, setListSelections] = useState<number[]>([]);
    //Keeps track of the not selected lists, for deleting
    const [nonSelectedLists, setNonSelectedLists] = useState<number[]>([]);
    //const [isNewListModalOpen, setNewListModalOpen] = useState<boolean>(false)
    const [error, setError] = useState<{show: boolean; text: string}>({
        show: false,
        text: ""
    });

    //For showing ONLY which lists the place has been saved in
    useEffect(() => {
        const res = isSaving ? [] : lists.map((list) => list.listId);
        setListSelections(res);
    }, [isSaving, lists]);

    //Modal open states
    const [saveType] = useState<number>(1);

    //New Place Description
    const [description, setDescription] = useState<string>("");

    /**
     * @description Save place to selected lists
     */
    async function savePlaceToList() {
        if (listSelections.length <= 0) {
            setError({show: true, text: "Must save to at least one list!"});
            return;
        }

        dispatch(
            savePlace({
                profileId: session.profileId,
                lists: listSelections,
                description,
                placeId,
                entryType: saveType
            })
        );

        setIsSaved(true);
        //Close all modals
        //closePlaceModal();
        closeFunc();
        //Dispatch action to util slice to display event alert
        dispatch(
            displayEventAlert({
                show: true,
                text: `Saved to ${listSelections.length.toString()} lists!`,
                iconName: "bookmark"
            })
        );
        //Dispatch action to update local state
        dispatch(
            updateListInfo({
                type: "save",
                listIdSelections: listSelections,
                apiPlaceId: ""
            })
        );
    }

    /**
     * @description Delete the place from all but selected lists
     * @see lists
     */
    async function removePlace() {
        dispatch(
            deletePlaceFromLists({
                delListsIds: nonSelectedLists,
                placeApiId: placeId
            })
        );
        setIsSaved(false);
        closeFunc();
        //Dispatch action to update local state
        dispatch(
            updateListInfo({
                type: "delete",
                listIdSelections: nonSelectedLists,
                apiPlaceId: placeId
            })
        );
    }

    /**
     * @description Function called depending if saving or removing
     */
    function onPressFunc() {
        isSaving ? savePlaceToList() : removePlace();
    }

    function openNewListModal() {
        snapToIndex(bottomSheetRef, 2);
        setNewListModalOpen(true);
    }

    return (
        <BottomSheetView>
            {/*Modal shown when no lists exist and prompt to create new list*/}
            {isNewListModalOpen && <NewListModal closeModal={closeFunc} />}

            {!isNewListModalOpen && (
                <BottomSheetView
                    style={{
                        paddingHorizontal: 16,
                        paddingBottom: 30,
                        height: "100%"
                    }}
                >
                    {/*Modal Header Component*/}
                    <ScreenHeader
                        headerText={
                            isSaving
                                ? "Save place to list"
                                : "Remove place from lists?"
                        }
                        leftIcon={<></>}
                        rightIcon={<></>}
                    />
                    {/**/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: "700",
                                lineHeight: 20,
                                letterSpacing: 0.15,
                                color: "#323F4B"
                            }}
                        >
                            Your lists
                        </Text>
                        {isSaving && (
                            <Button
                                size="md"
                                variant={"ghost"}
                                onPress={openNewListModal}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        lineHeight: 23,
                                        letterSpacing: 0,
                                        color: COLORS.brown600
                                    }}
                                >
                                    New list
                                </Text>
                            </Button>
                        )}
                    </View>

                    {/*Lists Selection*/}
                    {error.show && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                                marginBottom: 5
                            }}
                        >
                            <AntDesign
                                name="exclamationcircleo"
                                size={20}
                                color="red"
                            />
                            <Text style={{color: "red"}}>{error.text}</Text>
                        </View>
                    )}

                    {listSelections && (
                        <View style={{height: "32%"}}>
                            <MultipleSelectCheckbox
                                listData={lists}
                                setListSelections={setListSelections}
                                startingListChoices={listSelections}
                                setNonListSelections={setNonSelectedLists}
                            />
                        </View>
                    )}

                    {/*Save type selection and desription box, only there when user is saving*/}
                    {isSaving && (
                        <>
                            <Divider
                                my="2"
                                _light={{
                                    bg: "muted.800"
                                }}
                                _dark={{
                                    bg: "muted.50"
                                }}
                            />

                            {/* <SingleChoiceButtons 
							choices={[{key: "Want to go", value: SaveType.wantToGo}, {key: "Been To", value: SaveType.beenTo}]} 
							onPress={(chosenType: number) => setSaveType(chosenType)} /> */}

                            {/*Description box*/}
                            <View
                                style={{
                                    ...styles.new_list_input_box,
                                    height: 170
                                }}
                            >
                                <Text style={styles.new_list_input_label}>
                                    Description
                                </Text>
                                <BottomSheetTextInput
                                    multiline={true}
                                    placeholder="Write any notes you have about this place here."
                                    placeholderTextColor="#4E5D6C"
                                    style={{
                                        ...styles.new_list_input,
                                        textAlignVertical: "top",
                                        flexGrow: 1,
                                        justifyContent: "flex-start"
                                    }}
                                    onChangeText={setDescription}
                                    value={description}
                                />
                            </View>
                        </>
                    )}

                    <Button
                        style={styles.new_list_btn}
                        onPress={onPressFunc}
                    >
                        Save
                    </Button>
                </BottomSheetView>
            )}
        </BottomSheetView>
    );
}

export default PlaceModal;

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
    },
    list_name_text: {
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 23,
        letterSpacing: 0,
        color: "#323F4B"
    },
    list_sub_text: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0.2,
        color: "#7B8794"
    },
    new_list_input_box: {
        gap: 8
    },
    new_list_input_label: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 12,
        letterSpacing: 1.5,
        color: "#7B8794"
    },
    new_list_input: {
        alignSelf: "stretch",
        padding: 12,
        borderRadius: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#CBD2D9",
        backgroundColor: "white",
        color: "#4E5D6C",
        fontSize: 15
    },
    new_list_btn: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWith: 1,
        borderStyle: "solid",
        borderColor: "#601D00",
        backgroundColor: COLORS.brown600,
        marginTop: 20
    }
});
