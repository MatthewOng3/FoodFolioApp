import React, {ReactNode} from "react";
import {Text, TouchableOpacity} from "react-native";

interface ButtonWithIconsProps {
    children: ReactNode | ReactNode[];
    buttonStyle: object;
    onPress: () => void;
    textStyle?: object;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

/**
 * @description
 * @param children
 * @param styleObject Style object being passed in to customize the component
 * @param onPress
 * @param buttonStyle
 * @param leftIcon
 * @param rightIcon
 */
function ButtonWithIcons({
    children,
    buttonStyle,
    onPress,
    textStyle,
    leftIcon,
    rightIcon
}: ButtonWithIconsProps) {
    return (
        <TouchableOpacity
            style={{...buttonStyle, flexDirection: "row"}}
            onPress={onPress}
        >
            {leftIcon}
            <Text style={textStyle}>{children}</Text>
            {rightIcon}
        </TouchableOpacity>
    );
}

export default ButtonWithIcons;
