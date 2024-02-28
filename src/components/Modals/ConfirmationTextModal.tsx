import {Button, Input, Modal} from "native-base";
import React, {useState} from "react";
import {StyleSheet, Text} from "react-native";

type Props = {
    title: string;
    textToMatch: string;
    isOpen: boolean;
    setModalVisible: (flag: boolean) => void;
    confirmFunction: () => void;
};

function ConfirmationTextModal({
    title,
    textToMatch,
    isOpen,
    setModalVisible,
    confirmFunction
}: Props) {
    const [error, setError] = useState<string>("");
    const [enteredText, setEnteredText] = useState<string>("");

    function confirmFunctionHandler() {
        if (enteredText.trim() === textToMatch.trim()) {
            confirmFunction();
            setModalVisible(false);
        } else {
            setError("The entered text does not match.");
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={setModalVisible}
            size={"md"}
        >
            <Modal.Content maxH="220">
                <Modal.CloseButton />
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    {error && <Text style={styles.errorMsg}>{error}</Text>}
                    <Input
                        size="md"
                        placeholder="Enter Text"
                        value={enteredText}
                        onChangeText={(e) => setEnteredText(e)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onPress={confirmFunctionHandler}>
                            Confirm
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

export default ConfirmationTextModal;

const styles = StyleSheet.create({
    errorMsg: {
        color: "red",
        marginBottom: 4
    }
});
