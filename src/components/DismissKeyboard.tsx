import React from "react";
import {Keyboard, TouchableWithoutFeedback, View} from "react-native";

interface Props {
    children: JSX.Element;
    styleObj?: object;
}

/**
 * @description Nest child elements so they can press anywhere on the screen to exit the keyboard
 * @param children Nested JSX element
 */
function DismissKeyboardView({children, styleObj}: Props) {
    return (
        <View style={{flex: 1, ...styleObj}}>
            <TouchableWithoutFeedback
                style={{flex: 1, backgroundColor: "orange"}}
                onPress={() => Keyboard.dismiss()}
            >
                {children}
            </TouchableWithoutFeedback>
        </View>
    );
}

export default DismissKeyboardView;
