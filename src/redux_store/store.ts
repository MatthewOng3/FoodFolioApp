import {configureStore} from "@reduxjs/toolkit";
import listReducer from "./lists";
import userReducer from "./user";
import utilReducer from "./util";

export const store = configureStore({
    reducer: {
        user: userReducer,
        list: listReducer,
        util: utilReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
