import {useNavigation} from "@react-navigation/native";
import {UserPreview} from "@screens/Friends";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {NavigationProps} from "@util/types/navigation.types";
import React, {ReactElement} from "react";
import {Pressable, TouchableOpacity} from "react-native";
import styled from "styled-components/native";

type Props = {
    user: UserPreview;
    icon?: ReactElement;
    onIconPress?: () => void;
};

/**
 * @description Profile preview in searching users result
 * @param info
 */
function FriendPreview({user, icon, onIconPress}: Props) {
    const navigation = useNavigation<NavigationProps>();

    return (
        <PreviewContainer
            onPress={() => {
                navigation.navigate("PublicProfile", {profileInfo: user});
            }}
        >
            <UserContainer>
                <UserAvatar
                    source={{uri: user.avatar}}
                    alt="Profile Avatar"
                />
                <UserText>{user.username}</UserText>
            </UserContainer>
            <Pressable onPress={onIconPress}>
                <IconContainer>{icon}</IconContainer>
            </Pressable>
        </PreviewContainer>
    );
}

export default FriendPreview;

const PreviewContainer = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const UserContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
`;

const UserAvatar = styled.Image`
    border-radius: 50px;
    height: 40px;
    width: 40px;
`;

const UserText = styled.Text`
    font-family: ${FONTS.MULISH_SEMI_BOLD};
    font-size: 15px;
    line-height: 23px;
    color: ${COLOURS.GRAY_800};
`;

const IconContainer = styled.View`
    display: flex;
`;
