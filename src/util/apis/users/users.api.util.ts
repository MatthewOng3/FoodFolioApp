import {Session} from "@supabase/supabase-js";
import axios from "axios";
import {UserPreview} from "src/screens/Friends";
import {RestClient} from "../rest.util";

/**
 * The Base URL for all user API requests
 */
const BASE_URL = `https://a0f1-180-150-39-111.ngrok-free.app/api/users`;

/**
 * The rest client used to execute the API requests
 */
const restClient = new RestClient(
    axios.create({
        baseURL: BASE_URL
    })
);

/**
 * Delete a user's account
 *
 * @param session The user's current session
 */
export const deleteUser = async (session: Session): Promise<boolean> => {
    const request = await restClient.delete("/@me", {
        headers: {
            Authentication: `Bearer ${session.access_token}`
        }
    });
    return request.data.success;
};

/**
 * @param session The user's current session
 */
export const addUserMetadata = async (userId: string): Promise<boolean> => {
    const request = await restClient.post("/add-meta", {
        data: {
            userId: userId
        },
        headers: {
            "Content-Type": "application/json"
        }
    });
    return request.data.success;
};

/**
 * @description Get the recommended user from the backend server
 */
export const getRecommendedUsers = async (
    profileId: number
): Promise<UserPreview[]> => {
    const request = await restClient.post("/get-rec-users", {
        data: {
            profileId: profileId
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    return request.data.data;
};
