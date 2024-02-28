import {COLOURS} from "@util/constants/styles/colours.constants";
import {Button, Checkbox, Modal} from "native-base";
import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import WebView from "react-native-webview";
import BasicModalDisplay from "./Modals/BasicModalDisplay";

type Props = {
    onChange: (flag: boolean) => void;
};

function Policies({onChange}: Props) {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [showTerms, setShowTerms] = useState<boolean>(false);

    const openModal = (type: string) => () => {
        if (type === "terms") {
            setShowTerms(true);
        }

        setTimeout(() => {
            setModalVisible(true);
        }, 300);
    };

    function closeModal() {
        setModalVisible(false);
        setShowTerms(false);
    }

    return (
        <View style={styles.container}>
            <Checkbox
                value="test"
                onChange={onChange}
                aria-label="Checkbox"
            />
            <View>
                <Text style={{marginLeft: 20}}>
                    By registering you are agreeing to our
                </Text>
                <Button
                    variant={"ghost"}
                    style={styles.button}
                    onPress={openModal("terms")}
                >
                    Terms and conditions
                </Button>
                <Button
                    variant={"ghost"}
                    style={styles.button}
                    onPress={openModal("pol")}
                >
                    Privacy Policy
                </Button>
            </View>
            <Modal
                isOpen={modalVisible}
                onClose={closeModal}
            >
                {showTerms ? (
                    <BasicModalDisplay
                        header={"Terms and conditions"}
                        closeModal={closeModal}
                        backgroundColor={COLOURS.BRAND_150}
                    >
                        <View style={{flex: 1, height: 380, width: "100%"}}>
                            <WebView
                                originWhitelist={["https://*", "http://*"]}
                                source={{uri: `https://foodfolioapp.com/terms`}}
                                style={{width: 300, flex: 1}}
                            />
                        </View>
                    </BasicModalDisplay>
                ) : (
                    <BasicModalDisplay
                        header={"Privacy Policy"}
                        closeModal={closeModal}
                        backgroundColor={COLOURS.BRAND_150}
                    >
                        <View style={{flex: 1, height: 380, width: "100%"}}>
                            <WebView
                                originWhitelist={["https://*", "http://*"]}
                                source={{
                                    uri: `https://foodfolioapp.com/policy`
                                }}
                                style={{width: 300, flex: 1}}
                            />
                        </View>
                    </BasicModalDisplay>
                )}
            </Modal>
        </View>
    );
}

export default Policies;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center"
    },
    button: {
        borderBottomColor: "orange",
        padding: -20
    }
});
