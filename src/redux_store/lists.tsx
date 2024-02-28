import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatus} from "@util/constants/constraints";
import {getDistanceFromLatLonInKm} from "@util/FilterPlaces";
import {getPlacesDetails} from "@util/apis/places/places.util";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {FsqPlace} from "@util/types/fsq/fsq.places.types";
import {Coordinates, StringKeyArrayMap} from "@util/types/misc.types";
import {
    ListInfoSlice,
    ListInfoSliceEntry,
    UserListResponse
} from "@util/types/supabase.types";
import {RootState} from "./store";

/*Types*/

//Type for collection slice
interface ListSlice {
    lists: StringKeyArrayMap<UserListResponse>;
    error: string;
    listInfo: StringKeyArrayMap<ListInfoSlice>;
    placeDetails: StringKeyArrayMap<FsqPlace>;
    listSliceLoading: boolean;
    listOpStatus: FetchStatus;
}

export interface ListInfoUpdateReducer {
    type: "save" | "delete";
    listIdSelections: number[];
    apiPlaceId: string;
}

/**
 * @description Create a new list for the user
 * @param payload name of tag to add
 * @returns
 */
const createNewList = createAsyncThunk(
    "list/createNewList",
    async (
        {
            profileId,
            listName,
            listDescription,
            listIsPublic
        }: {
            profileId: number | undefined;
            listName: string;
            listDescription: string;
            listIsPublic: boolean;
        },
        {rejectWithValue}
    ) => {
        try {
            //If userId undefined
            if (!profileId) {
                return;
            }

            const {listId, listShareId} = await supabaseCall("add_list", {
                input_profile_id: profileId,
                input_list_name: listName,
                input_list_description: listDescription,
                input_list_is_public: listIsPublic
            });

            return {
                profileId,
                listName,
                listDescription,
                isPublic: listIsPublic,
                listId: listId,
                listIsPublic,
                listPlacesCount: 0,
                listShareId
            };
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Delete list or lists from the user
 * @param listIds list of string list ids to delete
 * @returns boolean value indicating if success or not
 */
const deleteLists = createAsyncThunk(
    "list/deleteLists",
    async (listId: number, {rejectWithValue}) => {
        try {
            await supabaseCall("delete_list", {del_list_id: listId});

            return listId;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Delete place from multiple lists
 */
const deletePlaceFromLists = createAsyncThunk(
    "list/deletePlaceFromLists",
    async (
        {delListsIds, placeApiId}: {delListsIds: number[]; placeApiId: string},
        {rejectWithValue}
    ) => {
        try {
            //Insert single entry into entries table and return new row entry_id
            await supabaseCall("delete_place_from_lists", {
                del_list_ids: delListsIds,
                del_api_place_id: placeApiId
            });

            return {delListsIds, placeApiId};
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Retrieve user's lists
 * @see Lists
 * @returns UserListResponse[]
 */
const retrieveLists = createAsyncThunk(
    "list/retrieveLists",
    async ({profileId}: {profileId: number | undefined}, {rejectWithValue}) => {
        try {
            if (!profileId) {
                return;
            }

            //Call function to return json object of list rows related to userId
            const userLists = await supabaseCall("get_lists", {
                input_profile_id: profileId
            });

            if (!userLists) {
                return rejectWithValue("0 Lists");
            }

            return userLists;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Retrieve all list information related to a list such as name, description, places
 * @see ListInfo
 */
const retrievePlacesFromList = createAsyncThunk(
    "list/retrievePlacesFromList",
    async (
        {listId, userLocation}: {listId: number; userLocation: Coordinates},
        {rejectWithValue}
    ) => {
        try {
            //Query all information related to the list
            const listInfo = await supabaseCall("list_info", {
                list_id_input: listId
            });

            if (!listInfo) {
                return rejectWithValue("0 places");
            }

            //Use the api place id of each place and query place details
            const places = await Promise.all(
                listInfo.places.map(async (place) => {
                    const placeResponse = await getPlacesDetails(
                        place.apiPlaceId
                    );

                    const placeDetails = {
                        ...placeResponse,
                        distance: getDistanceFromLatLonInKm(
                            userLocation.lat,
                            userLocation.lng,
                            placeResponse.geocodes.main.latitude,
                            placeResponse.geocodes.main.longitude
                        )
                    };
                    return {
                        ...place,
                        listEntryPlaceInfo: placeDetails
                    } as ListInfoSliceEntry;
                })
            );

            const resListPlaces =
                places.length > 0
                    ? places
                          .filter((place) => place != null)
                          .map((place) => place!)
                    : [];

            return {
                listInfo: {...listInfo, places: resListPlaces},
                listPlaces: resListPlaces
            };
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Save place to lists of user
 * @param lists Array of list ids to save the place to
 * @param description Description of place
 * @param placeId Google place id of restaurant
 * @param entryType SaveType enum value,
 */
const savePlace = createAsyncThunk(
    "list/savePlace",
    async (
        {
            profileId,
            lists,
            description,
            placeId,
            entryType
        }: {
            profileId: number;
            lists: number[];
            description: string;
            placeId: string;
            entryType: number;
        },
        {rejectWithValue}
    ) => {
        try {
            //Insert single entry into entries table and return new row entry_id
            const listEntryIds = await supabaseCall("save_place", {
                profile_id: profileId,
                list_ids: lists,
                list_entry_description: description,
                api_place_id: placeId,
                entry_type: entryType
            });

            return {lists, description, placeId, entryType, listEntryIds};
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/**
 * @description Update list details of a list
 * @param delListEntryIds Array of list_entry_ids integers identifying list entries that needs to be deleted
 * @param listId listId of list being updated
 * @param newListName New List Name
 * @param newListDesc new list description
 */
const updateList = createAsyncThunk(
    "list/updateList",
    async (
        {
            delListEntryIds,
            listId,
            newListName,
            newListDesc
        }: {
            delListEntryIds: number[];
            listId: number;
            newListName: string;
            newListDesc: string;
        },
        {rejectWithValue}
    ) => {
        try {
            //Insert single entry into entries table and return new row entry_id
            const success = await supabaseCall("update_list", {
                del_list_entry_ids: delListEntryIds,
                input_list_id: listId,
                new_list_name: newListName,
                new_list_description: newListDesc
            });

            return success
                ? {delListEntryIds, listId, newListName, newListDesc}
                : rejectWithValue("Error updating list");
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const initialState: ListSlice = {
    lists: {},
    listInfo: {},
    placeDetails: {},
    error: "",
    listSliceLoading: false,
    listOpStatus: FetchStatus.Idle
};

const listSlice = createSlice({
    name: "list",
    initialState: initialState,
    reducers: {
        /**
         * @description Update the list places count
         * @param payload
         */
        updateListPlaceCount: (state, {payload}) => {
            state.listInfo = payload;
        },
        /**
         * @description Update state to trigger rerender when place is saved or unsaved
         */
        updateListInfo: (
            state,
            action: PayloadAction<ListInfoUpdateReducer>
        ) => {
            if (action.payload.type === "save") {
                //Add 1 count to state lists that the place is saved to
                action.payload.listIdSelections.forEach((listId) => {
                    state.lists[listId].listPlacesCount += 1;
                });
                //Trigger rerender in list info
                state.listOpStatus = FetchStatus.Idle;
            }
            //Else if place is being removed
            else {
                //Remove 1 count to state lists that the place is saved to
                action.payload.listIdSelections.forEach((listId) => {
                    state.lists[listId].listPlacesCount -= 1;
                });

                //Delete the place from list info where list entry id is same as input
                // action.payload.listIdSelections.forEach((listId) => {
                //     state.listInfo[listId].places = state.listInfo[listId].places.filter((place) => {
                //         place.apiPlaceId !== action.payload.apiPlaceId
                //     })
                // })

                //Trigger rerender in list info
                state.listOpStatus = FetchStatus.Idle;
            }
        },
        setListLoadingStatus: (state, {payload}) => {
            state.listSliceLoading = payload;
        }
    },
    extraReducers(builder) {
        /**
         * @description Cases for adding lists
         * @param payload UserListResponse type
         */
        builder.addCase(createNewList.fulfilled, (state, {payload}) => {
            //Add list using list Id as key and UserListResponse as value
            if (payload?.listId) {
                state.lists[payload.listId] = {...payload};
            }
        });
        /**
         * @description Builder cases for deleting place from lists
         */
        builder
            .addCase(deletePlaceFromLists.pending, (state) => {
                state.listSliceLoading = true;
            })
            .addCase(deletePlaceFromLists.fulfilled, (state, {payload}) => {
                //Filter out the deleted place from listInfo
                payload.delListsIds.forEach((listId) => {
                    const listInfo = state.listInfo[listId];

                    if (listInfo !== undefined) {
                        state.listInfo[listId].places = state.listInfo[
                            listId
                        ].places.filter((place) => {
                            return (
                                place.listEntryPlaceInfo.fsq_id !=
                                payload.placeApiId
                            );
                        });
                    }
                });
                //Remove place details info from place details state
                delete state.placeDetails[payload.placeApiId];
                state.listSliceLoading = false;
            })
            .addCase(deletePlaceFromLists.rejected, (state) => {
                state.listSliceLoading = false;
            });

        /**
         * @description Cases for deleting lists
         * @param payload Boolean value indicating if the delete operation failed or listIds array
         */
        builder
            .addCase(deleteLists.pending, (state) => {
                state.listSliceLoading = true;
            })
            .addCase(deleteLists.fulfilled, (state, {payload}) => {
                //If delete operation succeeded, remove the values from dictionary

                //Remove all deleted lists from list state
                delete state.lists[payload];
                //Remove all deleted lists from list info state
                delete state.listInfo[payload];

                state.listSliceLoading = false;
            })
            .addCase(deleteLists.rejected, (state) => {
                state.listSliceLoading = false;
            });
        /**
         * @description Cases for retrieving user lists
         * @param payload UserListResponse[]
         * @pending Set loading status to true to activate loading spinner
         * @fulfilled Set state lists
         * @rejected Set loading status to false
         */
        builder
            .addCase(retrieveLists.pending, (state) => {
                state.listSliceLoading = true;
            })
            .addCase(retrieveLists.fulfilled, (state, {payload}) => {
                if (payload) {
                    //Populate the list field in list slice
                    state.lists = payload.reduce((acc, listDet) => {
                        acc[listDet.listId] = {...listDet};
                        return acc;
                    }, {});
                }
                state.listSliceLoading = false;
            })
            .addCase(retrieveLists.rejected, (state) => {
                state.listSliceLoading = false;
            });
        /**
         * @description Cases for retrieving
         */
        builder
            .addCase(retrievePlacesFromList.pending, (state) => {
                state.listSliceLoading = true;
                state.listOpStatus = FetchStatus.Loading;
            })
            //If operation success, set the collection_id as key and the list as value
            .addCase(retrievePlacesFromList.fulfilled, (state, {payload}) => {
                //Set the list's list Id as dict key
                if (payload) {
                    //Save list info in list info state with listId as key
                    state.listInfo[payload.listInfo.listId] = payload.listInfo;
                    //Store place data in local state
                    payload.listPlaces.map((place) => {
                        state.placeDetails[place.apiPlaceId] =
                            place.listEntryPlaceInfo;
                    });
                }
                state.listOpStatus = FetchStatus.Success;
                state.listSliceLoading = false;
            })
            .addCase(retrievePlacesFromList.rejected, (state) => {
                state.listOpStatus = FetchStatus.Failed;
                state.listSliceLoading = false;
            });
        /**
         * @description Save place cases
         */
        builder
            .addCase(savePlace.fulfilled, (state) => {
                //TODO , might not even need it tbh
                // //Update local state to insert new entry into the selected lists
                // payload.lists.forEach((listId) => {
                //     //If previous entry exists, add new place to places array
                //     const existingList = state.listInfo[listId];

                //     if (existingList) {
                //         // If the list already exists, update the places array
                //         const updatedPlaces = [
                //             ...existingList.places,
                //             {

                //             placeGoogleId: payload.placeId,
                //             listEntryDesc: payload.description,
                //             listEntryType: payload.entryType,
                //             },
                //         ];

                //         state.listInfo[listId] = {
                //             ...existingList,
                //             places: updatedPlaces,
                //         };
                //     }

                // })
                //Prompt to refetch
                state.listOpStatus = FetchStatus.Idle;
            })
            .addCase(savePlace.rejected, (state) => {
                state.listOpStatus = FetchStatus.Failed;
            });

        /**
         * @description Cases for updating list
         */
        builder
            .addCase(updateList.pending, (state) => {
                state.listSliceLoading = true;
                state.listOpStatus = FetchStatus.Loading;
            })
            .addCase(updateList.fulfilled, (state, {payload}) => {
                if (payload) {
                    const newName = payload.newListName;
                    const newDesc = payload.newListDesc;
                    //Get current places of ListInfo
                    const currPlaceList = state.listInfo[payload.listId].places;

                    //Create a new list where the list entry ids are not in the deleting list entry ids array
                    const newPlaceList = currPlaceList.filter((listEntry) => {
                        !payload.delListEntryIds.includes(
                            listEntry.listEntryId
                        );
                    });

                    //Update the ListInfo object with a new one
                    state.listInfo[payload.listId] = {
                        ...state.listInfo[payload.listId],
                        places: newPlaceList,
                        listName: newName,
                        listDescription: newDesc
                    };
                }
                //Need to set to idle so screens can refetch updated list
                state.listOpStatus = FetchStatus.Idle;
                state.listSliceLoading = false;
            })
            .addCase(updateList.rejected, (state) => {
                state.listSliceLoading = false;
                state.listOpStatus = FetchStatus.Failed;
            });
    }
});

/*---------------Getters---------------*/
/**
 * @description Get all tags related to user account
 * @returns Array of all tags of Collection Type
 */
const getListState = (store: RootState) => store.list.lists;

/**
 * @description Get the status of backend CRUD
 * @returns Boolean value true if backend retrieval is ongoing else false
 */
const isListSliceLoading = (store: RootState) => store.list.listSliceLoading;

/**
 * @description Get list information of a list
 * @returns ListInfoResponse Object
 */
const getListInfo = (listId: number) => (store: RootState) => {
    try {
        return store.list.listInfo[listId];
    } catch (err) {
        console.error("Error in getting list info", err);
        return undefined;
    }
};

/**
 * @description Get all place details of places in the input
 * @return
 */
const getPlacesOfList = (listId: number) => (store: RootState) => {
    try {
        return store.list.listInfo[listId].places;
    } catch (err) {
        console.error("Error in getting entry details", err);
        return [];
    }
};

/**
 * @description Get the list operation status
 * @param store
 * @returns
 */
const getListOpStatus = (store: RootState) => store.list.listOpStatus;

const doesListPlacesExist = (listId: number) => (store: RootState) => {
    try {
        store.list.listInfo[listId];
    } catch (err) {
        return false;
    }
};

//Regular reducer actions
export const {updateListPlaceCount, setListLoadingStatus, updateListInfo} =
    listSlice.actions;

//Selector getters
export {
    getPlacesOfList,
    isListSliceLoading,
    getListState,
    getListInfo,
    getListOpStatus,
    doesListPlacesExist
};
//Async thunk reducers
export {
    savePlace,
    retrieveLists,
    createNewList,
    deleteLists,
    retrievePlacesFromList,
    deletePlaceFromLists,
    updateList
};

export default listSlice.reducer;
