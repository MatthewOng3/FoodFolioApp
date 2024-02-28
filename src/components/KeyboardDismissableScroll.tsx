import React from "react";
import {KeyboardAvoidingView, ScrollView} from "react-native";

interface Props {
    children?: React.ReactNode;
}

const KeyboardDismissibleScroll = ({children}: Props) => {
    return (
        <KeyboardAvoidingView
            behavior="height"
            style={{height: 700, paddingHorizontal: 10}}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{height: "100%"}}
                keyboardDismissMode="interactive"
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default KeyboardDismissibleScroll;
