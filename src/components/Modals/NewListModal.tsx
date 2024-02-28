import {AppDispatch} from "@/App";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
    useBottomSheetModal
} from "@gorhom/bottom-sheet";
import {useSession} from "@hooks/useSession";
import {createNewList} from "@redux_store/lists";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {Button} from "native-base";
import React, {forwardRef, Ref, useCallback, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components/native";

type NewListModalProps = {
    //addList: (listName: string, listDesc: string) => void;
    closeModal: () => void;
};

/**
 * @description Modal shown when user wants to create a new list
 * @see Place
 * @see Lists
 */
const NewListModal = forwardRef(function NewListModal(
    {closeModal}: NewListModalProps,
    ref: Ref<BottomSheetModal>
) {
    const session = useSession();
    const dispatch: AppDispatch = useDispatch();
    const {dismiss} = useBottomSheetModal();

    /*-----Bottom Sheet modal functions*/
    const snapPoints = useMemo(() => ["50%"], []);
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const [listName, setListName] = useState<string>("");
    const [listDesc, setListDesc] = useState<string>("");

    /**
     * @description Create new list by adding list to database
     */
    async function createList() {
        dispatch(
            createNewList({
                profileId: session.profileId,
                listName,
                listDescription: listDesc,
                listIsPublic: true
            })
        );
        closeModal();
    }

    return (
        <ModalBottomSheet
            ref={ref}
            enablePanDownToClose={true}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            onDismiss={dismiss}
        >
            <ModalContainer>
                <ModalTitle>New list</ModalTitle>
                <ModalInputBox>
                    <ModalInputLabel>Name</ModalInputLabel>
                    <ModalTextInput onChangeText={setListName} />
                </ModalInputBox>
                <ModalInputBox style={{flexGrow: 1}}>
                    <ModalInputLabel>Description</ModalInputLabel>
                    <ModalTextArea
                        multiline={true}
                        onChangeText={setListDesc}
                    />
                </ModalInputBox>
                <ModalButton onPress={createList}>
                    <ModalButtonText>Create List</ModalButtonText>
                </ModalButton>
            </ModalContainer>
        </ModalBottomSheet>
    );
});

export default NewListModal;

const ModalBottomSheet = styled(BottomSheetModal)`
    border-radius: 50px;
`;

const ModalContainer = styled(BottomSheetView)`
    padding: 8px 16px 34px 16px;
    gap: 32px;
    height: 100%;
`;

const ModalTitle = styled.Text`
    font-family: ${FONTS.MULISH_REGULAR};
    font-weight: 400;
    font-size: 24px;
    line-height: 24px;
    color: ${COLOURS.GRAY_800};
`;

const ModalInputBox = styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ModalInputLabel = styled.Text`
    font-family: ${FONTS.MULISH_SEMI_BOLD};
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 2px;
    color: ${COLOURS.GRAY_600};
    text-transform: uppercase;
`;

const ModalTextInput = styled(BottomSheetTextInput)`
    border: 1px ${COLOURS.GRAY_200} solid;
    border-radius: 8px;
    padding: 12px;
    font-size: 15px;
`;

const ModalTextArea = styled(ModalTextInput)`
    flex-grow: 1;
    height: 20%;
    justify-content: flex-start;
`;

const ModalButton = styled(Button)`
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px ${COLOURS.BRAND_900} solid;
    background-color: ${COLOURS.BRAND_800};
`;

const ModalButtonText = styled.Text`
    font-family: ${FONTS.MULISH_BOLD};
    font-weight: 700;
    color: ${COLOURS.WHITE};
    font-size: 15px;
    line-height: 23px;
`;
