import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {Button} from "native-base";
import React, {Key, useState} from "react";
import styled from "styled-components/native";

type ChoiceObject<T> = {
    key: string;
    value: T;
};

type ChoiceButtonProps<T> = {
    choices: Array<ChoiceObject<T>>;
    onPress: (choice: T) => void;
};

/**
 * @description Component to display a list of buttons in a row order, only able to select one
 * @param choices List of string texts indicating button choices
 * @param onPress Function passed in to be called in switchFunc when button is clicked
 */
function SingleChoiceButtons<T extends Key | undefined | number | string>({
    choices,
    onPress
}: ChoiceButtonProps<T>) {
    //Current chosen tag
    const [activeChoice, setActiveChoice] = useState<ChoiceObject<T>>(
        choices[0]
    );

    /**
     * @description Function called when button is pressed
     * @param currChoice
     */
    function switchFunc(currChoice: ChoiceObject<T>) {
        if (activeChoice.key === currChoice.key) {
            return;
        }
        setActiveChoice(currChoice);
        //Call passed in function
        onPress(currChoice.value);
    }

    return (
        <ChoicesContainer>
            {choices.map(({key, value}) => (
                <ChoiceButton
                    key={key}
                    active={activeChoice.key === key}
                    onPress={() => switchFunc({key, value})}
                >
                    <ChoiceButtonText active={activeChoice.key === key}>
                        {key}
                    </ChoiceButtonText>
                </ChoiceButton>
            ))}
        </ChoicesContainer>
    );
}

export default SingleChoiceButtons;

const ChoicesContainer = styled.View`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 8px;
`;

const ChoiceButton = styled(Button)<{active: boolean}>`
    padding: 6px 16px;
    border-radius: 72px;
    border: 1px ${COLOURS.BRAND_900} solid;
    background-color: ${(props) =>
        props.active ? COLOURS.BRAND_800 : "transparent"};
`;

const ChoiceButtonText = styled.Text<{active: boolean}>`
    font-size: 15px;
    color: ${(props) => (props.active ? COLOURS.WHITE : COLOURS.BRAND_800)};
    font-weight: 700;
    font-family: ${FONTS.MULISH_BOLD};
`;
