import EventAlert from "@components/EventAlert";
import {getEventAlertStatus} from "@redux_store/util";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import React, {ReactNode} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useSelector} from "react-redux";
import styled from "styled-components/native";

const ScreenContainer = styled(SafeAreaView)`
    height: 100%;
    padding: 0 15px 0 15px;
    flex: 1;
`;

const ScreenHeader = styled.View`
    margin: 15px 0 25px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ScreenHeaderIcon = styled.View`
    min-width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ScreenTitle = styled.Text`
    font-family: ${FONTS.INTER_SEMI_BOLD};
    font-size: 20px;
    color: ${COLOURS.GRAY_800};
    flex: 1;
    text-align: center;
    align-self: center;
`;

type ScreenViewProps = {
    title: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
};

const ScreenView = ({
    title,
    leftIcon,
    rightIcon,
    children
}: ScreenViewProps) => {
    const eventAlert = useSelector(getEventAlertStatus);

    return (
        <ScreenContainer>
            <ScreenHeader>
                <ScreenHeaderIcon>{leftIcon}</ScreenHeaderIcon>
                <ScreenTitle>{title}</ScreenTitle>
                <ScreenHeaderIcon>{rightIcon}</ScreenHeaderIcon>
            </ScreenHeader>
            {children}
            {eventAlert.show && (
                <EventAlert
                    text={eventAlert.text}
                    iconName={eventAlert?.iconName}
                />
            )}
        </ScreenContainer>
    );
};

export default ScreenView;
