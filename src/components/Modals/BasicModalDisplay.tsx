import {Button, Modal} from "native-base";
import React from "react";

type BasicModalDisplayProps = {
    header: string;
    children: JSX.Element;
    closeModal: () => void;
    backgroundColor: string;
};

function BasicModalDisplay({
    header,
    children,
    closeModal,
    backgroundColor
}: BasicModalDisplayProps) {
    return (
        <Modal.Content
            maxH="700"
            width={"80%"}
        >
            <Modal.CloseButton />
            <Modal.Header backgroundColor={backgroundColor}>
                {header}
            </Modal.Header>
            <Modal.Body backgroundColor={backgroundColor}>
                {children}
            </Modal.Body>
            <Modal.Footer backgroundColor={backgroundColor}>
                <Button.Group space={2}>
                    {/* <Button variant="ghost" colorScheme="blueGray" onPress={closeModal}>
                    Cancel
                </Button> */}
                    <Button onPress={closeModal}>Ok</Button>
                </Button.Group>
            </Modal.Footer>
        </Modal.Content>
    );
}

export default BasicModalDisplay;
