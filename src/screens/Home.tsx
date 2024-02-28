import {AntDesign, Feather} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs/src/types";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";
import {COLORS} from "@util/constants/theme";
import React, {cloneElement, ReactElement} from "react";
import styled from "styled-components/native";
import Explore from "./Explore";
import Friends from "./Friends";
import Lists from "./Lists";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

type TabTileProps = {
    label: string;
    icon: ReactElement;
    iconSize: number;
    focused: boolean;
};

/**
 * A component for the icons in the Tab Navigator at the bottom of the screen
 *
 * @param label The name of the tile
 * @param icon The icon that should be used
 * @param iconSize The size of the icon
 * @param focused The focus state of the screen
 */
const TabTile = ({label, icon, iconSize, focused}: TabTileProps) => {
    // Recreates the icon but sets the colour and size accordingly
    const formattedIcon = cloneElement(icon, {
        size: iconSize,
        color: focused ? COLOURS.BRAND_800 : COLOURS.GRAY_400
    });

    return (
        <TabIconContainer>
            {formattedIcon}
            <TabText
                style={{color: focused ? COLOURS.BRAND_800 : COLOURS.GRAY_400}}
            >
                {label}
            </TabText>
        </TabIconContainer>
    );
};

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
    return (
        <TabBarContainer>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel.toString()
                        : options.title !== undefined
                          ? options.title
                          : route.name;

                const isFocused = state.index === index;

                const tabIcon = options.tabBarIcon({
                    focused: isFocused,
                    color: COLOURS.BLACK,
                    size: 24
                });

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key
                    });
                };

                return (
                    <TabBarIconContainer
                        focused={isFocused}
                        key={`${label}_tab`}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        {tabIcon}
                    </TabBarIconContainer>
                );
            })}
        </TabBarContainer>
    );
};

/**
 * @description Home page with the bottom tab navigators
 * @returns
 */
function Home() {
    return (
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    paddingTop: 30,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }
            }}
        >
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <TabTile
                                label="Explore"
                                icon={<AntDesign name="search1" />}
                                iconSize={size}
                                focused={focused}
                            />
                        );
                    }
                }}
            />
            <Tab.Screen
                name="Lists"
                component={Lists}
                options={{
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <TabTile
                                label="Lists"
                                icon={<AntDesign name="book" />}
                                iconSize={size}
                                focused={focused}
                            />
                        );
                    }
                }}
            />
            <Tab.Screen
                name="Friends"
                component={Friends}
                options={{
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <TabTile
                                label="Friends"
                                icon={<Feather name="users" />}
                                iconSize={size}
                                focused={focused}
                            />
                        );
                    }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <TabTile
                                label="Profile"
                                icon={<Feather name="user" />}
                                iconSize={size}
                                focused={focused}
                            />
                        );
                    }
                }}
            />
        </Tab.Navigator>
    );
}

export default Home;

const TabBarContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 86px;
    padding-bottom: 20px;
    background-color: ${COLOURS.WHITE};
`;

const TabBarIconContainer = styled.Pressable<{focused: boolean}>`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-color: ${(props) =>
        props.focused ? COLOURS.BRAND_800 : COLOURS.GRAY_200};
    border-top-width: 2px;
    border-top-style: solid;
    height: 100%;
    flex-grow: 1;
`;

const TabIconContainer = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    min-height: 100%;
`;

const TabText = styled.Text`
    font-family: ${FONTS.MULISH_REGULAR};
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: ${COLOURS.GRAY_800};
`;
