import {Ionicons} from "@expo/vector-icons";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "./store";

type UtilSlice = {
    eventAlert: {
        show: boolean;
        text: string;
        iconName: keyof typeof Ionicons.glyphMap | undefined;
    };
};

const initialState: UtilSlice = {
    eventAlert: {show: false, text: "", iconName: undefined}
};

/**
 * @description Util Slice to handle utility and misc states
 */
const utilSlice = createSlice({
    name: "util",
    initialState: initialState,
    reducers: {
        /**
         * @description Display the event alert
         * @param payload show is boolean and true if to show alert, text is string to be shown
         */
        displayEventAlert: (
            state: UtilSlice,
            {payload}: {payload: UtilSlice["eventAlert"]}
        ) => {
            state.eventAlert = {...payload};
        }
    }
});

/*---------------Getters---------------*/
/**
 * @description Get the status of event alert
 * @returns Array of all tags of Collection Type
 */
export const getEventAlertStatus = (store: RootState) => store.util.eventAlert;

export const {displayEventAlert} = utilSlice.actions;

export default utilSlice.reducer;
