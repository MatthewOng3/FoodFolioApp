import {UserPreview} from "src/screens/Friends";
import {ProfileInfo, TastePref} from "../../redux_store/user";
import {FsqPlace} from "./fsq/fsq.places.types";
import {ListInfoResponse} from "./list.types";

//List info slice types combining place info and
export type ListInfoSlice = {
    listId: number;
    listName: string;
    listDescription: string;
    lastUpdated: string;
    places: ListInfoSliceEntry[];
};

export type ListInfoSliceEntry = {
    listEntryId: number;
    listEntryType: number;
    listEntryDesc: string;
    apiPlaceId: string;
    listEntryPlaceInfo: FsqPlace;
};

export type ListPreview = {
    listId: number;
    listName: string;
    listDescription: string;
};

export type PlaceStats = {
    placeId: number;
    apiPlaceId: string;
    placeSavedCount: number;
    placeRecommendedCount: number;
};

//Response when user gets lists, list slice lists field
export interface UserListResponse {
    listId: number;
    listName: string;
    listDescription: string;
    listIsPublic: boolean;
    listShareId: string;
    listPlacesCount: number;
}

export type SupabaseFunctions = {
    //Add a new list
    add_list: {
        Args: {
            input_profile_id: number;
            input_list_name: string;
            input_list_description: string;
            input_list_is_public: boolean;
        };
        Returns: {listId: number; listShareId: string};
    };
    //Insert taste pref profile relations
    add_taste_prefs: {
        Args: {
            input_profile_id: number;
            taste_ids: number[];
        };
        Returns: null;
    };
    //Block user
    block_user: {
        Args: {
            in_blocker_id: number;
            in_blocked_id: number;
        };
        Returns: boolean;
    };
    //Delete a list
    delete_list: {
        Args: {
            del_list_id: number;
        };
        Returns: null;
    };
    //Delete a single palce
    delete_place: {
        Args: {
            del_list_entry_id: number;
        };
        Returns: null;
    };
    //Follow a user
    follow_user: {
        Args: {
            follower_profile_id: number;
            following_profile_id: number;
        };
        Returns: boolean;
    };
    //Unfollow a user
    unfollow_user: {
        Args: {
            input_follower_profile_id: number;
            input_unfollowing_profile_id: number;
        };
        Returns: boolean;
    };
    //Delete the input place from the input lists
    delete_place_from_lists: {
        Args: {
            del_list_ids: number[];
            del_api_place_id: string;
        };
        Returns: null;
    };
    //Retrieve all possible taste preferences
    get_all_taste_pref: {
        Args: undefined;
        Returns: TastePref[];
    };
    //Retrieve date joined
    get_date_joined: {
        Args: {
            input_profile_id: number;
        };
        Returns: string;
    };
    //Retrieve all of users lists
    get_lists: {
        Args: {
            input_profile_id: number;
        };
        Returns: UserListResponse[];
    };
    //Retrieve all lists with the input place
    get_lists_with_saved_place: {
        Args: {
            input_profile_id: number;
            input_api_place_id: string;
        };
        Returns: number[];
    };
    //
    get_onboard_status: {
        Args: {
            input_profile_id: number;
        };
        Returns: boolean;
    };
    //Retrieve profile id
    get_profile_id: {
        Args: {
            input_user_id: string;
        };
        Returns: number;
    };
    //Retrieve profile preview, used in adding friends
    get_profile_preview: {
        Args: {
            input_profile_id: number;
        };
        Returns: UserPreview;
    };
    //Get all taste_preferences of a profile
    get_profile_taste_pref: {
        Args: {
            input_profile_id: number;
        };
        Returns: TastePref[];
    };
    //Get users in the argument
    get_specific_users: {
        Args: {
            user_profile_ids: number[];
        };
        Returns: UserPreview[];
    };
    //Get users friends
    get_user_friends: {
        Args: {
            input_profile_id: number;
        };
        Returns: UserPreview[];
    };
    //Get user info using user uuid
    get_user_info: {
        Args: {
            input_profile_id: number;
        };
        Returns: ProfileInfo;
    };
    //Check if user is being followed
    is_user_followed: {
        Args: {
            input_follower_profile_id: number;
            input_following_profile_id: number;
        };
        Returns: boolean;
    };
    //Check if place is saved in user lists
    is_place_saved: {
        Args: {
            input_api_place_id: string;
            input_profile_id: number;
        };
        Returns: boolean;
    };
    //Retrieve User list Information
    list_info: {
        Args: {
            list_id_input: number;
        };
        Returns: ListInfoResponse;
    };
    // Get a place's stats like saved count and recommended count
    get_place_stats: {
        Args: {
            input_api_place_id: string;
        };
        Returns: PlaceStats | null;
    };
    //Save place to selected lists
    save_place: {
        Args: {
            profile_id: number;
            list_ids: number[];
            api_place_id: string;
            list_entry_description: string;
            entry_type: number;
        };
        Returns: null;
    };
    //Function to search for users
    search_users: {
        Args: {
            user_profile_id: number;
            username_search_text: string;
        };
        Returns: UserPreview[];
    };
    update_list: {
        Args: {
            del_list_entry_ids: number[];
            input_list_id: number;
            new_list_name: string;
            new_list_description: string;
        };
        Returns: boolean;
    };
    update_profile: {
        Args: {
            input_profile_id: number;
            new_profile_name: string;
            new_profile_bio: string;
            new_taste_pref_ids: number[];
            del_taste_pref_ids: number[];
        };
        Returns: boolean;
    };
    update_profile_url: {
        Args: {
            input_user_id: string;
            input_profile_url: string;
        };
        Returns: null;
    };
    follow_list: {
        Args: {
            input_user_id: string;
            input_list_id: number;
        };
        Returns: boolean;
    };
    is_following_list: {
        Args: {
            input_user_id: string;
            input_list_id: number;
        };
        Returns: boolean;
    };
};
