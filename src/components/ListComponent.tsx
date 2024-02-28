import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import React from "react";
import {UserListResponse} from "@util/types/supabase.types";
import styled from "styled-components/native";

type ListCompProps = {
    list: UserListResponse;
    isFollowing: boolean; //Indicates if the list is a list that user is following and does not own
    onPress: (() => void) | ((listId: number, listShareId: string) => void);
};

/**
 * @description List component representing each list preview in list page
 * @param list List of the component
 * @param isFollowing Bool value indicating if the list is a following list
 */
function ListComponent({list, onPress}: ListCompProps) {
    function pressHandler() {
        onPress(list.listId, list.listShareId);
    }

    return (
        <ListBox
            key={list.listId}
            onPress={pressHandler}
        >
            <ListName>{list.listName}</ListName>
            <ListSubText>{`${list.listPlacesCount} places`}</ListSubText>
        </ListBox>
    );
}

export default ListComponent;

const ListBox = styled.TouchableOpacity`
    border: 1px ${COLOURS.GRAY_200} solid;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    // TODO Use gap on the parent list item, rather than margin-bottom here
    margin-bottom: 8px;
`;

const ListName = styled.Text`
    font-family: ${FONTS.MULISH_BOLD};
    font-weight: 700;
    color: ${COLOURS.GRAY_800};
    font-size: 15px;
    line-height: 23px;
    letter-spacing: 0;
`;

const ListSubText = styled.Text`
    font-family: ${FONTS.MULISH_REGULAR};
    font-weight: 400;
    color: ${COLOURS.GRAY_400};
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0;
`;
