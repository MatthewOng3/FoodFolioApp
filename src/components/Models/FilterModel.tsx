// //Components
// import {StyleSheet, Text, View} from 'react-native'
// import React, {useState} from 'react'
// import DropDownPicker from 'react-native-dropdown-picker';
// import Slider from '@react-native-community/slider';

// //Design
// import {COLORS} from '../../constants/theme';
// import ScreenHeader from '../../components/ScreenHeader';
// import {cuisineChoices, MAX_RADIUS, MIN_RADIUS, priceRange} from '../../constants/constraints';
// import {Button, Modal, Portal} from 'react-native-paper';

// /*Type for preferences for searching places*/
// export type FinderSettings = {
//     cuisine: string;
//     budget: number;
//     radius: number;
// }

// interface FinderProps {
//     isOpen: boolean;
//     closeModal: () => void;
//     setSearchPrefs: (searchPrefs: FinderSettings | null) => void;
// }

// /**
//  * @description Restaurant Finder Modal where user can input their parameters and algorithm will query back results based on parameters
//  * @library React Native Paper
//  */
// function Finder({isOpen, closeModal, setSearchPrefs}: FinderProps){

//     //Cuisine to filter for
//     const [cuisineChoice, setCuisineChoice] = useState<string>("");
//     //Price level to filter for
//     const [budget, setBudget] = useState<number>(0);
//     //Radius of API query
//     const [radius, setRadius] = useState<number>(1);
//     //States for dropdown visibility
//     const [showCuisineDropdown, setShowCuisineDropdown] = useState<boolean>(false);
//     const [showBudgetDropdown, setShowBudgetDropdown] = useState<boolean>(false);

//     /**
//      * @description Set the search preferences for the discover page query to google api
//      * @see Discover
//      */
//     function searchPlace(){
//         setSearchPrefs({cuisine: cuisineChoice, budget: budget, radius: radius})
//         closeModal()
//     }

//   return (
//     <Portal>
//         <Modal visible={isOpen} onDismiss={closeModal} contentContainerStyle={{marginTop: 20, marginBottom: 20, alignItems: 'center'}}>
//             <View style={{ backgroundColor: COLORS.orange, paddingVertical: 25, height: 500,  width: '80%', borderRadius: 10}}>
//                 {/*------Header------*/}
//                 <ScreenHeader headerText={'Restaurant Finder'} leftIcon={null} rightIcon={null}/>
//                 <View style={styles.parameterContainer}>
//                     {/*------Dropdown Selector for categories------*/}
//                     <View style={{...styles.dropdownContainer, zIndex: 4}}>
//                         <DropDownPicker
//                             style={{borderRadius: 20}}
//                             open={showCuisineDropdown}
//                             value={cuisineChoice}
//                             items={cuisineChoices}
//                             setOpen={setShowCuisineDropdown}
//                             placeholder='Choose Cuisine'
//                             setValue={setCuisineChoice}
//                             />
//                     </View>
//                     {/*------Dropdown component for budget------*/}
//                     <View style={styles.dropdownContainer}>
//                         <DropDownPicker
//                         style={{borderRadius: 20}}
//                         open={showBudgetDropdown}
//                         value={budget}
//                         items={priceRange}
//                         setOpen={setShowBudgetDropdown}
//                         placeholder='Set Budget (Per Pax AUD)'
//                         setValue={setBudget}
//                         />
//                     </View>
//                     {/*------Slider component for radius ------*/}
//                     <View style={styles.sliderContainer}>
//                         <Text>Radius</Text>
//                         <Text style={styles.radiusText}>{radius + " km"}</Text>
//                         <Slider
//                         style={{width: 200, height: 40}}
//                         minimumValue={MIN_RADIUS}
//                         maximumValue={MAX_RADIUS}
//                         onValueChange={(val)=>setRadius(val)}
//                         step={0.5}
//                         minimumTrackTintColor="#FFFFFF"
//                         maximumTrackTintColor="#000000"
//                         />
//                     </View>
//                     {/*------Slider component for radius ------*/}
//                     <Button icon="magnify" mode="contained" onPress={searchPlace}>
//                         Search
//                     </Button>
//                     <Button icon="" mode="contained" onPress={() => setSearchPrefs(null)}>
//                         Reset Preferences
//                     </Button>
//                 </View>
//             </View>
//         </Modal>
//     </Portal>
//   )
// }

// export default Finder

// const styles = StyleSheet.create({
//     parameterContainer:{
//         justifyContent: 'space-evenly',
//         alignItems: 'center',
//         flex: 1,
//     },
//     sliderContainer: {
//         zIndex: 1
//     },
//     dropdownContainer: {
//         width: '75%',
//         backgroundColor: 'white',
//         borderRadius: 20,
//         zIndex: 3
//     },
//     radiusText: {
//         fontWeight: 'bold',
//         fontSize: 18
//     }
// })
