import {NavigationProp} from "@react-navigation/native";
import {UserPreview} from "src/screens/Friends";
import {FsqPlace} from "./fsq/fsq.places.types";
import {Coordinates} from "./misc.types";

/**
 * @description Types for list info screen
 * @param listId list Id of the list it is displaying, list_id in backend
 */
export type ListInfoScreenParams = {
    listId: number;
    listShareId: string;
    profileId: number;
};

export type PlaceScreenParams = {
    placeId: string;
};

export type LoginScreenParams = {
    onboard: boolean;
};

/**
 * Parameters for explore screen.
 * @param coordinates The initial coordinates the map should focus on
 */
export type ExploreScreenParams = {
    coordinates?: Coordinates;
    places?: FsqPlace[];
};

export type ListsScreenParams = undefined;

export type ResetPwdScreenParams = {
    access_token?: string;
    refresh_token?: string;
    error_code?: string;
    error_description?: string;
};

export type PublicProfileParams = {
    profileInfo: UserPreview;
};

//Types to define the screens and params
export type StackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Login: LoginScreenParams;
    Register: undefined;
    ForgotPwd: undefined;
    TasteOnboard: undefined;
    ResetPwd: ResetPwdScreenParams;
    Explore: ExploreScreenParams;
    Home: undefined;
    ListInfo: ListInfoScreenParams;
    Place: PlaceScreenParams;
    Lists: ListsScreenParams;
    Friends: undefined;
    PublicProfile: PublicProfileParams;
};

export type NavigationProps = NavigationProp<StackParamList>;
