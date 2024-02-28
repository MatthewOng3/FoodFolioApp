import {AppDispatch} from "@App";
import {displayEventAlert} from "@redux_store/util";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {sendSupportEmail} from "@util/apis/email/email.util";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {Button} from "native-base";
import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {useDispatch} from "react-redux";

type Props = {
    email: string;
    alertText: string;
    sheetHeader: string;
    closeSheet: () => void;
};

function ContactSupportSheet({
    email,
    alertText,
    sheetHeader,
    closeSheet
}: Props) {
    const dispatch = useDispatch<AppDispatch>();

    const [subject, setSubject] = useState<string>("");
    const [issueText, setIssueText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function sendEmail() {
        setLoading(true);
        const result = await sendSupportEmail(email, subject, issueText);

        if (result) {
            setLoading(false);
            closeSheet();
            dispatch(
                displayEventAlert({
                    show: true,
                    text: alertText,
                    iconName: "thumbs-up"
                })
            );
        }
    }

    return (
        <View
            style={{
                paddingHorizontal: 16,
                paddingVertical: 15,
                height: "100%",
                gap: 10
            }}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{sheetHeader}</Text>
            </View>
            <View style={{height: 50}}>
                <BottomSheetTextInput
                    placeholder="Title"
                    placeholderTextColor="#4E5D6C"
                    style={styles.issueText}
                    onChangeText={setSubject}
                    value={subject}
                />
            </View>
            <View style={{height: 150}}>
                <BottomSheetTextInput
                    multiline={true}
                    placeholder="Enter description here"
                    placeholderTextColor="#4E5D6C"
                    style={styles.issueText}
                    onChangeText={setIssueText}
                    value={issueText}
                />
            </View>

            <Button
                style={styles.sendButton}
                isLoading={loading}
                spinnerPlacement="end"
                isLoadingText="Sending Email"
                onPress={sendEmail}
            >
                Send
            </Button>
        </View>
    );
}

export default ContactSupportSheet;

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
    issueText: {
        alignSelf: "stretch",
        padding: 12,
        borderRadius: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#CBD2D9",
        backgroundColor: "white",
        color: "#4E5D6C",
        fontSize: 15,
        textAlignVertical: "top",
        flexGrow: 1,
        justifyContent: "flex-start"
    },
    sendButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWith: 1,
        borderStyle: "solid",
        borderColor: "#601D00",
        backgroundColor: COLOURS.BRAND_800,
        marginTop: 20
    }
});
