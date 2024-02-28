import {NavigationProps} from "@util/types/navigation.types";
import {Button, FlatList, Heading} from "native-base";
import React, {Fragment, useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useDispatch} from "react-redux";
import TastePrefToggle from "@components/Buttons/TastePrefToggle";
import {useSession} from "@hooks/useSession";
import {
    setLoginStatus,
    setProfileFetchStatus,
    TastePref
} from "@redux_store/user";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {FetchStatus, TasteType} from "@util/constants/constraints";
import {COLOURS} from "@util/constants/styles/colours.constants";
import {FONTS} from "@util/constants/styles/fonts.constants";

export type Taste = {
    tasteId: number;
    tasteName: string;
    tasteType: string;
    isChosen: boolean;
};

type Props = {
    navigation: NavigationProps;
};

function TasteOnboard({navigation}: Props) {
    const dispatch = useDispatch();
    const session = useSession();
    //State for cuisine prefs
    const [cuisineTastes, setCuisineTastes] = useState<TastePref[]>([]);
    //State for dietary prefs
    const [dietary, setDietary] = useState<TastePref[]>([]);

    useEffect(() => {
        getAllTastePrefs();
    }, []);

    async function getAllTastePrefs() {
        const tastePrefs = await supabaseCall("get_all_taste_pref", undefined);

        //Split up the taste profile into cuisines and dietary
        const profilePrefs = tastePrefs.reduce(
            (accum, curr) => {
                accum[
                    curr.tasteType === TasteType[TasteType.Cuisine]
                        ? "cuisines"
                        : "dietary"
                ].push({...curr, isChosen: false, existBeforeUpdate: false});
                return accum;
            },
            {cuisines: [], dietary: []}
        );

        setCuisineTastes(profilePrefs.cuisines);
        setDietary(profilePrefs.dietary);
    }

    /**
     * @description Call back function that is triggered when user selects or deselects a cuisine
     * @param tasteId Taste Id of the taste preference
     */
    function cuisineEditHandler(tasteId: number) {
        const newCuisines = cuisineTastes.map((taste) => {
            if (taste.tasteId === tasteId) {
                return {...taste, isChosen: !taste.isChosen};
            }
            return taste;
        });
        setCuisineTastes(newCuisines);
    }

    /**
     * @description Call back function that is triggered when user selects or deselects a dietary
     * @param tasteId Taste Id of the taste preference
     */
    function dietaryEditHandler(tasteId: number) {
        const newDietary = dietary.map((taste) => {
            if (taste.tasteId === tasteId) {
                return {...taste, isChosen: !taste.isChosen};
            }
            return taste;
        });
        setDietary(newDietary);
    }

    /**
     * @description Add all taste preferences selected for user
     */
    async function completeTasteSelect() {
        const tastePrefs = dietary.concat(cuisineTastes);
        //Filter out non chosen and get the taste ids
        const tasteIds = tastePrefs
            .filter((taste) => taste.isChosen)
            .map((taste) => taste.tasteId);

        //Add taste prefs
        await supabaseCall("add_taste_prefs", {
            input_profile_id: session?.profileId,
            taste_ids: tasteIds
        });

        //Set login status to true
        dispatch(setLoginStatus(true));
        //Set profile fetch status to idle to prompt a refetch of data
        dispatch(setProfileFetchStatus(FetchStatus.Idle));
        //Must navigate to home after
        navigation.navigate("Home");
    }

    /**
     * @description
     */
    function selectAllCuisines() {
        const newCuisineTastes = cuisineTastes.map((cuisine) => {
            return {...cuisine, isChosen: true};
        });
        setCuisineTastes(newCuisineTastes);
    }

    return (
        <Fragment>
            <SafeAreaView style={{flex: 1, backgroundColor: COLOURS.BRAND_50}}>
                <View style={{flex: 1, padding: 20}}>
                    {/*Taste Profile*/}
                    <Heading
                        size={"2xl"}
                        color={COLOURS.BRAND_900}
                    >
                        Taste Profile
                    </Heading>

                    <Text style={{fontFamily: FONTS.MULISH_SEMI_BOLD}}>
                        Your taste profile helps us to understand your
                        preferences better, so that we can tailor a more
                        personalised Foodfolio experience for you
                    </Text>

                    {/*Cuisines selection*/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text style={styles.subHeading}>Cuisines</Text>
                        <Button
                            size="md"
                            colorScheme={"orange"}
                            variant={"ghost"}
                            onPress={selectAllCuisines}
                        >
                            <Text
                                style={{
                                    fontWeight: "500",
                                    color: COLOURS.BRAND_800
                                }}
                            >
                                Select all
                            </Text>
                        </Button>
                    </View>

                    <View>
                        <FlatList
                            data={cuisineTastes}
                            keyExtractor={(item) => item.tasteId.toString()}
                            renderItem={({item}) => (
                                <TastePrefToggle
                                    editFunc={cuisineEditHandler}
                                    tastePref={item}
                                />
                            )}
                            numColumns={3}
                            scrollEnabled={false}
                        />
                    </View>

                    <Text style={styles.subHeading}>Dietary Restrictions</Text>
                    <View>
                        <FlatList
                            data={dietary}
                            keyExtractor={(item) => item.tasteId.toString()}
                            renderItem={({item}) => (
                                <TastePrefToggle
                                    editFunc={dietaryEditHandler}
                                    tastePref={item}
                                />
                            )}
                            numColumns={3}
                            scrollEnabled={false}
                        />
                    </View>

                    <Button
                        style={{
                            backgroundColor: COLOURS.BRAND_800,
                            borderColor: COLOURS.BRAND_900,
                            height: 50,
                            borderRadius: 8,
                            marginTop: 15
                        }}
                        onPress={completeTasteSelect}
                    >
                        Complete setup
                    </Button>
                </View>
            </SafeAreaView>
        </Fragment>
    );
}

export default TasteOnboard;

const styles = StyleSheet.create({
    subHeading: {
        marginVertical: 20,
        fontSize: 17,
        fontWeight: "700",
        // fontFamily: FONTS.MULISH_BOLD,
        color: COLOURS.BRAND_900
    }
});
