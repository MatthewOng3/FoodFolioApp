import React from "react";
import {Icon, Input} from "native-base";
import {Entypo} from "@expo/vector-icons";

type SearchBarProps = {
    crossEnabled: boolean;
    leftElem: JSX.Element | JSX.Element[];
    searchText: string;
    setSearchText: (text: string) => void;
    onFocus: () => void;
};

/**
 * @description Search Bar Component for any screen
 * @param leftElem Left Icon
 * @param crossEnabled Boolean value indicating if the cross to cancel text is enabled
 * @param searchText Value of the typed text
 * @param setSearchText Callback function to set text state
 * @param onFocus Callback function that is fired when input is focused
 * @returns
 */
function SearchBar({
    leftElem,
    crossEnabled,
    searchText,
    setSearchText,
    onFocus
}: SearchBarProps) {
    return (
        <Input
            placeholder="Search People & Places"
            width="100%"
            borderRadius="4"
            py="3"
            px="1"
            fontSize="14"
            InputLeftElement={leftElem}
            InputRightElement={
                crossEnabled && (
                    <Icon
                        m="2"
                        mr="3"
                        size="6"
                        color="gray.400"
                        onPress={() => setSearchText("")}
                        as={<Entypo name="cross" />}
                    />
                )
            }
            value={searchText}
            onChangeText={setSearchText}
            onFocus={onFocus}
        />
    );
}

export default SearchBar;
