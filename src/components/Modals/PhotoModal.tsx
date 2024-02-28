import {AppDispatch} from "@/App";
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {useSession} from "@hooks/useSession";
import {updateProfilePic} from "@redux_store/user";
import {COLOURS} from "@util/constants/styles/colours.constants";
import * as ImagePicker from "expo-image-picker";
import {IconButton, Modal} from "native-base";
import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {useDispatch} from "react-redux";
import ButtonWithIcons from "../Buttons/ButtonWithIcons";
import BasicModalDisplay from "./BasicModalDisplay";

type PhotoModalProps = {
    closePhotoModal: () => void;
    setProfileUri: (uri: string) => void;
};

function PhotoModal({closePhotoModal, setProfileUri}: PhotoModalProps) {
    const {session} = useSession();
    const dispatch = useDispatch<AppDispatch>();
    const [infoModal, setInfoModal] = useState<boolean>(false);

    async function uploadImage(mode: string) {
        try {
            let result: ImagePicker.ImagePickerResult;

            if (mode === "gallery") {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                    base64: true
                });
            } else {
                const response =
                    await ImagePicker.requestCameraPermissionsAsync();

                if (response.granted) {
                    result = await ImagePicker.launchCameraAsync({
                        cameraType: ImagePicker.CameraType.front,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 1
                    });
                }
                //If can't be asked again and permission was not granted
                else if (!response.canAskAgain && !response.granted) {
                    //Display a popup directing to enable permission
                    result = {assets: null, canceled: true};
                    setInfoModal(true);
                }
            }

            if (!result.canceled) {
                await saveImage(result.assets[0]);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function saveImage(image: ImagePicker.ImagePickerAsset) {
        dispatch(
            updateProfilePic({
                userId: session.user.id,
                newProfilePic: image.uri
            })
        );

        setProfileUri(image.uri);
        closePhotoModal();
    }

    function closeModal() {
        setInfoModal(false);
    }

    return (
        <BottomSheetView
            style={{paddingHorizontal: 16, paddingVertical: 15, height: "100%"}}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{"Profile Photo"}</Text>
                <IconButton
                    colorScheme={"black"}
                    key={"ghost"}
                    variant={"ghost"}
                    _icon={{
                        as: AntDesign,
                        name: "close"
                    }}
                    onPress={closePhotoModal}
                />
            </View>
            <View style={styles.optionsContainer}>
                <ButtonWithIcons
                    buttonStyle={styles.optionsContainer}
                    textStyle={{
                        ...styles.optionsText,
                        color: COLOURS.BRAND_800
                    }}
                    leftIcon={
                        <Ionicons
                            name="camera"
                            size={24}
                            color={COLOURS.BRAND_600}
                        />
                    }
                    rightIcon={<></>}
                    onPress={() => uploadImage("")}
                >
                    Camera
                </ButtonWithIcons>
                <ButtonWithIcons
                    buttonStyle={styles.optionsContainer}
                    textStyle={{
                        ...styles.optionsText,
                        color: COLOURS.BRAND_800
                    }}
                    leftIcon={
                        <FontAwesome
                            name="picture-o"
                            size={24}
                            color={COLOURS.BRAND_600}
                        />
                    }
                    rightIcon={<></>}
                    onPress={() => uploadImage("gallery")}
                >
                    Gallery
                </ButtonWithIcons>
            </View>
            <Modal
                isOpen={infoModal}
                onClose={closeModal}
            >
                <BasicModalDisplay
                    header={"Renable camera permission"}
                    closeModal={closeModal}
                    backgroundColor={COLOURS.WHITE}
                >
                    <Text>
                        Permission request can only be prompted once so renable
                        camera permissions in your settings!
                    </Text>
                </BasicModalDisplay>
            </Modal>
        </BottomSheetView>
    );
}

export default PhotoModal;

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
