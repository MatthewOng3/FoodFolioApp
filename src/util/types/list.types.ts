import {FsqPlace} from "./fsq/fsq.places.types";

//--------------LIST INFO TYPES-----------------

//Type for list info object
export interface ListInfoResponse {
    listId: number;
    listName: string;
    listDescription: string;
    lastUpdated: string;
    places: ListPlaces[];
}

//Typeing for the list entry details after Api data is retrieved
export interface ListEntryPlaces {
    listEntryId: number;
    listEntryDesc: string;
    listEntryType: number;
    listEntryPlaceInfo: FsqPlace;
}

//Type for list entry details retrieved from supabase before API call
export type ListPlaces = {
    listEntryId: number;
    apiPlaceId: string;
    listEntryType: number;
    listEntryDesc: string;
};
